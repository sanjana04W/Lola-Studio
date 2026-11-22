/**
 * In-memory OTP store (server-side only).
 * Each entry expires after 10 minutes.
 * Supports phone numbers and email identifiers.
 */

interface OtpEntry {
  code: string;
  expiresAt: number; // ms timestamp
  attempts: number;
}

// Global store to survive Next.js dev reloads
declare global {
  // eslint-disable-next-line no-var
  var __otpStore: Map<string, OtpEntry> | undefined;
}

export const otpStore: Map<string, OtpEntry> =
  global.__otpStore ?? (global.__otpStore = new Map());

export const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
export const MAX_ATTEMPTS = 5;

/**
 * Normalizes phone numbers (handles Sri Lankan numbers 07X... -> 947X... or international)
 */
export function normalizeIdentifier(id: string): string {
  const trimmed = id.trim().toLowerCase();
  // If it's a phone number (mostly digits, +, -, spaces)
  if (/^[\d+\s\-()]+$/.test(trimmed)) {
    let digits = trimmed.replace(/[\s\-()+]/g, '');
    if (digits.startsWith('0')) {
      digits = '94' + digits.slice(1);
    }
    return digits;
  }
  return trimmed;
}

export function setOtp(identifier: string, code: string) {
  const key = normalizeIdentifier(identifier);
  otpStore.set(key, {
    code,
    expiresAt: Date.now() + OTP_TTL_MS,
    attempts: 0,
  });
}

export function verifyOtp(identifier: string, code: string): 'ok' | 'expired' | 'invalid' | 'too_many' {
  const key = normalizeIdentifier(identifier);
  const entry = otpStore.get(key);
  if (!entry) return 'expired';
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(key);
    return 'expired';
  }
  if (entry.attempts >= MAX_ATTEMPTS) return 'too_many';

  entry.attempts += 1;
  if (entry.code !== code.trim()) return 'invalid';

  otpStore.delete(key); // single-use
  return 'ok';
}
