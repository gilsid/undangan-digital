"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: fd.get("email"),
      password: fd.get("password"),
      redirect: false,
    });

    if (result?.error) {
      setError("Email atau password salah.");
      setLoading(false);
    } else {
      const session = await getSession();
      if (session?.user?.role === "SUPERADMIN") {
        router.push("/superadmin");
      } else {
        router.push("/admin/dashboard");
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--ink-bg)]">
      <div className="ledger-card w-full max-w-sm p-8">
        <h1
          className="text-3xl font-light text-center mb-2 text-[var(--text-primary)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Undangan Digital
        </h1>
        <p className="text-sm text-center text-[var(--text-secondary)] mb-8">
          Dashboard Mempelai
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full border border-[var(--ink-border)] rounded-md px-3 py-2 text-sm bg-[var(--ink-surface)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--foil-gold)] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-1">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full border border-[var(--ink-border)] rounded-md px-3 py-2 text-sm bg-[var(--ink-surface)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--foil-gold)] focus:border-transparent"
            />
          </div>

          {error && (
            <p className="text-[var(--status-danger)] text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-md text-sm font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--foil-gold)] text-[var(--ink-bg)] hover:bg-[var(--foil-gold-muted)] active:scale-[0.98]"
          >
            {loading ? "Masuk..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}
