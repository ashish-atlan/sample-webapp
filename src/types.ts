export type AtlanUser = {
  id: string;
  username: string;
  email: string;
  name: string;
};

export type AtlanPage = {
  route: string;
  params: Record<string, string | string[]>;
  query: Record<string, string | string[]>;
};

export type AtlanAuthPayload = {
  token: string;
  expiresAt: number;
  user: AtlanUser;
  page: AtlanPage;
  timestamp: number;
};

export type AtlanInboundMessage =
  | { type: 'ATLAN_HANDSHAKE'; appId?: string }
  | { type: 'ATLAN_AUTH_CONTEXT'; payload: AtlanAuthPayload }
  | { type: 'ATLAN_LOGOUT' };

export type IframeOutboundMessage =
  | { type: 'IFRAME_READY' }
  | { type: 'IFRAME_TOKEN_REQUEST' }
  | { type: 'IFRAME_ERROR'; message: string };

export type AtlanContextStatus = 'waiting' | 'ready' | 'logged-out';
