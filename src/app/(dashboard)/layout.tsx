import { Sidebar } from "@/components/shared/sidebar";
import { BottomNav } from "@/components/shared/bottom-nav";
import { Topbar } from "@/components/shared/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 p-4 lg:p-8 pb-20 lg:pb-8 max-w-7xl">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
