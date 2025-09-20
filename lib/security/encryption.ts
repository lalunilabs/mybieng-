import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';

export function encrypt(data: string): string {
  const key = crypto.pbkdf2Sync(process.env.ENCRYPTION_KEY!, 'salt', 100000, 32, 'sha256');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(ALGORITHM, key);
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, Buffer.from(encrypted, 'hex')]).toString('base64');
}

export function decrypt(encryptedData: string): string {
  const key = crypto.pbkdf2Sync(process.env.ENCRYPTION_KEY!, 'salt', 100000, 32, 'sha256');
  const buffer = Buffer.from(encryptedData, 'base64');
  
  const iv = buffer.subarray(0, 16);
  const tag = buffer.subarray(16, 32);
  const encrypted = buffer.subarray(32);
  
  const decipher = crypto.createDecipher(ALGORITHM, key);
  decipher.setAuthTag(tag);
  
  let decrypted = decipher.update(encrypted.toString('hex'), 'hex', 'utf8');
  return decrypted + decipher.final('utf8');
}

export function hashData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export function generateSecureToken(length = 32): string {
  return crypto.randomBytes(length).toString('hex');
}
