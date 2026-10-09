"""Reassemble and verify the exported game pack before publishing."""
import hashlib
import json
from pathlib import Path
import shutil

root = Path(__file__).resolve().parents[1]
manifest = json.loads((root / "release-manifest.json").read_text())
destination = root / "_site"
destination.mkdir(exist_ok=True)
for source in (root / "web").iterdir():
    if source.is_file():
        shutil.copy2(source, destination / source.name)
digest = hashlib.sha256()
size = 0
with (destination / "index.pck").open("wb") as output:
    for name in manifest["pack_parts"]:
        with (root / "pack" / name).open("rb") as part:
            while block := part.read(1024 * 1024):
                output.write(block)
                digest.update(block)
                size += len(block)
assert size == manifest["pack_bytes"], "Incomplete game pack"
assert digest.hexdigest() == manifest["pack_sha256"], "Game pack checksum mismatch"
assert sum(p.stat().st_size for p in destination.iterdir() if p.is_file()) < 1_000_000_000, "Pages site exceeds size budget"
print(f"Verified game pack: {size:,} bytes")
