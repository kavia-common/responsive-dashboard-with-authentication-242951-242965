import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

// PUBLIC_INTERFACE
export function DashboardLayout() {
  /** Layout for authenticated section: sidebar + top nav + main content. */
  const { user, logout } = useAuth();

  return (
    <div className="dashShell">
      <aside className="sidebar" aria-label="Sidebar navigation">
        <Link to="/app" className="sidebarBrand">
          <span className="brandMark" aria-hidden="true" />
          <span className="sidebarBrandText">KAVIA</span>
        </Link>

        <nav className="sidebarNav">
          <NavLink to="/app" end className={({ isActive }) => `navItem ${isActive ? "navItemActive" : ""}`}>
            Overview
          </NavLink>
          <NavLink to="/app/activity" className={({ isActive }) => `navItem ${isActive ? "navItemActive" : ""}`}>
            Activity
          </NavLink>
          <NavLink to="/app/settings" className={({ isActive }) => `navItem ${isActive ? "navItemActive" : ""}`}>
            Settings
          </NavLink>
        </nav>

        <div className="sidebarFooter">
          <div className="userBadge" title={user?.email || ""}>
            <div className="userDot" aria-hidden="true" />
            <div className="userMeta">
              <div className="userName">{user?.email || "Signed in"}</div>
              <div className="userRole">Member</div>
            </div>
          </div>
          <button className="logoutBtn" onClick={logout}>
            Sign out
          </button>
        </div>
      </aside>

      <div className="mainArea">
        <header className="topbar">
          <div className="topbarTitle">Dashboard</div>
          <div className="topbarActions">
            <a className="topbarLink" href="/app" onClick={(e) => e.preventDefault()}>
              Help
            </a>
            <div className="topbarPill">Light theme</div>
          </div>
        </header>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
