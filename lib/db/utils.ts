import { generateId } from 'ai';
import { genSaltSync, hashSync } from 'bcrypt-ts';
import { log } from '../logger';

export function generateHashedPassword(password: string) {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);

  return hash;
}

export function generateDummyPassword() {
  const password = generateId(12);
  const hashedPassword = generateHashedPassword(password);

  return hashedPassword;
}

export async function withDbErrorLogging<T>(fn: Function, context: any = {}) {
  try {
    return await fn();
  } catch (error) {
    const functionName = fn.name || 'anonymous';
    log.error('Database error', { functionName, ...context, error });
    throw error;
  }
}
