"use client";

import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const response = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Login failed");
      setSubmitting(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm space-y-5">
      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium text-fg-muted">
          Admin password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-12 w-full rounded-md border border-border bg-bg-elev px-4 text-base text-fg shadow-sm"
          autoComplete="current-password"
          required
        />
      </div>
      {error ? <p className="text-sm font-medium text-accent-4">{error}</p> : null}
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-fg px-4 text-sm font-semibold text-bg disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Lock size={16} />
        {submitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
