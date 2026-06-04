import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminProvider } from "@/components/admin/AdminContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <AdminProvider>
      <div className="min-h-screen bg-bg-primary flex">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader />
          <main className="flex-1 p-6 lg:p-8 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminProvider>
  );
}
