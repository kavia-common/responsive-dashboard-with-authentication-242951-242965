import React, { useEffect, useMemo, useState } from "react";
import { InlineAlert } from "../components/ui";
import { api } from "../api/client";

function formatTime(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

// PUBLIC_INTERFACE
export function DashboardHomePage() {
  /** Dashboard overview page: cards + recent activity table. */
  const [summary, setSummary] = useState(null);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const [s, a] = await Promise.all([api.getDashboardSummary(), api.getRecentActivity()]);
        if (cancelled) return;
        setSummary(s);
        setActivity(a);
      } catch (e) {
        if (cancelled) return;
        setError(e.message || "Failed to load dashboard");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    const timer = setInterval(load, 20000); // update periodically
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  const cards = useMemo(() => summary?.cards || [], [summary]);
  const rows = useMemo(() => activity?.rows || [], [activity]);

  return (
    <div className="dashPage">
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Overview</h2>
          <p className="pageSub">Your key metrics and recent events.</p>
        </div>
        <div className="pageMeta">
          <span className="metaDot" aria-hidden="true" />
          <span>Auto-updates every 20s</span>
        </div>
      </div>

      {error ? <InlineAlert tone="error" title="Dashboard error">{error}</InlineAlert> : null}

      <section className="cardGrid" aria-busy={loading}>
        {(loading ? new Array(4).fill(null) : cards).map((c, idx) => (
          <div key={idx} className={`metricCard ${loading ? "skeleton" : ""}`}>
            {!loading ? (
              <>
                <div className="metricLabel">{c.label}</div>
                <div className="metricValue">{c.value}</div>
                <div className={`metricDelta ${String(c.delta).startsWith("-") ? "deltaDown" : "deltaUp"}`}>
                  {c.delta}
                </div>
              </>
            ) : (
              <>
                <div className="skLine skW40" />
                <div className="skLine skW70" />
                <div className="skLine skW30" />
              </>
            )}
          </div>
        ))}
      </section>

      <section className="tableCard">
        <div className="tableHeader">
          <h3 className="tableTitle">Recent activity</h3>
          <div className="tableHint">Latest events from your workspace</div>
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
                new Array(4).fill(null).map((_, i) => (
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
                    <td>
                      <span className={`statusPill ${r.status === "success" ? "pillOk" : r.status === "failed" ? "pillBad" : "pillWarn"}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="muted">{formatTime(r.time)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="muted">
                    No recent activity.
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
