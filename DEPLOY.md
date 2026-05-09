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
export API_PASSWORD="judge-2026"   # MUST match NEXT_PUBLIC_PASSWORD on Vercel
pixi run uvicorn ctrnn.infer_server:app --host 0.0.0.0 --port 8000
# (or: caffeinate -dimsu pixi run uvicorn ctrnn.infer_server:app --host 0.0.0.0 --port 8000)
```

**Terminal 2 — tunnel:**
```bash
cd ~/path/to/synapster
./scripts/start-tunnel.sh
```

**Verify (from anywhere):**
```bash
# Public — no auth, just checks the tunnel + uvicorn are reachable.
curl https://synapster-api.martinlombard.com/health
# {"ok":true,"n_bundles":3,"tasks":[...],"auth_configured":true}

# Protected — needs Basic Auth. Username can be anything; password = API_PASSWORD.
curl -u "synapster:judge-2026" https://synapster-api.martinlombard.com/tasks
# ["perceptual_decision","working_memory","reaction_time"]
```

**Give judges:** the Vercel URL + the access code.

---

## Backend (`ctrnn/infer_server.py`)

The FastAPI app at `ctrnn/infer_server.py` already wires:

- **CORS middleware** — `allow_origins = ALLOWED_ORIGIN` env var, or `*` if unset.
- **HTTP Basic Auth** on `/tasks`, `/bundle/<task>`, `/infer` via the `API_PASSWORD` env var. Username is ignored — any string works; password must match. Public route: `/health` (for tunnel diagnostics).
- **ENIGMA pre-warm** at startup so the first `/infer` doesn't block on a first-time SC download.
- **Bundle discovery** at `ctrnn/bundles/<task>/model_bundle.json` + matching `.pt`. Bundles missing or malformed are skipped with a log line.

The CTRNN crew's only contract is: produce a `model_bundle.json` per task whose `model_kwargs` reconstruct the `CTRNN` from `ctrnn/model.py`, and a forward signature `net(u, stim=stim_mV) -> (rates, output)`. If that signature changes, adjust the call inside `/infer` only.

**`gym==0.21.0` pin** is fragile on a fresh install. If pip refuses, use `pip install gym==0.21.0 --no-deps`.

---

## Keep MBP-2 awake during the demo

```bash
caffeinate -dimsu &   # prevents sleep, lid-close sleep, display sleep
```

Or run `caffeinate` in front of the uvicorn command:
```bash
caffeinate -dimsu uvicorn ctrnn.infer_server:app --port 8000
```

---

## Auth model (FE + BE)

Two layers, both gated by the **same password**:

1. **Frontend overlay** (visibility gate) — `dashboard/index.html` JS compares user input against `window.SYNAPSTER_CONFIG.PASSWORD` (set at Vercel build time from `NEXT_PUBLIC_PASSWORD`). Persisted in `sessionStorage`. This stops casual snoopers from seeing the dashboard, but the password is readable in page source — *not* a real security barrier.
2. **Backend HTTP Basic Auth** — `ctrnn/infer_server.py` requires `Authorization: Basic <base64(any:API_PASSWORD)>` on every protected route. Even if someone bypasses the frontend, they can't hit `/tasks`, `/bundle/<task>`, or `/infer` without the password.

**Critical: keep `NEXT_PUBLIC_PASSWORD` (Vercel) and `API_PASSWORD` (MBP-2) in sync.** If they diverge, the frontend will pass through the gate but every backend call will 401.

The dashboard's `fetch` calls must include the header:
```js
fetch(`${SYNAPSTER_CONFIG.API_URL}/infer`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + btoa(':' + SYNAPSTER_CONFIG.PASSWORD),
  },
  body: JSON.stringify({ task, field_per_region }),
})
```

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
