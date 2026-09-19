"""Create explicit, reviewable Jam web/source archives; never include secrets or SDK runtime state."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import hashlib
import json

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = [
    "index.html", "styles.css", "app.js", "graft-engine.js", "audio.js",
    "bet-controls.js", "host-errors.js", "sdk-bridge.js", "game.manifest.json",
    "_headers", "vercel.json", ".vercelignore", "vendor/penpal.min.js", "vendor/penpal.LICENSE.txt"
]
SOURCES = [f"fruit-machine-ui/{name}" for name in PUBLIC] + [
    "fruit-machine-ui/README.md", "fruit-machine-ui/sdk-bridge.test.cjs",
    "fruit-machine-ui/audio.test.cjs", "fruit-machine-ui/host-errors.test.cjs", "JAM_SUBMISSION.md",
    "scripts/serve-game.py", "scripts/package-jam.py", "scripts/graft-math.cjs",
    "scripts/graft-engine.test.cjs", "scripts/graft-browser.test.cjs", "scripts/graft-layout.test.cjs",
    "scripts/browser-runtime.cjs",
    "scripts/graft-refresh.test.cjs",
    "casino-sdk/casino-sdk/simulator/contracts/GraftGardenGame.sol",
    "casino-sdk/casino-sdk/simulator/contracts/ICasinoGameV2.sol",
    "casino-sdk/casino-sdk/simulator/scripts/verify-graft.mjs",
    "casino-sdk/casino-sdk/simulator/src/App.tsx",
    "casino-sdk/casino-sdk/simulator/src/config.ts",
    "casino-sdk/casino-sdk/simulator/src/config.test.ts",
    "casino-sdk/casino-sdk/simulator/src/SetupPanel.tsx",
    "casino-sdk/casino-sdk/simulator/src/GameFrame.tsx",
    "casino-sdk/casino-sdk/simulator/src/use-game-manifest.ts",
    "casino-sdk/casino-sdk/simulator/src/fetch-game-manifest.ts",
    "casino-sdk/casino-sdk/simulator/src/session-events.ts",
    "casino-sdk/casino-sdk/simulator/src/session-events.test.ts",
    "reference-analysis/GRAFT_CONTRACT_VERIFICATION.json",
    "reference-analysis/GRAFT_BROWSER_VERIFICATION.json",
    "reference-analysis/GRAFT_DEPLOYMENT_VERIFICATION.json",
    "reference-analysis/GRAFT_LAYOUT_VERIFICATION.json",
]
out = ROOT / "artifacts"
out.mkdir(exist_ok=True)
web = out / "graft-garden-web.zip"
source = out / "graft-garden-source.zip"
with ZipFile(web, "w", ZIP_DEFLATED) as archive:
    for name in PUBLIC:
        archive.write(ROOT / "fruit-machine-ui" / name, name)
with ZipFile(source, "w", ZIP_DEFLATED) as archive:
    for name in SOURCES:
        archive.write(ROOT / name, name)
    archive.writestr("PACKAGE_README.txt",
        "Graft Garden source bundle\n"
        "Frontend runs with: python scripts/serve-game.py\n"
        "The official Casino SDK simulator is a dependency, not included here.\n"
        "Get the official SDK from https://sdk.chain.wtf/casino and install it\n"
        "under casino-sdk/casino-sdk, then copy these contract/test files into it.\n"
        "See JAM_SUBMISSION.md and fruit-machine-ui/README.md for math, build and verification.\n"
        "This archive does not deploy a production game or submit a Jam entry.\n")
checksums = {}
for path in [web, source]:
    with ZipFile(path) as archive:
        assert archive.testzip() is None
    checksums[path.name] = {"bytes": path.stat().st_size, "sha256": hashlib.sha256(path.read_bytes()).hexdigest()}
(out / "checksums.json").write_text(json.dumps(checksums, indent=2), encoding="utf-8")
print(json.dumps(checksums, indent=2))
