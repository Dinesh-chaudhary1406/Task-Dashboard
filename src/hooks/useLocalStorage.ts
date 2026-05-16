import { useCallback, useEffect, useState } from 'react';

/**
 * Type-safe localStorage hook. Reads once on mount, then writes
 * whenever the value changes. Syncs across browser tabs via the
 * native `storage` event.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (err) {
      console.warn(`useLocalStorage: error reading "${key}"`, err);
      return initialValue;
    }
    // initialValue intentionally captured once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next =
          typeof value === 'function' ? (value as (p: T) => T)(prev) : value;
        try {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, JSON.stringify(next));
          }
        } catch (err) {
          console.warn(`useLocalStorage: error writing "${key}"`, err);
        }
        return next;
      });
    },
    [key],
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = (e: StorageEvent) => {
      if (e.key !== key || e.newValue === null) return;
      try {
        setStoredValue(JSON.parse(e.newValue) as T);
      } catch {
        /* ignore malformed payloads */
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [key]);

  return [storedValue, setValue];
}
