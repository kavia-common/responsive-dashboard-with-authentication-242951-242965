import { getApiBaseUrl } from "../config/env";

/**
 * Minimal API client using fetch.
 * - Automatically attaches Authorization header if a token exists.
 * - Normalizes JSON / text responses.
 * - Provides a couple of app-specific API methods.
 */

const TOKEN_STORAGE_KEY = "auth_token";

function readToken() {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeToken(token) {
  try {
    if (!token) localStorage.removeItem(TOKEN_STORAGE_KEY);
    else localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch {
    // ignore storage errors (e.g., blocked storage)
  }
}

// PUBLIC_INTERFACE
export function setAuthToken(token) {
  /** Persists auth token to localStorage. */
  writeToken(token);
}

// PUBLIC_INTERFACE
export function getAuthToken() {
  /** Reads auth token from localStorage. */
  return readToken();
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

function buildUrl(path) {
  const base = getApiBaseUrl();
  if (!base) return path; // allows relative calls in dev/proxy setups
  if (!path.startsWith("/")) return `${base}/${path}`;
  return `${base}${path}`;
}

async function request(path, { method = "GET", body, headers } = {}) {
  const token = readToken();
  const res = await fetch(buildUrl(path), {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {})
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await parseResponse(res);

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && (data.detail || data.message)) ||
      (typeof data === "string" && data) ||
      `Request failed with ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * App-level API.
 * Note: backend OpenAPI currently only defines GET "/" (health check).
 * We still implement auth + dashboard methods to match the requested UI,
 * and gracefully fall back to mock data when endpoints are missing.
 */
export const api = {
  // PUBLIC_INTERFACE
  async health() {
    /** Returns backend health check response. */
    return request("/", { method: "GET" });
  },

  // PUBLIC_INTERFACE
  async login({ email, password }) {
    /** Attempts to login; falls back to a demo token if endpoint is unavailable. */
    try {
      const data = await request("/auth/login", { method: "POST", body: { email, password } });
      return data;
    } catch (e) {
      // If backend doesn't have auth yet, allow demo-mode login for UI flow.
      if (e.status === 404) {
        return { access_token: "demo-token", token_type: "bearer", user: { email } };
      }
      throw e;
    }
  },

  // PUBLIC_INTERFACE
  async register({ name, email, password }) {
    /** Attempts to register; falls back to success if endpoint is unavailable. */
    try {
      return await request("/auth/register", {
        method: "POST",
        body: { name, email, password }
      });
    } catch (e) {
      if (e.status === 404) {
        return { ok: true };
      }
      throw e;
    }
  },

  // PUBLIC_INTERFACE
  async forgotPassword({ email }) {
    /** Requests password reset; falls back to success if endpoint is unavailable. */
    try {
      return await request("/auth/forgot-password", { method: "POST", body: { email } });
    } catch (e) {
      if (e.status === 404) {
        return { ok: true };
      }
      throw e;
    }
  },

  // PUBLIC_INTERFACE
  async getDashboardSummary() {
    /** Fetches dashboard cards/summary; falls back to mock if endpoint is unavailable. */
    try {
      return await request("/dashboard/summary", { method: "GET" });
    } catch (e) {
      if (e.status === 404) {
        return {
          cards: [
            { label: "Active Users", value: 1280, delta: "+6.4%" },
            { label: "Revenue", value: "$24,380", delta: "+2.1%" },
            { label: "Conversions", value: "3.8%", delta: "-0.4%" },
            { label: "Uptime", value: "99.97%", delta: "+0.02%" }
          ]
        };
      }
      throw e;
    }
  },

  // PUBLIC_INTERFACE
  async getRecentActivity() {
    /** Fetches table rows; falls back to mock if endpoint is unavailable. */
    try {
      return await request("/dashboard/activity", { method: "GET" });
    } catch (e) {
      if (e.status === 404) {
        const now = Date.now();
        return {
          rows: [
            { id: "evt_1001", type: "login", user: "alex@company.com", status: "success", time: new Date(now - 1000 * 60 * 3).toISOString() },
            { id: "evt_1002", type: "purchase", user: "sam@company.com", status: "success", time: new Date(now - 1000 * 60 * 20).toISOString() },
            { id: "evt_1003", type: "password_reset", user: "lee@company.com", status: "pending", time: new Date(now - 1000 * 60 * 55).toISOString() },
            { id: "evt_1004", type: "login", user: "taylor@company.com", status: "failed", time: new Date(now - 1000 * 60 * 90).toISOString() }
          ]
        };
      }
      throw e;
    }
  }
};
