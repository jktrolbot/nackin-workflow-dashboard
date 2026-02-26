"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Workflow,
  LayoutTemplate,
  Zap,
  Bell,
  Settings,
  ChevronRight,
  Activity,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/workflows", label: "Workflows", icon: Workflow, badge: "6" },
  { href: "/templates", label: "Templates", icon: LayoutTemplate },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 flex flex-col w-60 border-r"
        style={{ background: "#0a0e1a", borderColor: "#1e2535" }}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b" style={{ borderColor: "#1e2535" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6366f1, #10b981)" }}>
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight" style={{ fontFamily: "var(--font-display)", color: "#e2e8f0" }}>
              FlowCommand
            </div>
            <div className="text-xs" style={{ color: "#64748b" }}>Automation Hub</div>
          </div>
        </div>

        {/* Live indicator */}
        <div className="px-4 py-3 mx-4 mt-4 rounded-lg flex items-center gap-2"
          style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium" style={{ color: "#10b981" }}>Live monitoring</span>
          <Activity className="w-3 h-3 ml-auto" style={{ color: "#10b981" }} />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 mt-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                  isActive
                    ? "text-white"
                    : "hover:text-white"
                )}
                style={isActive
                  ? { background: "rgba(99,102,241,0.15)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.2)" }
                  : { color: "#64748b", border: "1px solid transparent" }
                }>
                <Icon className={cn("w-4 h-4", isActive ? "" : "group-hover:text-indigo-400")}
                  style={{ color: isActive ? "#818cf8" : undefined }} />
                <span>{item.label}</span>
                {item.badge && (
                  <Badge className="ml-auto text-xs px-1.5 py-0 h-5"
                    style={{ background: "rgba(99,102,241,0.2)", color: "#818cf8", border: "none" }}>
                    {item.badge}
                  </Badge>
                )}
                {isActive && <ChevronRight className="w-3 h-3 ml-auto" style={{ color: "#818cf8" }} />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-4 space-y-1 border-t pt-4" style={{ borderColor: "#1e2535" }}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full transition-all"
                style={{ color: "#64748b" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#e2e8f0")}
                onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}>
                <Bell className="w-4 h-4" />
                <span>Alerts</span>
                <span className="ml-auto w-2 h-2 rounded-full bg-red-500" />
              </button>
            </TooltipTrigger>
            <TooltipContent>1 active error</TooltipContent>
          </Tooltip>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full transition-all"
            style={{ color: "#64748b" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#e2e8f0")}
            onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}>
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-60 min-h-screen">
        {children}
      </main>
    </div>
  );
}
