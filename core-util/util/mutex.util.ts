export async function mutex(key: string, timeout: number): Promise<() => void> {
  const id = Math.random() * 1000000;
  assertUnlocked(key, id);
  lock(key, id, timeout);
  await timeoutPromise(50);
  assertUnlocked(key, id);
  return () => unlock(key, id);
}

function load(key: string): {id: number, time: number} {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : {};
}

function locked(key: string, id: number): boolean {
  const lck = load(key);
  return ((lck.time || 0) > Date.now()) && lck.id !== id;
}

function assertUnlocked(key: string, id: number): void {
  if (locked(key, id)) {
    throw 'locked';
  }
}

function lock(key: string, id: number, timeout: number): void {
  localStorage.setItem(key, JSON.stringify({id, time: Date.now() + timeout}));
}

function unlock(key: string, id: number): void {
  if (!locked(key, id)) {
    localStorage.removeItem(key);
  }
}

export function timeoutPromise(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}
