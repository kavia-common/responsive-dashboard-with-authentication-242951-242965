/**
 * Environment configuration helpers.
 *
 * CRA exposes env vars that start with REACT_APP_ at build/runtime.
 */

const normalizeBaseUrl = (value) => {
  if (!value) return "";
  return value.endsWith("/") ? value.slice(0, -1) : value;
};

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Returns the base URL used for REST API requests. */
  return (
    normalizeBaseUrl(process.env.REACT_APP_API_BASE) ||
    normalizeBaseUrl(process.env.REACT_APP_BACKEND_URL) ||
    ""
  );
}

// PUBLIC_INTERFACE
export function getFrontendUrl() {
  /** Returns the frontend canonical URL if provided. */
  return normalizeBaseUrl(process.env.REACT_APP_FRONTEND_URL) || "";
}

// PUBLIC_INTERFACE
export function getWsUrl() {
  /** Returns the websocket URL if provided. */
  return normalizeBaseUrl(process.env.REACT_APP_WS_URL) || "";
}

// PUBLIC_INTERFACE
export function getNodeEnv() {
  /** Returns node environment, defaults to 'development'. */
  return process.env.REACT_APP_NODE_ENV || process.env.NODE_ENV || "development";
}
