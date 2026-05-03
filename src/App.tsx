import { useAtlanContext } from './useAtlanContext';
import './styles.css';

export function App() {
  const { username, assetId, status } = useAtlanContext();
  const waiting = status === 'waiting';

  return (
    <main className="app">
      <h1>Atlan UI Embedding Test</h1>
      <dl className="fields">
        <dt>Username</dt>
        <dd>{username ?? (waiting ? '— waiting for handshake —' : '—')}</dd>
        <dt>Asset ID</dt>
        <dd>
          {assetId ??
            (waiting
              ? '— waiting for handshake —'
              : '(no asset context — open from an asset profile tab)')}
        </dd>
      </dl>
      {status === 'logged-out' && <p className="logged-out">Session ended.</p>}
    </main>
  );
}
