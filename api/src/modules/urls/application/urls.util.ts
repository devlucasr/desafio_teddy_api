import { randomBytes } from 'crypto';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function randomShortCode(len = 6): string {
  if (len < 1 || len > 6) throw new Error('short code length must be between 1 and 6');
  const buf = randomBytes(len);
  let out = '';
  for (let i = 0; i < len; i++) {
    out += ALPHABET[buf[i] % ALPHABET.length];
  }
  return out;
}
