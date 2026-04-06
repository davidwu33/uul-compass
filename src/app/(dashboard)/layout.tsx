import { SideNav } from "@/components/shared/side-nav";
import { TopNav } from "@/components/shared/top-nav";
import { BottomNav } from "@/components/shared/bottom-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0b1325]">
      <TopNav />
      <SideNav />
      <main className="lg:ml-64 pt-24 pb-24 lg:pb-8 px-6 min-h-screen">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
