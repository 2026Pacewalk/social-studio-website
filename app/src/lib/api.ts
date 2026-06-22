const TOKEN_KEY = 'ss_admin_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

async function request<T = unknown>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const res = await fetch(path, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined });
  if (res.status === 401) clearToken();
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || `Request failed (${res.status})`);
  return data as T;
}

export const api = {
  get: <T>(p: string) => request<T>('GET', p),
  post: <T>(p: string, b?: unknown) => request<T>('POST', p, b),
  patch: <T>(p: string, b?: unknown) => request<T>('PATCH', p, b),
  del: <T>(p: string) => request<T>('DELETE', p),
  async upload(path: string, file: File): Promise<{ url: string }> {
    const fd = new FormData();
    fd.append('image', file);
    const token = getToken();
    const res = await fetch(path, { method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {}, body: fd });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data;
  },
};

export interface AdminUser { id: number; name: string; email: string; role: 'admin' | 'editor'; created_at?: string; }
export interface Lead {
  id: number; name: string; email: string; phone: string; service: string; event_date: string;
  brand: string; budget: string; message: string; status: 'new' | 'contacted' | 'won' | 'lost'; notes: string; created_at: string;
}
export interface PortfolioItem {
  id: number; title: string; category: string; year: string; description: string;
  image: string; aspect: 'tall' | 'wide' | 'square'; sort_order: number; published: number;
}
export interface Testimonial {
  id: number; text: string; author: string; role: string; rating: number; initials: string; sort_order: number; published: number;
}
