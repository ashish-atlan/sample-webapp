import { useEffect, useState } from 'react';
import { allowedOrigins } from './env';
import type { AtlanContextStatus, AtlanInboundMessage } from './types';

type State = {
  username: string | null;
  assetId: string | null;
  status: AtlanContextStatus;
};

const initialState: State = {
  username: null,
  assetId: null,
  status: 'waiting',
};

const firstString = (v: string | string[] | undefined): string | null => {
  if (v == null) return null;
  return Array.isArray(v) ? (v[0] ?? null) : v;
};

export function useAtlanContext(): State {
  const [state, setState] = useState<State>(initialState);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (!allowedOrigins.has(event.origin)) return;

      const data = event.data as AtlanInboundMessage | undefined;
      if (!data || typeof data !== 'object' || !('type' in data)) return;

      switch (data.type) {
        case 'ATLAN_HANDSHAKE': {
          const source = event.source as Window | null;
          source?.postMessage({ type: 'IFRAME_READY' }, { targetOrigin: event.origin });
          return;
        }
        case 'ATLAN_AUTH_CONTEXT': {
          const username = data.payload?.user?.username ?? null;
          const assetId = firstString(data.payload?.page?.params?.id);
          setState({ username, assetId, status: 'ready' });
          return;
        }
        case 'ATLAN_LOGOUT': {
          setState({ username: null, assetId: null, status: 'logged-out' });
          return;
        }
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  return state;
}
