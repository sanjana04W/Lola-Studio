/**
 * In-memory OTP store (server-side only).
 * Each entry expires after 10 minutes.
 */

interface OtpEntry {
  code: string;
  expiresAt: number; // ms timestamp
  attempts: number;
}

// Use a global to survive Next.js hot-reload in dev
declare global {
  // eslint-disable-next-line no-var
  var __otpStore: Map<string, OtpEntry> | undefined;
}

export const otpStore: Map<string, OtpEntry> =
  global.__otpStore ?? (global.__otpStore = new Map());

export const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
export const MAX_ATTEMPTS = 5;

export function setOtp(email: string, code: string) {
  otpStore.set(email.toLowerCase(), {
    code,
    expiresAt: Date.now() + OTP_TTL_MS,
    attempts: 0,
  });
}

export function verifyOtp(email: string, code: string): 'ok' | 'expired' | 'invalid' | 'too_many' {
  const key = email.toLowerCase();
  const entry = otpStore.get(key);
  if (!entry) return 'expired';
  if (Date.now() > entry.expiresAt) { otpStore.delete(key); return 'expired'; }
  if (entry.attempts >= MAX_ATTEMPTS) return 'too_many';

  entry.attempts += 1;
  if (entry.code !== code.trim()) return 'invalid';

  otpStore.delete(key); // single-use
  return 'ok';
}
