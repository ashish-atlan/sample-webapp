# sample-webapp — Atlan UI Embedding Test

External web app that Atlan loads in an iframe on an asset detail page. Displays the logged-in user's username and the open asset's GUID, plus the label **"Atlan UI Embedding Test"**.

## Stack

React 18 + Vite + TypeScript. Hand-rolled postMessage handshake. No runtime deps beyond React.

## How it works

Atlan parent ↔ iframe protocol:

```
parent  →  { type: 'ATLAN_HANDSHAKE', appId }
iframe  →  { type: 'IFRAME_READY' }                          (must reply ≤10s)
parent  →  { type: 'ATLAN_AUTH_CONTEXT', payload: {
              token, expiresAt, timestamp,
              user: { id, username, email, name },
              page: { route, params, query }                 // params.id = asset GUID on asset-profile-tab
           }}
parent  →  { type: 'ATLAN_LOGOUT' }                          (on session end)
```

App reads `payload.user.username` and `payload.page.params.id`. Token is **not** stored — read-only display only.

## Layout

| File | Purpose |
|------|---------|
| [src/useAtlanContext.ts](src/useAtlanContext.ts) | postMessage listener, origin validation, state |
| [src/App.tsx](src/App.tsx) | UI |
| [src/types.ts](src/types.ts) | Message + payload types |
| [src/env.ts](src/env.ts) | `VITE_ATLAN_ALLOWED_ORIGINS` parser |
| [public/mock-parent.html](public/mock-parent.html) | Local handshake harness |
| [.github/workflows/deploy.yml](.github/workflows/deploy.yml) | GitHub Pages deploy (actions pinned to SHA) |
| [vite.config.ts](vite.config.ts) | `base: '/sample-webapp/'` for Pages |

## Run locally

```bash
npm install
npm run dev
# open http://localhost:5173/sample-webapp/mock-parent.html
# click buttons in order: handshake → auth-context → (logout)
```

`localhost:5173` and `127.0.0.1:5173` are auto-allowlisted in dev.

## Build

```bash
npm run build       # tsc -b && vite build → dist/
npm run preview     # serve dist/ locally
npm run typecheck   # tsc only, no emit
```

## Deploy (GitHub Pages)

1. Push to `main` on a repo named `sample-webapp` (else update `base` in [vite.config.ts](vite.config.ts)).
2. Repo Settings → Pages → Source = **GitHub Actions**.
3. Repo Settings → Secrets and variables → Actions → Variables → add `VITE_ATLAN_ALLOWED_ORIGINS=https://<your-tenant>.atlan.com`.
4. Workflow auto-deploys on push. Final URL: `https://<owner>.github.io/sample-webapp/`.

## Register with Atlan

```json
{
  "iframe_url": "https://<owner>.github.io/sample-webapp/",
  "allowed_origins": ["https://<owner>.github.io"],
  "render_at": ["asset-profile-tab"]
}
```

Open any asset detail page → new tab shows username + asset GUID.

## Security

- `event.origin` validated against allowlist on every message.
- `postMessage` always uses exact `targetOrigin`, never `*`.
- Token never stored, logged, or rendered. No `localStorage`/`sessionStorage` usage.
- Values rendered as React text children — no `dangerouslySetInnerHTML`.
- **Limitation:** GitHub Pages cannot set custom HTTP headers, so `Content-Security-Policy: frame-ancestors 'self' https://*.atlan.com;` is not enforced server-side. Acceptable for POC. For production, host on Cloudflare Pages / Netlify / Vercel.

## References

- [Atlan auth-context payload](https://docs.atlan.com/product/capabilities/build-apps/references/auth-context)
- [Embed in Atlan how-to](https://docs.atlan.com/product/capabilities/build-apps/sdks/application-sdk/how-tos/embed-in-atlan)
- [Register your app](https://docs.atlan.com/product/capabilities/build-apps/sdks/application-sdk/how-tos/register-your-app)
