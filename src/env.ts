const raw = (import.meta.env.VITE_ATLAN_ALLOWED_ORIGINS as string | undefined) ?? '';

const parsed = raw
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const devFallback = import.meta.env.DEV
  ? ['http://localhost:5173', 'http://127.0.0.1:5173']
  : [];

export const allowedOrigins: ReadonlySet<string> = new Set([
  ...parsed,
  ...devFallback,
]);
