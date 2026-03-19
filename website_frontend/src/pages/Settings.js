import React from "react";
import { getApiBaseUrl, getNodeEnv, getWsUrl } from "../config/env";

// PUBLIC_INTERFACE
export function SettingsPage() {
  /** Settings page showing runtime configuration (read-only). */
  return (
    <div className="dashPage">
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Settings</h2>
          <p className="pageSub">Environment and connection info.</p>
        </div>
      </div>

      <section className="tableCard">
        <div className="tableHeader">
          <h3 className="tableTitle">Connection</h3>
          <div className="tableHint">These values come from REACT_APP_* environment variables.</div>
        </div>

        <div className="kvGrid">
          <div className="kv">
            <div className="kvKey">API base URL</div>
            <div className="kvVal mono">{getApiBaseUrl() || "(not set)"}</div>
          </div>
          <div className="kv">
            <div className="kvKey">WebSocket URL</div>
            <div className="kvVal mono">{getWsUrl() || "(not set)"}</div>
          </div>
          <div className="kv">
            <div className="kvKey">Environment</div>
            <div className="kvVal mono">{getNodeEnv()}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
