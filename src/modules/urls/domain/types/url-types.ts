export type CreateUrlInput = {
  shortCode: string;
  originalUrl: string;
  userId?: string | null;
};

export type ClickMeta = {
  ip?: string
  userAgent?: string
}
