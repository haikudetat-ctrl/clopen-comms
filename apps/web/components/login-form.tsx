"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Signing in...");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus("Success. Redirecting...");
    router.push("/app");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="panel" style={{ display: "grid", gap: "0.85rem", width: 360 }}>
      <h2>Sign In</h2>
      <p>Use your invited account credentials.</p>

      <label style={{ display: "grid", gap: "0.4rem" }}>
        <span>Email</span>
        <input
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          style={{ padding: "0.6rem", borderRadius: 10, border: "1px solid var(--border)" }}
        />
      </label>

      <label style={{ display: "grid", gap: "0.4rem" }}>
        <span>Password</span>
        <input
          required
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          style={{ padding: "0.6rem", borderRadius: 10, border: "1px solid var(--border)" }}
        />
      </label>

      <button className="button" type="submit">
        Continue
      </button>

      {status ? <p>{status}</p> : null}
    </form>
  );
}
