import { useState } from "react";

function fieldMessage(errors, key) {
  if (!errors?.[key]) return "";
  return errors[key];
}

export default function Register({ onSubmit, onLogin }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  return (
    <main className="auth">
      <div className="auth-panel">
        <span className="eyebrow">Start simply</span>
        <h1>Your work, in orbit.</h1>
        <p>A clear place for today's priorities.</p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setSubmitting(true);
            setError("");
            setFieldErrors({});
            try {
              await onSubmit(form);
            } catch (err) {
              setError(err.message || "Could not create account");
              if (err.errors) setFieldErrors(err.errors);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}
          <label className="auth-field">
            Your name
            <input
              placeholder="Your name"
              required
              disabled={submitting}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
          <label className="auth-field">
            Email address
            <input
              type="email"
              placeholder="Email address"
              required
              disabled={submitting}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {fieldMessage(fieldErrors, "email") ? (
              <span className="field-hint">{fieldMessage(fieldErrors, "email")}</span>
            ) : null}
          </label>
          <label className="auth-field">
            Password
            <input
              type="password"
              placeholder="Password"
              required
              disabled={submitting}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {fieldMessage(fieldErrors, "password") ? (
              <span className="field-hint">
                {fieldMessage(fieldErrors, "password")}
              </span>
            ) : null}
          </label>
          <button className="primary" disabled={submitting}>
            {submitting ? "Creating account…" : "Create account"}
          </button>
        </form>
        <button className="text-button" onClick={onLogin} disabled={submitting}>
          Back to sign in
        </button>
      </div>
    </main>
  );
}
