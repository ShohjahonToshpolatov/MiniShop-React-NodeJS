import { useState } from "react";
import { request } from "../api";

export default function AuthForm({ onSuccess }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const body = isRegister
        ? form
        : { email: form.email, password: form.password };

      const data = await request(`/auth/${mode}`, { method: "POST", body });

      onSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      {isRegister && (
        <input
          name="name"
          placeholder="Ismingizni kiriting"
          value={form.name}
          onChange={handleChange}
          required
          minLength={2}
          maxLength={50}
        />
      )}

      <input
        name="email"
        type="email"
        placeholder="Email kiriting"
        value={form.email}
        onChange={handleChange}
        required
        maxLength={100}
      />

      <input
        name="password"
        type="password"
        placeholder="Parol kamida 6 xonali belgi bolsin"
        value={form.password}
        onChange={handleChange}
        required
        minLength={isRegister ? 6 : undefined}
        maxLength={30}
      />

      {error && <p className="error">{error}</p>}

      <button className="btn-primary" disabled={loading}>
        {loading ? "Kuting..." : isRegister ? "Royxatdan oting" : "Kirish"}
      </button>

      <p className="switch">
        {isRegister ? "Akkauntingiz bormi ?" : "Akkauntingiz yoqmi "}
        <button
          type="button"
          disabled={loading}
          onClick={() => setMode(isRegister ? "login" : "register")}
        >
          {isRegister ? "Kirish" : "Royxatdan otish"}
        </button>
      </p>
    </form>
  );
}
