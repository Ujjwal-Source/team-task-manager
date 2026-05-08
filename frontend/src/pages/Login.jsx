import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { auth } from "../api";
import toast from "react-hot-toast";

export default function Login({ onSwitch }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Email and Password both required ");
      return;
    }
    setLoading(true);
    try {
      const res = await auth.login(form);
      login(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.name}!`);
    } catch (err) {
      const msg =
        err.response?.data?.error || "Login failed - backend not working?";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">TaskFlow</div>
        <p className="auth-subtitle">Sign in to manage your projects</p>

        {error && (
          <div
            style={{
              background: "rgba(255,101,132,0.1)",
              border: "1px solid rgba(255,101,132,0.3)",
              borderRadius: "10px",
              padding: "10px 14px",
              marginBottom: "16px",
              fontSize: "13px",
              color: "var(--accent2)",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              className="form-control"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                setError("");
              }}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              className="form-control"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => {
                setForm({ ...form, password: e.target.value });
                setError("");
              }}
            />
          </div>
          <button
            className="btn btn-primary btn-block"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" /> Logging in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            background: "var(--surface2)",
            borderRadius: "10px",
            fontSize: "12px",
            color: "var(--muted)",
          }}
        >
          💡 First time? First <strong>Sign Up</strong>
        </div>

        <div className="auth-switch">
          Don't have an account? <a onClick={onSwitch}>Sign up</a>
        </div>
      </div>
    </div>
  );
}
