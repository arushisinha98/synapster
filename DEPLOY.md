# Deploy Runbook

Frontend on Vercel (static), FastAPI backend on MBP-2 reached via Cloudflare Tunnel.

```
 Judges' browser
       │
       ├──── https://<vercel-app>.vercel.app          (static dashboard, password-gated)
       │           │
       │           └── fetch ──► https://synapster-api.martinlombard.com   (Cloudflare edge)
       │                                  │
       │                                  └── tunnel ──► MBP-2 :8000  (uvicorn FastAPI)
```

---

## One-time setup

### 1. Vercel project

1. **Import the repo** at https://vercel.com/new (point at `arushisinha98/synapster`).
2. **Framework preset:** Other.
3. **Root directory:** repo root (the `vercel.json` handles the rest).
4. **Environment Variables:**
   - `NEXT_PUBLIC_API_URL` → `https://synapster-api.martinlombard.com`
   - `NEXT_PUBLIC_PASSWORD` → pick a short access code (e.g. `judge-2026`)
5. Deploy. Note the assigned `*.vercel.app` URL — that's the judge link.

The `NEXT_PUBLIC_*` prefix is only for clarity — there's no Next.js. `scripts/build-vercel.mjs` reads them and writes `dashboard/config.js` at build time.

### 2. Cloudflare Tunnel (already done on MBP-2)

- Tunnel name: `synapster`
- UUID: `81f47e94-c9d2-4f4b-8507-b6d741e69820`
- Config: `~/.cloudflared/synapster.yml`
- Public hostname: `synapster-api.martinlombard.com` → `localhost:8000`

To recreate from scratch:
```bash
cloudflared tunnel create synapster
# write ~/.cloudflared/synapster.yml with the new UUID
cloudflared tunnel route dns -f <UUID> synapster-api.martinlombard.com
```

---

## Demo runbook

Run on MBP-2, **two terminals** (or tmux):

**Terminal 1 — backend:**
```bash
cd ~/path/to/synapster
# however the teammate started it; e.g.
uvicorn ctrnn.infer:app --host 0.0.0.0 --port 8000
```

**Terminal 2 — tunnel:**
```bash
cd ~/path/to/synapster
./scripts/start-tunnel.sh
```

**Verify (from anywhere):**
```bash
curl https://synapster-api.martinlombard.com/tasks
# should return ["perceptual_decision","working_memory","reaction_time"]
```

**Give judges:** the Vercel URL + the access code.

---

## Backend gotchas (for whoever implements FastAPI)

The frontend will hit `https://synapster-api.martinlombard.com/...` from a different origin (Vercel). Three things must be in the FastAPI app or it breaks at runtime:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # or restrict to the exact Vercel domain
    allow_methods=["*"],
    allow_headers=["*"],
)
```

If you tighten CORS, set `ALLOWED_ORIGIN` in `.env` to the Vercel URL and pass it instead of `["*"]`.

**ENIGMA Toolbox first-call download:** if the inference path calls `load_sc()` or similar, it downloads brain connectivity data on first invocation. Pre-warm at startup so the first judge request doesn't hang:

```python
@app.on_event("startup")
def warmup():
    from enigmatoolbox.datasets import load_sc
    _ = load_sc()
```

**`gym==0.21.0` pin** is fragile on a fresh install. If pip refuses, use `pip install gym==0.21.0 --no-deps`.

---

## Keep MBP-2 awake during the demo

```bash
caffeinate -dimsu &   # prevents sleep, lid-close sleep, display sleep
```

Or run `caffeinate` in front of the uvicorn command:
```bash
caffeinate -dimsu uvicorn ctrnn.infer:app --port 8000
```

---

## What the password gate actually does

`dashboard/config.js` (written at Vercel build time) contains the password. The frontend overlay compares user input against that and unlocks via `sessionStorage`.

**This is a visibility gate, not real auth.** Anyone who views page source can read the password. For hackathon judging it's fine; if a stronger bar is needed, add HTTP Basic Auth in FastAPI as well:

```python
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBasic, HTTPBasicCredentials
import secrets, os

security = HTTPBasic()

def check(creds: HTTPBasicCredentials = Depends(security)):
    ok = secrets.compare_digest(creds.password, os.environ["API_PASSWORD"])
    if not ok:
        raise HTTPException(401)

# then on every protected route:
@app.post("/infer", dependencies=[Depends(check)])
def infer(...): ...
```

The frontend would need to send `Authorization: Basic <base64(user:pass)>` on each fetch.

---

## Recovery

| Problem | Fix |
|---|---|
| Vercel build fails | check `node scripts/build-vercel.mjs` runs locally; verify env vars are set in Vercel project settings |
| Frontend loads but password gate never accepts | env var `NEXT_PUBLIC_PASSWORD` not set in Vercel — redeploy after setting |
| `Failed to fetch` in browser console | tunnel down (terminal 2), or backend down (terminal 1), or CORS not configured |
| Tunnel running, backend up, but 502 | uvicorn not on port 8000, or bound to wrong interface — use `--host 0.0.0.0` |
| MBP-2 went to sleep | `caffeinate -dimsu &`; lid stays open |
| Tunnel URL changed | shouldn't happen (named tunnel), but verify with `cloudflared tunnel info synapster` |

---

## Files this deploy added

- `vercel.json` — static-site config + build hook
- `scripts/build-vercel.mjs` — writes `dashboard/config.js` from env vars
- `scripts/start-tunnel.sh` — one-line tunnel launcher for MBP-2
- `dashboard/config.js` — runtime config (overwritten by Vercel build)
- `dashboard/index.html` — added password gate overlay + config load
- `.env.example` — variable cheat sheet
