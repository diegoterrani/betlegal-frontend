/** Chamadas na mesma origem. O cookie de sessão do BFF viaja com credentials. */

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function readError(res: Response, path: string): Promise<string> {
  const body = await res.json().catch(() => ({} as { error?: string }));
  return body.error || `${path} respondeu ${res.status}`;
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(path, { credentials: 'same-origin', headers: { Accept: 'application/json' } });
  if (!res.ok) throw new ApiError(res.status, await readError(res, path));
  return res.json() as Promise<T>;
}

export async function apiSend<T>(path: string, method: 'POST' | 'PATCH', body?: unknown): Promise<T> {
  const res = await fetch(path, {
    method,
    credentials: 'same-origin',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({} as T & { error?: string }));
  if (!res.ok) {
    const message = (data as { error?: string }).error || `${path} respondeu ${res.status}`;
    throw new ApiError(res.status, message);
  }
  return data as T;
}
