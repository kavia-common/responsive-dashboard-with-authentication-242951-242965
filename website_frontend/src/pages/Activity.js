import React, { useEffect, useMemo, useState } from "react";
import { InlineAlert } from "../components/ui";
import { api } from "../api/client";

// PUBLIC_INTERFACE
export function ActivityPage() {
  /** Activity page showing a larger activity table. */
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await api.getRecentActivity();
        if (!cancelled) setActivity(data);
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load activity");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const rows = useMemo(() => activity?.rows || [], [activity]);

  return (
    <div className="dashPage">
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Activity</h2>
          <p className="pageSub">Audit-style feed of key events.</p>
        </div>
      </div>

      {error ? <InlineAlert tone="error" title="Activity error">{error}</InlineAlert> : null}

      <section className="tableCard">
        <div className="tableHeader">
          <h3 className="tableTitle">Events</h3>
          <div className="tableHint">Loaded from backend (or mock fallback)</div>
        </div>

        <div className="tableWrap" aria-busy={loading}>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>User</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                new Array(8).fill(null).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5}>
                      <div className="rowSkeleton">
                        <div className="skLine skW90" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : rows.length ? (
                rows.map((r) => (
                  <tr key={r.id}>
                    <td className="mono">{r.id}</td>
                    <td>{r.type}</td>
                    <td>{r.user}</td>
                    <td className="muted">{r.status}</td>
                    <td className="muted">{r.time}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="muted">
                    No events.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
