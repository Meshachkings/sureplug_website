const BASE_URL = (import.meta as unknown as { env: Record<string, string> }).env?.VITE_API_URL ?? 'http://localhost:3002/api/v1';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar?: { url: string };
  suretag?: string;
  role?: string;
  providerVerified?: boolean;
}

export interface ApiService {
  _id: string;
  title: string;
  description?: string;
  price: number;
  state?: string;
  images?: Array<{ url: string; _id?: string }>;
  categoryId: { _id: string; name: string; image?: { url: string } };
  reviewCount: number;
  averageRating: number;
  provider: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: { url: string };
    suretag: string;
    providerVerified?: boolean;
  };
}

export interface ApiPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiReview {
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    avatar?: { url: string };
  };
}

export interface ApiProviderService {
  _id: string;
  title: string;
  price: number;
  state?: string;
  categoryId: { name: string };
  reviewCount: number;
  orderCount: number;
  averageRating: number;
  reviews: ApiReview[];
}

export interface ApiProviderStats {
  serviceCount: number;
  orderCount: number;
  reviewCount: number;
  averageRating: number;
}

export interface ApiProviderProfile {
  provider: User;
  stats: ApiProviderStats;
  services: ApiProviderService[];
}

export interface ApiResponse<T> {
  status: number;
  message?: string;
  data: T;
}

interface ApiRequestOptions extends RequestInit {
  auth?: boolean;
}

function getToken(): string | null {
  return localStorage.getItem('sp_token');
}

async function request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { auth, ...init } = options;
  const headers = new Headers((init.headers ?? {}) as HeadersInit);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (auth) {
    const token = getToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });
  const json = await res.json();

  if (!res.ok) {
    const msg = (json as { message?: string })?.message;
    throw new Error(msg ?? `Request failed (${res.status})`);
  }

  return json as T;
}

export const api = {
  get: <T>(path: string, auth = false) =>
    request<T>(path, { method: 'GET', auth }),

  post: <T>(path: string, body: unknown, auth = false) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body), auth }),

  patch: <T>(path: string, body: unknown, auth = false) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body), auth }),

  delete: <T>(path: string, auth = false) =>
    request<T>(path, { method: 'DELETE', auth }),
};
