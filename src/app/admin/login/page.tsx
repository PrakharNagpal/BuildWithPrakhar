import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { isAdminSession } from "@/server/auth";

export default async function AdminLoginPage() {
  if (await isAdminSession()) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-6 text-fg">
      <section className="w-full max-w-sm">
        <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Portfolio admin
        </p>
        <h1 className="mb-8 text-3xl font-semibold tracking-tight">Sign in</h1>
        <LoginForm />
      </section>
    </main>
  );
}
