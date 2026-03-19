import React from "react";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
export function AuthLayout({ title, subtitle, children, footer }) {
  /** Centered auth layout container. */
  return (
    <div className="authPage">
      <div className="authCard">
        <div className="authHeader">
          <Link to="/" className="brand">
            <span className="brandMark" aria-hidden="true" />
            <span className="brandText">KAVIA</span>
          </Link>
          <h1 className="authTitle">{title}</h1>
          {subtitle ? <p className="authSubtitle">{subtitle}</p> : null}
        </div>

        {children}

        {footer ? <div className="authFooter">{footer}</div> : null}
      </div>
    </div>
  );
}
