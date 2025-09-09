type Url = {
  id: number
  slug: string
  original: string
  clicks: number
  userId: number
  createdAt: Date
  updatedAt: Date
}

function randomSlug(len = 7) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let s = '';
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

function randomUrl() {
  const domains = ['example.com', 'meusite.com.br', 'app.dev', 'local.test'];
  const path = Math.random().toString(36).slice(2, 10);
  return `https://${domains[Math.floor(Math.random() * domains.length)]}/${path}`;
}

export function makeUrl(overrides: Partial<Url> = {}): Url {
  return {
    id: overrides.id ?? Math.floor(Math.random() * 10_000) + 1,
    slug: overrides.slug ?? randomSlug(6),
    original: overrides.original ?? randomUrl(),
    clicks: overrides.clicks ?? 0,
    userId: overrides.userId ?? 1,
    createdAt: overrides.createdAt ?? new Date(),
    updatedAt: overrides.updatedAt ?? new Date()
  };
}
