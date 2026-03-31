import Link from "next/link";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "1.25rem"
      }}
    >
      <section style={{ display: "grid", gap: "1rem", justifyItems: "center" }}>
        <LoginForm />
        <Link href="/" style={{ color: "var(--brand-primary)" }}>
          Back to overview
        </Link>
      </section>
    </main>
  );
}
