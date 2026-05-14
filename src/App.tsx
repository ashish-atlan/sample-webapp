import { useAtlanContext } from './useAtlanContext';
import './styles.css';

const STATUS_LABEL: Record<'waiting' | 'ready' | 'logged-out', string> = {
  waiting: 'Waiting',
  ready: 'Connected',
  'logged-out': 'Session ended',
};

const POWER_BI_URL =
  'https://app.powerbi.com/reportEmbed?reportId=037e5f93-8fbe-4ffa-b80c-033c5c7195bb&appId=8238c489-96b1-46d6-b305-4bbecb277c90&autoAuth=true&ctid=3596192b-fdf5-4e2c-a6fa-acb706c963d8&navContentPaneEnabled=true&filterPaneEnabled=false';

export function App() {
  const { status } = useAtlanContext();

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
        <section className="card" aria-label="Power BI report">
          <iframe
            className="report-frame"
            src={POWER_BI_URL}
            title="Power BI report"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </section>
      )}
    </main>
  );
}
