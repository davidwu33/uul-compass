import {
  LayoutDashboard,
  Target,
  ListChecks,
  TrendingUp,
  Shield,
  Ship,
  FileText,
  Users,
  Truck,
  DollarSign,
  Settings,
  CheckSquare,
  FolderOpen,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  section: "main" | "tracking" | "operations" | "system";
  phase?: number; // undefined = active now
}

export const navItems: NavItem[] = [
  // Main
  { label: "Dashboard", href: "/", icon: LayoutDashboard, section: "main" },
  { label: "100-Day Plan", href: "/plan", icon: Target, section: "main" },
  { label: "My Tasks", href: "/my-tasks", icon: ListChecks, section: "main" },
  // Tracking
  { label: "Value Gains", href: "/value-gains", icon: TrendingUp, section: "tracking" },
  { label: "Risks", href: "/risks", icon: Shield, section: "tracking" },
  // Operations (future phases)
  { label: "Shipments", href: "/shipments", icon: Ship, section: "operations", phase: 2 },
  { label: "Quotes", href: "/quotes", icon: FileText, section: "operations", phase: 2 },
  { label: "Customers", href: "/customers", icon: Users, section: "operations", phase: 2 },
  { label: "Carriers", href: "/carriers", icon: Truck, section: "operations", phase: 2 },
  { label: "Finance", href: "/finance", icon: DollarSign, section: "operations", phase: 3 },
  // System
  { label: "Decisions", href: "/decisions", icon: CheckSquare, section: "system" },
  { label: "Documents", href: "/documents", icon: FolderOpen, section: "system", phase: 4 },
  { label: "Settings", href: "/settings", icon: Settings, section: "system" },
];

export function getNavBySection(section: NavItem["section"]) {
  return navItems.filter((item) => item.section === section);
}
