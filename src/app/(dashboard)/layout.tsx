import { SideNav } from "@/components/shared/side-nav";
import { TopNav } from "@/components/shared/top-nav";
import { BottomNav } from "@/components/shared/bottom-nav";
import { LanguageProvider } from "@/lib/i18n/context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#0b1325]">
        <TopNav />
        <SideNav />
        <main className="lg:ml-64 pt-24 pb-24 lg:pb-8 px-6 min-h-screen">
          {children}
        </main>
        <BottomNav />
      </div>
    </LanguageProvider>
  );
}
