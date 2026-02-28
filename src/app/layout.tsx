import type { Metadata } from "next";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "FlowCommand — Workflow Automation Dashboard",
  description:
    "Monitor, manage, and optimize your automated workflows. Built with n8n integration.",
  keywords: ["n8n", "workflow automation", "dashboard", "automation"],
  openGraph: {
    title: "FlowCommand — Workflow Automation Dashboard",
    description: "Monitor and manage your automated workflows in real-time.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <ToastProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
