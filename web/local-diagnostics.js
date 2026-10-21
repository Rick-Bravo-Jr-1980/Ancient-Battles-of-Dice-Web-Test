/* Local-only, bounded diagnostics. No network API, profile or save access. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory;
  else root.ABDiagnostics = factory(root);
})(typeof window !== 'undefined' ? window : globalThis, function createDiagnostics(host) {
  'use strict';
  const PHASES = new Set(['loading','menu','profile','army_selection','deployment','pips','movement','combat','casualties','camera','victory','saving','resuming','exiting','campaign']);
  const CODES = new Set(['javascript_exception','promise_rejection','startup_failure','wasm_failure','resource_failure','godot_error','godot_warning','save_failure','resume_failure','suspected_stall','scheduler_gap','storage_unavailable','storage_failure','context_lost','normal_exit','engine_exit_error']);
  const MAX_EVENTS = 96, MAX_SESSIONS = 5, MAX_BIN = 1000;
  const clock = () => host.performance.now();
  const wall = () => new Date().toISOString();
  const finite = (v, max = 1e12) => Number.isFinite(Number(v)) ? Math.max(0, Math.min(max, Number(v))) : 0;
  let enabled = !new URLSearchParams(host.location.search).has('diagnostics_off');
  let database = null, storage = 'opening', previous = [], lastPulse = clock(), lastTick = clock(), lastWrite = 0;
  let stalled = false, hidden = !!host.document.hidden, closed = false, ready = false, panel = null;
  let overheadMs = 0, overheadCalls = 0, ignoreUntil = 0;
  const liveSessions=new Set();let channel=null;
  const session = {
    schema: 1, id: host.crypto.randomUUID(), release: {version:'unversioned-local',date:null},
    start: wall(), end:null, status:'active', last_heartbeat:wall(), last_context:{phase:'loading'},
    environment: {user_agent:host.navigator.userAgent, platform:host.navigator.userAgentData?.platform || host.navigator.platform || 'unavailable',
      viewport:[host.innerWidth,host.innerHeight],device_pixel_ratio:host.devicePixelRatio,cross_origin_isolated:!!host.crossOriginIsolated},
    loading_ms:null, package_bytes:null, wasm_bytes:null, events:[], phases:{},
    memory:{value:null,unit:'bytes',scope:null,reason:'Reliable total browser/game memory is not exposed by this browser. No estimate substituted.'},
    sampling:{method:'One wall-clock engine frame interval every eight frames; 1 ms histogram bins; FPS monitor sampled once per second.',
      percentile_scope:'Sampled wall-clock process-frame intervals, not GPU timings; >1000 ms frames use overflow bin.', background_excluded:true},
    event_totals:{confirmed_errors:0,warnings:0,suspected_stalls:0}, diagnostics_cost:{js_ms:0,js_calls:0,godot_sample_us:0,godot_samples:0}
  };
  function timed(fn) { const start=clock(); try { return fn(); } finally { overheadMs+=clock()-start; overheadCalls++; } }
  function context(value = {}) {
    const result = {phase:PHASES.has(value.phase)?value.phase:'menu'};
    const scenario = String(value.scenario || '');
    result.scenario = /^(marathon|plataea|delium|sphacteria|lechaeum|nemea|coronea|mantinea_418|tutorial|thermopylae_[123]|miltiades_[1-5])$/.test(scenario)?scenario:'skirmish';
    result.armies = Array.isArray(value.armies)?value.armies.slice(0,2).map(s=>String(s).match(/^[IV]+\/[0-9]+[a-z]?/)?.[0] || 'unspecified'):[];
    result.elements = finite(value.elements,256); result.animated_elements=finite(value.animated_elements,256);
    return result;
  }
  function event(code, severity='confirmed_error') {
    if (!enabled || !CODES.has(code)) return;
    // Never copy raw exception messages/stacks/URLs: these can contain names,
    // local paths, query strings or data interpolated from a saved profile.
    const allowedSeverity = ['confirmed_error','warning','suspected_interruption','information'].includes(severity)?severity:'warning';
    const tail=session.events[session.events.length-1];
    if (tail && tail.code===code && tail.context.phase===session.last_context.phase && clock()-tail.at_ms<5000) { tail.repetitions++; return; }
    session.events.push({code,severity:allowedSeverity,at:wall(),at_ms:Math.round(clock()),context:{...session.last_context},repetitions:1});
    if(session.events.length>MAX_EVENTS)session.events.shift();
    if(allowedSeverity==='confirmed_error')session.event_totals.confirmed_errors++;
    if(allowedSeverity==='warning')session.event_totals.warnings++;
    if(code==='suspected_stall')session.event_totals.suspected_stalls++;
  }
  function stats(phase) {
    return session.phases[phase] ||= {histogram:{},samples:0,frame_ms_sum:0,max_frame_ms:0,spikes_over_50_ms:0,
      fps_sum:0,fps_samples:0,min_fps:null,low_fps_observed_seconds:0,observed_seconds:0,elements_max:0,animated_elements_max:0};
  }
  function ingest(value) {
    if(!enabled || closed)return;
    timed(()=>{
      lastPulse=clock(); stalled=false;
      session.last_context=context(value.context); session.last_heartbeat=wall();
      if(hidden || clock()<ignoreUntil)return;
      for(const [phase,batch] of Object.entries(value.phases || {}).slice(0,16)) {
        if(!PHASES.has(phase))continue;
        const out=stats(phase);
        for(const [bin,count] of Object.entries(batch.histogram || {}).slice(0,MAX_BIN+1)) {
          const b=Math.round(finite(bin,MAX_BIN)), n=Math.round(finite(count,10000));
          if(!n)continue;
          out.histogram[b]=(out.histogram[b]||0)+n; out.samples+=n;
        }
        out.frame_ms_sum+=finite(batch.frame_ms_sum);
        out.max_frame_ms=Math.max(out.max_frame_ms,finite(batch.max_frame_ms));
        out.spikes_over_50_ms+=finite(batch.spikes_over_50_ms);
      }
      const current=stats(session.last_context.phase);
      const seconds=Math.min(2,finite(value.interval_seconds,2));
      if(Number.isFinite(value.fps) && seconds>0){current.fps_sum+=value.fps*seconds;current.fps_samples+=seconds;current.min_fps=current.min_fps===null?value.fps:Math.min(current.min_fps,value.fps);if(value.fps<30)current.low_fps_observed_seconds+=seconds;}
      current.observed_seconds+=seconds;
      current.elements_max=Math.max(current.elements_max,session.last_context.elements);
      current.animated_elements_max=Math.max(current.animated_elements_max,session.last_context.animated_elements);
      session.diagnostics_cost.godot_sample_us+=finite(value.sample_cost_us);
      session.diagnostics_cost.godot_samples+=finite(value.sample_count);
    });
  }
  function percentile(histogram, fraction) {
    const entries=Object.entries(histogram).map(([b,n])=>[Number(b),n]).sort((a,b)=>a[0]-b[0]);
    const total=entries.reduce((sum,p)=>sum+p[1],0); if(!total)return null;
    let n=0;for(const [bin,count] of entries){n+=count;if(n>=Math.ceil(total*fraction))return bin;}
    return null;
  }
  function snapshot() {
    session.diagnostics_cost.js_ms=overheadMs;session.diagnostics_cost.js_calls=overheadCalls;
    const output=JSON.parse(JSON.stringify(session));
    for(const metric of Object.values(output.phases)) {
      metric.average_fps=metric.fps_samples?metric.fps_sum/metric.fps_samples:null;
      metric.sampled_mean_frame_ms=metric.samples?metric.frame_ms_sum/metric.samples:null;
      metric.frame_ms_p50=percentile(metric.histogram,.5);metric.frame_ms_p95=percentile(metric.histogram,.95);metric.frame_ms_p99=percentile(metric.histogram,.99);
    }
    return output;
  }
  function persist() {
    if(!enabled || !database)return Promise.resolve(false);
    return new Promise(resolve=>{
      try {
        const record=timed(snapshot), tx=database.transaction('sessions','readwrite'), store=tx.objectStore('sessions');
        store.put(record);
        const all=store.getAll();all.onsuccess=()=>{
          const ordered=all.result.sort((a,b)=>b.start.localeCompare(a.start));
          for(const old of ordered.slice(MAX_SESSIONS))store.delete(old.id);
        };
        tx.oncomplete=()=>resolve(true);tx.onabort=tx.onerror=()=>{storage='write_failed';event('storage_failure','warning');resolve(false);};
      }catch(_){storage='unavailable';event('storage_failure','warning');resolve(false);}
    });
  }
  async function initialize() {
    if(!enabled)return;
    try {
      database=await new Promise((resolve,reject)=>{
        const open=host.indexedDB.open('abd-local-diagnostics-v1',1);
        open.onupgradeneeded=()=>open.result.createObjectStore('sessions',{keyPath:'id'});
        open.onsuccess=()=>resolve(open.result);open.onerror=()=>reject();open.onblocked=()=>reject();
      });
      const records=await new Promise(resolve=>{const request=database.transaction('sessions').objectStore('sessions').getAll();request.onsuccess=()=>resolve(request.result);request.onerror=()=>resolve([]);});
      // A recent active record might belong to another tab. Do not relabel it
      // as crashed. An unclosed stale heartbeat is only a suspected interruption.
      if(channel){channel.postMessage({kind:'probe'});await new Promise(resolve=>host.setTimeout(resolve,250));}
      previous=records.filter(r=>r.id!==session.id).sort((a,b)=>b.start.localeCompare(a.start)).slice(0,MAX_SESSIONS-1);
      for(const old of previous) {
        if(['active','background'].includes(old.status)) {
          old.recovery_assessment=liveSessions.has(old.id)?'active_in_another_tab':(channel || Date.now()-Date.parse(old.last_heartbeat)>45000?'suspected_interruption':'unclosed_recent_session');
          old.recovery_note='Not proof of a crash: another tab, navigation, device suspension or termination may explain this record.';
        }
      }
      await persist();
      if(storage==='opening')storage='available';
    }catch(_){storage='unavailable';event('storage_unavailable','warning');}
  }
  function finish(reason='normal_exit') {
    if(!enabled)return Promise.resolve(false);
    closed=true;session.end=wall();session.status=reason==='normal_exit'?'normal_exit':'engine_exit_error';
    if(reason!=='normal_exit')event('engine_exit_error');
    return persist();
  }
  function gameReady() {if(!ready){ready=true;session.loading_ms=Math.round(clock());lastPulse=clock();}}
  function configure(meta={}) {
    session.release={version:/^[a-zA-Z0-9_.-]{1,80}$/.test(meta.version||'')?meta.version:'unversioned-local',date:/^\d{4}-\d{2}-\d{2}$/.test(meta.date||'')?meta.date:null};
    session.package_bytes=Number.isFinite(meta.package_bytes)?meta.package_bytes:null;
    session.wasm_bytes=Number.isFinite(meta.wasm_bytes)?meta.wasm_bytes:null;
  }
  function report() {return {privacy:'Local only. No profile names, save contents, raw error messages, URLs or network transmission.',storage,current:snapshot(),previous};}
  function exportReport() {
    const blob=new host.Blob([JSON.stringify(report(),null,2)],{type:'application/json'});
    const url=host.URL.createObjectURL(blob),a=host.document.createElement('a');
    a.href=url;a.download='ancient-battles-diagnostics-'+new Date().toISOString().slice(0,10)+'.json';a.click();
    host.setTimeout(()=>host.URL.revokeObjectURL(url),1000);
  }
  function openPanel() {
    if(panel){panel.remove();panel=null;}
    panel=host.document.createElement('dialog');panel.style.cssText='max-width:640px;max-height:80vh;background:#f3e3bf;color:#302519;border:2px solid #826032;padding:24px;font:16px Georgia;z-index:99999';
    const title=host.document.createElement('h2');title.textContent='Local diagnostic report';panel.appendChild(title);
    const explanation=host.document.createElement('p');explanation.textContent='Reports stay on this device. Export a report if you choose to share it for troubleshooting. An interrupted session does not prove a crash.';panel.appendChild(explanation);
    const summary=host.document.createElement('pre');summary.style.cssText='white-space:pre-wrap;max-height:35vh;overflow:auto;font:14px monospace';
    const performance=snapshot().phases, label=s=>String(s).replaceAll('_',' ');
    summary.textContent=[
      'Version: '+session.release.version+' ('+(session.release.date||'local build')+')',
      'Session: '+label(session.status),
      'Local history: '+(storage==='available'?'available; up to five sessions':label(storage)+'; this session can still be exported'),
      'Initial loading: '+(session.loading_ms===null?'not completed':(session.loading_ms/1000).toFixed(1)+' seconds'),
      'Current phase: '+label(session.last_context.phase),
      'Confirmed errors: '+session.event_totals.confirmed_errors+' | Warnings: '+session.event_totals.warnings,
      'Suspected stalls: '+session.event_totals.suspected_stalls+' (not confirmed crashes)',
      'Memory: '+(session.memory.value===null?'not measured / unavailable':(session.memory.value/1000000).toFixed(1)+' MB; '+session.memory.scope),
      '', 'Performance (sampled):',
      ...Object.entries(performance).map(([phase,m])=>label(phase)+': '+(m.average_fps===null?'—':m.average_fps.toFixed(1))+' FPS; frame time p95 '+(m.frame_ms_p95??'—')+' ms, p99 '+(m.frame_ms_p99??'—')+' ms'),
      '', 'Recent sessions:',
      ...previous.map(r=>r.start.slice(0,19).replace('T',' ')+' UTC: '+label(r.recovery_assessment||r.status)),
      '', 'The exported file includes browser details and the full measurements.'
    ].join('\n');panel.appendChild(summary);
    for(const [text,fn] of [['Export Diagnostic Report',exportReport],['Delete diagnostic history',async()=>{if(database){await new Promise(resolve=>{const tx=database.transaction('sessions','readwrite');tx.objectStore('sessions').clear();tx.oncomplete=resolve;tx.onerror=resolve;});}previous=[];session.events=[];session.phases={};session.event_totals={confirmed_errors:0,warnings:0,suspected_stalls:0};openPanel();}],['Close',()=>{panel.close();panel.remove();panel=null;}]]) {
      const button=host.document.createElement('button');button.textContent=text;button.style.cssText='margin:6px;padding:10px';button.onclick=fn;panel.appendChild(button);
    }
    if(typeof host.performance.measureUserAgentSpecificMemory==='function'){const button=host.document.createElement('button');button.textContent='Measure browser memory';button.onclick=async()=>{button.disabled=true;try{const measured=await host.performance.measureUserAgentSpecificMemory();session.memory={value:measured.bytes,unit:'bytes',scope:'Browser-reported page and worker memory; not total process RSS',at:wall()};}catch(_){session.memory.reason='Browser denied the memory measurement.';}openPanel();};panel.appendChild(button);}
    host.document.body.appendChild(panel);panel.showModal();
  }
  function tick() {
    if(!enabled || closed)return;
    const now=clock(),gap=now-lastTick;lastTick=now;
    if(!hidden && ready) {
      if(gap>5000)event('scheduler_gap','suspected_interruption');
      else if(now-lastPulse>10000 && !stalled && !['menu','profile','campaign','loading','victory'].includes(session.last_context.phase)){event('suspected_stall','suspected_interruption');stalled=true;}
    }
    if(now-lastWrite>=15000){lastWrite=now;persist();}
  }
  if(enabled) {
    try {if(host.BroadcastChannel){channel=new host.BroadcastChannel('abd-diagnostics-liveness');channel.onmessage=e=>{if(e.data?.kind==='probe'&&!closed)channel.postMessage({kind:'alive',id:session.id});if(e.data?.kind==='alive')liveSessions.add(e.data.id);};}}catch(_){}
    host.addEventListener('error',e=>event(e.target && e.target!==host?'resource_failure':'javascript_exception'),true);
    host.addEventListener('unhandledrejection',()=>event('promise_rejection'));
    host.document.addEventListener('visibilitychange',()=>{if(closed)return;hidden=host.document.hidden;session.status=hidden?'background':'active';lastTick=lastPulse=clock();ignoreUntil=clock()+1000;persist();});
    host.addEventListener('pagehide',()=>{if(closed)return;session.status=['menu','profile','campaign','loading','victory'].includes(session.last_context.phase)?'closed_or_navigated':'interrupted_tab_closed_or_navigated';session.end=wall();persist();});
    host.addEventListener('pageshow',e=>{if(e.persisted){closed=false;session.status='active';session.end=null;lastTick=lastPulse=clock();}});
    host.document.addEventListener('webglcontextlost',()=>event('context_lost'),true);
    host.setInterval(tick,1000);
    initialize();
  }
  return Object.freeze({enabled,ingest,event,finish,configure,gameReady,report,exportReport,openPanel,persist,
    godotError:message=>{const text=String(message);if(/^\s*(SCRIPT ERROR:|ERROR:)/.test(text))event('godot_error');else if(/^\s*WARNING:/.test(text))event('godot_warning','warning');},
    visible:()=>!hidden, _test:{percentile,tick,initialize,context}});
});
