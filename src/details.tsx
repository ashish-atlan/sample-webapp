import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { useAtlanContext } from './useAtlanContext';
import './styles.css';

const STATUS_LABEL: Record<'waiting' | 'ready' | 'logged-out', string> = {
  waiting: 'Waiting',
  ready: 'Connected',
  'logged-out': 'Session ended',
};

type FieldProps = { label: string; value: string | null; mono?: boolean };

function Field({ label, value, mono }: FieldProps) {
  return (
    <div className="field">
      <span className="field__label">{label}</span>
      {value ? (
        <p className={`field__value${mono ? ' field__value--mono' : ''}`}>{value}</p>
      ) : (
        <p className="field__value field__value--placeholder">— not provided —</p>
      )}
    </div>
  );
}

function Details() {
  const { status, user, username, assetId } = useAtlanContext();

  return (
    <main className="app">
      <header className="header">
        <div className="title">
          <div className="logo" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4v16h16" />
              <rect x="8" y="13" width="2.5" height="5" />
              <rect x="12" y="10" width="2.5" height="8" />
              <rect x="16" y="7" width="2.5" height="11" />
              <polyline points="7,15 11,11 15,12 19,6" />
            </svg>
          </div>
          <h1>Metaview · Context</h1>
        </div>
        <span className={`pill pill--${status}`}>{STATUS_LABEL[status]}</span>
      </header>

      {status === 'waiting' && (
        <section className="card" aria-label="Waiting for handshake">
          <div className="card__header">Waiting</div>
          <div className="card__body">— waiting for handshake —</div>
        </section>
      )}

      {status === 'logged-out' && (
        <section className="card" aria-label="Session ended">
          <div className="card__header">Session ended</div>
          <div className="card__body">The parent app has signed out.</div>
        </section>
      )}

      {status === 'ready' && (
        <div className="grid">
          <section className="card" aria-label="Logged-in user">
            <div className="card__header">Logged-in user</div>
            <div className="fields">
              <Field label="Username" value={username} />
              <Field label="Name" value={user?.name ?? null} />
              <Field label="Email" value={user?.email ?? null} />
              <Field label="User ID" value={user?.id ?? null} mono />
            </div>
          </section>

          <section className="card" aria-label="Asset details">
            <div className="card__header">Asset details</div>
            <div className="fields">
              <Field label="Asset ID" value={assetId} mono />
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root not found');

createRoot(root).render(
  <StrictMode>
    <Details />
  </StrictMode>,
);
