// Thin fetch wrapper that targets the synapster backend with HTTP Basic Auth.
// Both API_URL and PASSWORD come from window.SYNAPSTER_CONFIG (set at Vercel
// build time by scripts/build-vercel.mjs from NEXT_PUBLIC_API_URL and
// NEXT_PUBLIC_PASSWORD env vars). Locally, dashboard/config.js holds the
// committed defaults: API_URL = http://localhost:8000, PASSWORD = "" (gate off).
//
// Username is ignored server-side; we send "judge" as a stable label.

(function () {
  const cfg = () => window.SYNAPSTER_CONFIG || {};

  const baseUrl = () => (cfg().API_URL || '').replace(/\/$/, '');

  const authHeader = () => {
    const pw = cfg().PASSWORD || '';
    if (!pw) return {};
    return { 'Authorization': 'Basic ' + btoa('judge:' + pw) };
  };

  async function apiFetch(path, opts = {}) {
    const url = baseUrl() + path;
    const headers = Object.assign({}, opts.headers || {}, authHeader());
    if (opts.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json';
    const res = await fetch(url, Object.assign({}, opts, { headers }));
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`${opts.method || 'GET'} ${path} -> ${res.status}: ${text || res.statusText}`);
    }
    const ct = res.headers.get('content-type') || '';
    return ct.includes('application/json') ? res.json() : res.text();
  }

  window.synapsterApi = {
    health: () => apiFetch('/health'),
    tasks: () => apiFetch('/tasks'),
    bundle: (task) => apiFetch('/bundle/' + encodeURIComponent(task)),
    infer: (payload) => apiFetch('/infer', { method: 'POST', body: JSON.stringify(payload) }),
    protocol: (ailment) => apiFetch('/protocol', { method: 'POST', body: JSON.stringify({ ailment }) }),
  };
})();
