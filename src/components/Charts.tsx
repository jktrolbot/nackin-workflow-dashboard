"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { generateChartData, getCategoryBreakdown } from "@/lib/data";
import { useState } from "react";

const data = generateChartData();

interface TooltipEntry {
  name?: string;
  value?: number | string;
  color?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-lg p-3 text-sm shadow-xl"
        style={{
          background: "#141824",
          border: "1px solid #2a3347",
          fontFamily: "var(--font-mono)",
        }}
      >
        <p className="mb-2" style={{ color: "#64748b" }}>
          {label}
        </p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: entry.color }}
            />
            <span style={{ color: "#e2e8f0" }}>{entry.value}</span>
            <span style={{ color: "#64748b" }}>{entry.name}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

type ChartView = "executions" | "success" | "timeSaved";

export function ExecutionsChart() {
  const [view, setView] = useState<ChartView>("executions");

  const tabs: { id: ChartView; label: string }[] = [
    { id: "executions", label: "Executions" },
    { id: "success", label: "Success Rate" },
    { id: "timeSaved", label: "Time Saved" },
  ];

  const last14 = data.slice(-14);

  return (
    <div
      className="rounded-xl p-5 h-full"
      style={{ background: "#0f1420", border: "1px solid #1e2535" }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3
            className="font-semibold text-sm"
            style={{
              color: "#e2e8f0",
              fontFamily: "var(--font-display)",
            }}
          >
            Performance Overview
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>
            Last 14 days
          </p>
        </div>
        <div
          className="flex gap-1 p-1 rounded-lg"
          style={{ background: "#141824" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className="px-3 py-1.5 text-xs rounded-md transition-all"
              style={
                view === tab.id
                  ? { background: "#1e2535", color: "#818cf8" }
                  : { color: "#64748b" }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        {view === "executions" ? (
          <AreaChart
            data={last14}
            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="execGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="failGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e2535"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: "#64748b", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="executions"
              name="executions"
              stroke="#6366f1"
              fill="url(#execGrad)"
              strokeWidth={2}
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="failed"
              name="failed"
              stroke="#ef4444"
              fill="url(#failGrad)"
              strokeWidth={1.5}
              dot={false}
            />
          </AreaChart>
        ) : view === "success" ? (
          <LineChart
            data={last14}
            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e2535"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: "#64748b", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[80, 100]}
              tick={{ fill: "#64748b", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="successRate"
              name="%"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        ) : (
          <BarChart
            data={last14}
            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e2535"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: "#64748b", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="timeSaved"
              name="min"
              fill="#f59e0b"
              radius={[4, 4, 0, 0]}
              opacity={0.8}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryBreakdown() {
  // Use real data derived from actual workflow runs
  const catData = getCategoryBreakdown();
  const maxValue = Math.max(...catData.map((c) => c.value), 1);

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: "#0f1420", border: "1px solid #1e2535" }}
    >
      <h3
        className="font-semibold text-sm mb-1"
        style={{ color: "#e2e8f0", fontFamily: "var(--font-display)" }}
      >
        Executions by Category
      </h3>
      <p className="text-xs mb-5" style={{ color: "#64748b" }}>
        Today
      </p>
      <div className="space-y-3">
        {catData.map((cat) => (
          <div key={cat.name}>
            <div className="flex items-center justify-between mb-1.5">
              <span
                className="text-xs font-medium"
                style={{ color: "#e2e8f0" }}
              >
                {cat.name}
              </span>
              <span
                className="text-xs"
                style={{ color: "#64748b", fontFamily: "var(--font-mono)" }}
              >
                {cat.value} runs
              </span>
            </div>
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ background: "#1e2535" }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${(cat.value / maxValue) * 100}%`,
                  background: cat.color,
                  opacity: cat.value === 0 ? 0.3 : 1,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
