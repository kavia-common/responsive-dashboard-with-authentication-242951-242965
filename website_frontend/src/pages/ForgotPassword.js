import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import { Button, InlineAlert, TextField } from "../components/ui";
import { api } from "../api/client";

function validateEmail(value) {
  if (!value) return "Email is required";
  if (!/^\S+@\S+\.\S+$/.test(value)) return "Enter a valid email";
  return "";
}

// PUBLIC_INTERFACE
export function ForgotPasswordPage() {
  /** Forgot password page that triggers reset email via backend. */
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const error = useMemo(() => validateEmail(email), [email]);
  const canSubmit = !error && !submitting;

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setSuccess(false);
    if (!canSubmit) return;

    setSubmitting(true);
    try {
      await api.forgotPassword({ email });
      setSuccess(true);
    } catch (err) {
      setServerError(err.message || "Request failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We’ll send you a reset link if your email exists in our system."
      footer={
        <div className="authFooterRow">
          <Link to="/login">Back to sign in</Link>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="authForm">
        {serverError ? <InlineAlert tone="error" title="Unable to send reset email">{serverError}</InlineAlert> : null}
        {success ? <InlineAlert title="Check your inbox">If an account exists, you’ll receive an email shortly.</InlineAlert> : null}

        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          error={error}
        />

        <Button type="submit" isLoading={submitting} disabled={!canSubmit}>
          Send reset link
        </Button>
      </form>
    </AuthLayout>
  );
}
