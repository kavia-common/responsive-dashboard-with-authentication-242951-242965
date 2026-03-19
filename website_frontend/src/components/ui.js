import React from "react";

// PUBLIC_INTERFACE
export function TextField({ label, name, type = "text", value, onChange, placeholder, error, autoComplete }) {
  /** Standard text field with label and error message. */
  return (
    <div className="field">
      <label className="fieldLabel" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        className={`input ${error ? "inputError" : ""}`}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error ? (
        <div id={`${name}-error`} className="fieldError" role="alert">
          {error}
        </div>
      ) : null}
    </div>
  );
}

// PUBLIC_INTERFACE
export function Button({ children, variant = "primary", type = "button", onClick, disabled, isLoading }) {
  /** Button with variants and loading state. */
  return (
    <button
      className={`btn ${variant === "secondary" ? "btnSecondary" : "btnPrimary"}`}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? <span className="spinner" aria-hidden="true" /> : null}
      <span>{children}</span>
    </button>
  );
}

// PUBLIC_INTERFACE
export function InlineAlert({ tone = "info", title, children }) {
  /** Inline alert for errors/info. */
  return (
    <div className={`alert ${tone === "error" ? "alertError" : "alertInfo"}`} role={tone === "error" ? "alert" : "status"}>
      {title ? <div className="alertTitle">{title}</div> : null}
      <div className="alertBody">{children}</div>
    </div>
  );
}
