import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import { Button, InlineAlert, TextField } from "../components/ui";
import { useAuth } from "../auth/AuthContext";

function validateEmail(value) {
  if (!value) return "Email is required";
  if (!/^\S+@\S+\.\S+$/.test(value)) return "Enter a valid email";
  return "";
}

// PUBLIC_INTERFACE
export function RegisterPage() {
  /** Registration form page. */
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const errors = useMemo(() => {
    const passwordError = !form.password
      ? "Password is required"
      : form.password.length < 8
        ? "Password must be at least 8 characters"
        : "";

    const confirmError =
      !form.confirmPassword ? "Confirm your password" : form.confirmPassword !== form.password ? "Passwords do not match" : "";

    return {
      name: !form.name ? "Name is required" : "",
      email: validateEmail(form.email),
      password: passwordError,
      confirmPassword: confirmError
    };
  }, [form]);

  const canSubmit =
    !errors.name && !errors.email && !errors.password && !errors.confirmPassword && !submitting && !success;

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!canSubmit) return;

    setSubmitting(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      setServerError(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Get started in minutes."
      footer={
        <div className="authFooterRow">
          <span>Already have an account?</span> <Link to="/login">Sign in</Link>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="authForm">
        {serverError ? <InlineAlert tone="error" title="Unable to register">{serverError}</InlineAlert> : null}
        {success ? <InlineAlert title="Account created">Redirecting you to sign in…</InlineAlert> : null}

        <TextField
          label="Name"
          name="name"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          placeholder="Alex Johnson"
          error={errors.name}
          autoComplete="name"
        />

        <TextField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          placeholder="you@company.com"
          error={errors.email}
          autoComplete="email"
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
          placeholder="Create a strong password"
          error={errors.password}
          autoComplete="new-password"
        />

        <TextField
          label="Confirm password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
          placeholder="Repeat your password"
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        <Button type="submit" isLoading={submitting} disabled={!canSubmit}>
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
