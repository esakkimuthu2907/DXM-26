export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('supabase.auth.token'); // Use standard token key
  
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  // read as text first to avoid JSON parse errors on HTML error pages
  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = text;
  }

  if (!res.ok) {
    // prefer structured error message when available
    const msg = data && typeof data === 'object' ? data.error || JSON.stringify(data) : String(data || res.statusText);
    throw new Error(msg || 'API Error');
  }
  return data;
}

export const api = {
  get: (url: string) => fetchApi(url, { method: 'GET' }),
  post: (url: string, body: any) => fetchApi(url, { method: 'POST', body: JSON.stringify(body) }),
  put: (url: string, body: any) => fetchApi(url, { method: 'PUT', body: JSON.stringify(body) }),
  del: (url: string) => fetchApi(url, { method: 'DELETE' }),
};
