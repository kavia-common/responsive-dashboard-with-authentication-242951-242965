import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import { Button, InlineAlert, TextField } from "../components/ui";
import { useAuth } from "../auth/AuthContext";

function validateEmail(value) {
  if (!value) return "Email is required";
  if (!/^\S+@\S+\.\S+$/.test(value)) return "Enter a valid email";
  return "";
}

// PUBLIC_INTERFACE
export function LoginPage() {
  /** Login form page. */
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = useMemo(() => location.state?.from || "/app", [location.state]);

  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const errors = useMemo(() => {
    return {
      email: validateEmail(form.email),
      password: !form.password ? "Password is required" : ""
    };
  }, [form.email, form.password]);

  const canSubmit = !errors.email && !errors.password && !submitting;

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!canSubmit) return;

    setSubmitting(true);
    try {
      await login({ email: form.email, password: form.password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setServerError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to your dashboard."
      footer={
        <div className="authFooterRow">
          <span>New here?</span> <Link to="/register">Create an account</Link>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="authForm">
        {serverError ? <InlineAlert tone="error" title="Unable to sign in">{serverError}</InlineAlert> : null}

        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          placeholder="you@company.com"
          error={errors.email}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
          placeholder="••••••••"
          error={errors.password}
        />

        <div className="authActions">
          <Link to="/forgot-password" className="linkMuted">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" isLoading={submitting} disabled={!canSubmit}>
          Sign in
        </Button>

        <div className="authHint">
          Tip: if the backend auth endpoints are not available yet, a demo token is used so you can explore the UI.
        </div>
      </form>
    </AuthLayout>
  );
}
