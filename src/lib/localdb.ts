// ============================================================
// API CLIENT - Connects to Vercel Serverless / MongoDB Backend
// ============================================================

const API_BASE = '/api';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || 'API request failed');
  }
  return res.json();
}

// ---- Auth ----
const TOKEN_KEY = 'dxm26_admin_token';

const ADMIN_EMAIL = 'esakkimuthu2907@gmail.com';
const ADMIN_PASSWORD = 'Esakki@123';

export async function login(email: string, password: string): Promise<boolean> {
  // First try local check (works offline / when API is down)
  if (
    email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase() &&
    password === ADMIN_PASSWORD
  ) {
    const token = btoa(JSON.stringify({ email, role: 'admin', exp: Date.now() + 7 * 86400000 }));
    localStorage.setItem(TOKEN_KEY, token);
    return true;
  }
  // Fallback: try API
  try {
    const res = await fetchAPI('/auth', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.success && res.token) {
      localStorage.setItem(TOKEN_KEY, res.token);
      return true;
    }
  } catch (_e) {
    // API down, local check already failed
  }
  return false;
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function getSession(): { email: string; role: string } | null {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    const data = JSON.parse(atob(raw));
    if (data.exp && Date.now() > data.exp) {
      logout();
      return null;
    }
    return { email: data.email, role: data.role };
  } catch {
    return null;
  }
}

export function isAdmin(): boolean {
  const session = getSession();
  return session?.role === 'admin';
}

// ---- Settings ----
export async function getSettings(): Promise<any> {
  try {
    return await fetchAPI('/data/settings');
  } catch (e) {
    return {
      id: 'site_settings',
      hero_title: "DXM '26",
      hero_subtitle: 'MECHANICAL SYMPOSIUM',
      hero_description: 'INNOVATE. DESIGN. INSPIRE.\nShaping the future through engineering excellence.',
      stat_participants: '300',
      stat_colleges: '50+',
      stat_events: '10+',
      stat_workshops: '2',
      contact_phone: '+91 - 7904577032',
      contact_email: 'dxm26@velammal.edu.in',
      contact_address: 'Velammal Engineering College, Chennai, Tamil Nadu',
    };
  }
}

export async function saveSettings(data: any): Promise<any> {
  return await fetchAPI('/data/settings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ---- Generic CRUD ----
export async function listItems(collection: string): Promise<any[]> {
  try {
    return await fetchAPI(`/data/${collection}`);
  } catch (e) {
    console.warn(`Failed to list ${collection}:`, e);
    return [];
  }
}

export async function addItem(collection: string, data: any): Promise<any> {
  return await fetchAPI(`/data/${collection}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateItem(collection: string, id: string, data: any): Promise<any> {
  return await fetchAPI(`/data/${collection}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteItem(collection: string, id: string): Promise<boolean> {
  await fetchAPI(`/data/${collection}/${id}`, { method: 'DELETE' });
  return true;
}
