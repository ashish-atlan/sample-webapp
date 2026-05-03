import { useAtlanContext } from './useAtlanContext';
import './styles.css';

const STATUS_LABEL: Record<'waiting' | 'ready' | 'logged-out', string> = {
  waiting: 'Waiting',
  ready: 'Connected',
  'logged-out': 'Session ended',
};

export function App() {
  const { username, assetId, status } = useAtlanContext();
  const waiting = status === 'waiting';

  const placeholder = (fallback: string) =>
    waiting ? '— waiting for handshake —' : fallback;

  return (
    <main className="app">
      <header className="header">
        <div className="title">
          <div className="logo" aria-hidden="true">A</div>
          <div>
            <span className="subtitle">Embedded App</span>
            <h1>Atlan UI Embedding Test</h1>
          </div>
        </div>
        <span className={`pill pill--${status}`}>{STATUS_LABEL[status]}</span>
      </header>

      <section className="card" aria-label="Context from Atlan">
        <div className="card__header">Context from parent</div>
        <dl className="fields">
          <div className="field">
            <dt className="field__label">Username</dt>
            <dd
              className={
                username
                  ? 'field__value'
                  : 'field__value field__value--placeholder'
              }
            >
              {username ?? placeholder('—')}
            </dd>
          </div>
          <div className="field">
            <dt className="field__label">Asset ID</dt>
            <dd
              className={
                assetId
                  ? 'field__value field__value--mono'
                  : 'field__value field__value--placeholder'
              }
            >
              {assetId ??
                placeholder('(no asset context — open from an asset profile tab)')}
            </dd>
          </div>
        </dl>
      </section>

      <p className="footer">
        Reads <code>user.username</code> and <code>page.params.id</code> from{' '}
        <code>ATLAN_AUTH_CONTEXT</code>.
      </p>
    </main>
  );
}
