import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { getAdminPortfolioData } from "@/server/admin";
import { isAdminSession } from "@/server/auth";

async function loadPortfolio() {
  try {
    return await getAdminPortfolioData();
  } catch {
    return null;
  }
}

export default async function AdminPage() {
  if (!(await isAdminSession())) {
    redirect("/admin/login");
  }

  const portfolio = await loadPortfolio();

  if (portfolio) {
    return <AdminDashboard initialData={portfolio} />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-6 text-fg">
      <section className="max-w-lg rounded-md border border-border bg-bg-elev p-6">
        <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Portfolio admin
        </p>
        <h1 className="mb-3 text-2xl font-semibold">Admin data is not available</h1>
        <p className="text-sm leading-6 text-fg-muted">
          Set `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and
          `ADMIN_PASSWORD` in the production environment, then redeploy.
        </p>
      </section>
    </main>
  );
}
