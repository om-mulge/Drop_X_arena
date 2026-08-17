const ADMIN_TOKEN_KEY = "battle-arena-admin-token";

type LoginResponse = {
  ok: boolean;
  message?: string;
  token?: string;
  admin?: {
    id: string;
    email: string;
    fullName: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
};

export type AdminSession = NonNullable<LoginResponse["admin"]>;

function getApiBaseUrl() {
  const configuredBaseUrl = import.meta.env["VITE_API_BASE_URL"] as string | undefined;

  if (configuredBaseUrl) {
    return configuredBaseUrl.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:4000`;
  }

  return "http://localhost:4000";
}

export function getStoredAdminToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function storeAdminToken(token: string) {
  window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export async function loginAdmin(email: string, password: string) {
  const response = await fetch(`${getApiBaseUrl()}/api/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const payload = (await response.json()) as LoginResponse;

  if (!response.ok || !payload.ok || !payload.token || !payload.admin) {
    throw new Error(payload.message || "Admin login failed");
  }

  storeAdminToken(payload.token);
  return payload.admin;
}

export async function fetchAdminSession(token: string) {
  const response = await fetch(`${getApiBaseUrl()}/api/admin/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const payload = (await response.json()) as LoginResponse;

  if (!response.ok || !payload.ok || !payload.admin) {
    throw new Error(payload.message || "Admin session is invalid");
  }

  return payload.admin;
}
