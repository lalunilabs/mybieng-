import { createHmac, timingSafeEqual } from 'crypto';

// Base64URL encoding helpers
function base64urlEncode(input: Buffer | string): string {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input, 'utf8');
  return buf
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64urlDecodeToString(input: string): string {
  const pad = 4 - (input.length % 4 || 4);
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(pad % 4);
  return Buffer.from(base64, 'base64').toString('utf8');
}

function getSecret(): string {
  // Prefer dedicated unsubscribe secret; fallback to NEXTAUTH_SECRET in dev
  return (
    process.env.UNSUBSCRIBE_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    'development-secret'
  );
}

// Create a signed token containing the email and expiry timestamp
export function signUnsubscribeToken(email: string, expiresInDays = 30): string {
  const exp = Math.floor(Date.now() / 1000) + expiresInDays * 24 * 60 * 60;
  const emailB64 = base64urlEncode(email);
  const data = `${emailB64}.${exp}`;
  const sig = createHmac('sha256', getSecret()).update(data).digest();
  const sigB64 = base64urlEncode(sig);
  return `${emailB64}.${exp}.${sigB64}`;
}

export function verifyUnsubscribeToken(token: string): { valid: boolean; email?: string; reason?: string } {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false, reason: 'Malformed token' };
    }
    const [emailB64, expStr, sigProvided] = parts;
    const exp = parseInt(expStr, 10);
    if (!exp || exp < Math.floor(Date.now() / 1000)) {
      return { valid: false, reason: 'Token expired' };
    }

    const data = `${emailB64}.${exp}`;
    const expectedSig = createHmac('sha256', getSecret()).update(data).digest();
    const expectedSigB64 = base64urlEncode(expectedSig);

    const validSig = timingSafeEqual(
      Buffer.from(expectedSigB64),
      Buffer.from(sigProvided)
    );

    if (!validSig) {
      return { valid: false, reason: 'Invalid signature' };
    }

    const email = base64urlDecodeToString(emailB64).toLowerCase().trim();
    return { valid: true, email };
  } catch (e) {
    return { valid: false, reason: 'Verification error' };
  }
}

// Confirmation tokens (double opt-in)
// We namespace the signed payload with a purpose prefix so unsubscribe and confirm tokens are not interchangeable.
export function signConfirmToken(email: string, expiresInDays = 7): string {
  const exp = Math.floor(Date.now() / 1000) + expiresInDays * 24 * 60 * 60;
  const emailB64 = base64urlEncode(email);
  const data = `confirm:${emailB64}.${exp}`;
  const sig = createHmac('sha256', getSecret()).update(data).digest();
  const sigB64 = base64urlEncode(sig);
  return `${emailB64}.${exp}.${sigB64}`;
}

export function verifyConfirmToken(token: string): { valid: boolean; email?: string; reason?: string } {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false, reason: 'Malformed token' };
    }
    const [emailB64, expStr, sigProvided] = parts;
    const exp = parseInt(expStr, 10);
    if (!exp || exp < Math.floor(Date.now() / 1000)) {
      return { valid: false, reason: 'Token expired' };
    }

    const data = `confirm:${emailB64}.${exp}`;
    const expectedSig = createHmac('sha256', getSecret()).update(data).digest();
    const expectedSigB64 = base64urlEncode(expectedSig);

    const validSig = timingSafeEqual(
      Buffer.from(expectedSigB64),
      Buffer.from(sigProvided)
    );

    if (!validSig) {
      return { valid: false, reason: 'Invalid signature' };
    }

    const email = base64urlDecodeToString(emailB64).toLowerCase().trim();
    return { valid: true, email };
  } catch (e) {
    return { valid: false, reason: 'Verification error' };
  }
}
