import Link from "next/link";
import { Home, Zap } from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-8 text-center"
      style={{ background: "#080b14" }}
    >
      {/* Logo */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8"
        style={{ background: "linear-gradient(135deg, #6366f1, #10b981)" }}
      >
        <Zap className="w-8 h-8 text-white" />
      </div>

      {/* 404 */}
      <div
        className="text-8xl font-bold mb-4 text-gradient"
        style={{ fontFamily: "var(--font-display)" }}
      >
        404
      </div>

      <h1
        className="text-2xl font-bold mb-2"
        style={{ color: "#e2e8f0", fontFamily: "var(--font-display)" }}
      >
        Workflow not found
      </h1>
      <p className="text-sm mb-8 max-w-sm" style={{ color: "#64748b" }}>
        This page doesn&apos;t exist or may have been moved. Head back to the
        dashboard.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
        style={{
          background: "rgba(99,102,241,0.15)",
          border: "1px solid rgba(99,102,241,0.3)",
          color: "#818cf8",
        }}
      >
        <Home className="w-4 h-4" />
        Back to Dashboard
      </Link>
    </div>
  );
}
