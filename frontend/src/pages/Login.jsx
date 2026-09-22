import { useState } from "react";

export default function Login({ onSubmit, onRegister }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  return (
    <main className="auth">
      <div className="auth-panel">
        <span className="eyebrow">Orbit Tasks</span>
        <h1>Make room for focused work.</h1>
        <p>Keep the small promises visible and the important work moving.</p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setSubmitting(true);
            setError("");
            try {
              await onSubmit(form);
            } catch (err) {
              setError(err.message || "Sign in failed");
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
          <input
            type="email"
            placeholder="Email address"
            required
            disabled={submitting}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            required
            disabled={submitting}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button className="primary" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <button className="text-button" onClick={onRegister} disabled={submitting}>
          Create an account
        </button>
      </div>
    </main>
  );
}
