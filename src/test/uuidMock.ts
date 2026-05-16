/**
 * Lightweight CommonJS-friendly stand-in for the `uuid` package in Jest tests.
 * Node 19+ exposes `crypto.randomUUID`, which is plenty for unit tests.
 */
import { randomUUID } from 'crypto';

export function v4(): string {
  return randomUUID();
}

export default { v4 };
