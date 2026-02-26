export type WorkflowStatus = "active" | "paused" | "error";
export type Category = "Sales" | "Marketing" | "Operations" | "Support";
export type NodeType =
  | "trigger"
  | "action"
  | "condition"
  | "transform"
  | "output";
export type ExecutionStatus = "success" | "failed" | "running";

export interface WorkflowNode {
  id: string;
  label: string;
  type: NodeType;
  icon: string;
  description?: string;
}

export interface WorkflowEdge {
  from: string;
  to: string;
  label?: string;
}

export interface Execution {
  id: string;
  workflowId: string;
  startedAt: Date;
  duration: number; // ms
  status: ExecutionStatus;
  triggeredBy: string;
  itemsProcessed?: number;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  category: Category;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  lastRun: Date;
  executions: Execution[];
  timeSavedPerRun: number; // minutes
  successRate: number; // 0-100
  runsToday: number;
  createdAt: Date;
  tags: string[];
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: Category;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  timeSavedPerRun: number;
  estimatedSetupTime: number; // minutes
  complexity: "beginner" | "intermediate" | "advanced";
  tags: string[];
  usedBy: number;
}

const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000);
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000);
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60000);

function generateExecutions(
  workflowId: string,
  count: number,
  successRate: number
): Execution[] {
  const execs: Execution[] = [];
  for (let i = 0; i < count; i++) {
    const isSuccess = Math.random() * 100 < successRate;
    execs.push({
      id: `exec-${workflowId}-${i}`,
      workflowId,
      startedAt: minutesAgo(i * 47 + Math.floor(Math.random() * 30)),
      duration: 800 + Math.floor(Math.random() * 4200),
      status: isSuccess ? "success" : i === 0 ? "running" : "failed",
      triggeredBy: i % 3 === 0 ? "Webhook" : i % 3 === 1 ? "Schedule" : "Manual",
      itemsProcessed: Math.floor(Math.random() * 50) + 1,
    });
  }
  return execs;
}

export const workflows: Workflow[] = [
  {
    id: "wf-001",
    name: "Lead Capture → CRM → Email Sequence",
    description:
      "Automatically capture leads from web forms, enrich data, push to HubSpot, and trigger personalized email sequences.",
    status: "active",
    category: "Sales",
    nodes: [
      { id: "n1", label: "Webhook", type: "trigger", icon: "🌐", description: "Receives form submissions" },
      { id: "n2", label: "Data Enrichment", type: "transform", icon: "🔍", description: "Enrich lead data via Clearbit" },
      { id: "n3", label: "HubSpot CRM", type: "action", icon: "🟠", description: "Create/update contact in HubSpot" },
      { id: "n4", label: "Qualify Lead", type: "condition", icon: "⚡", description: "Score-based qualification" },
      { id: "n5", label: "Email Sequence", type: "output", icon: "📧", description: "Trigger 5-step nurture sequence" },
      { id: "n6", label: "Slack Notify", type: "output", icon: "💬", description: "Alert sales team" },
    ],
    edges: [
      { from: "n1", to: "n2" },
      { from: "n2", to: "n3" },
      { from: "n3", to: "n4" },
      { from: "n4", to: "n5", label: "Qualified" },
      { from: "n4", to: "n6", label: "Hot lead" },
    ],
    lastRun: minutesAgo(12),
    executions: generateExecutions("wf-001", 48, 97),
    timeSavedPerRun: 18,
    successRate: 97.2,
    runsToday: 23,
    createdAt: daysAgo(45),
    tags: ["hubspot", "email", "leads"],
  },
  {
    id: "wf-002",
    name: "Invoice Received → Extract → Accounting",
    description:
      "Parse incoming invoices from email/PDF, extract line items via AI, validate amounts, and sync to QuickBooks automatically.",
    status: "active",
    category: "Operations",
    nodes: [
      { id: "n1", label: "Email Trigger", type: "trigger", icon: "📨", description: "Monitors invoice inbox" },
      { id: "n2", label: "PDF Parser", type: "transform", icon: "📄", description: "Extract invoice data" },
      { id: "n3", label: "AI Extract", type: "transform", icon: "🤖", description: "GPT-4 line item extraction" },
      { id: "n4", label: "Validate", type: "condition", icon: "✅", description: "Amount & vendor validation" },
      { id: "n5", label: "QuickBooks", type: "output", icon: "💼", description: "Create bill in QuickBooks" },
      { id: "n6", label: "Flag Review", type: "output", icon: "🚩", description: "Send to manual review" },
    ],
    edges: [
      { from: "n1", to: "n2" },
      { from: "n2", to: "n3" },
      { from: "n3", to: "n4" },
      { from: "n4", to: "n5", label: "Valid" },
      { from: "n4", to: "n6", label: "Needs review" },
    ],
    lastRun: hoursAgo(1),
    executions: generateExecutions("wf-002", 31, 94),
    timeSavedPerRun: 25,
    successRate: 94.1,
    runsToday: 8,
    createdAt: daysAgo(62),
    tags: ["quickbooks", "pdf", "ai", "finance"],
  },
  {
    id: "wf-003",
    name: "Support Ticket → Classify → Route → Response",
    description:
      "AI-powered support ticket classification, intelligent routing to the right team, and automated first response generation.",
    status: "active",
    category: "Support",
    nodes: [
      { id: "n1", label: "Zendesk Trigger", type: "trigger", icon: "🎫", description: "New ticket created" },
      { id: "n2", label: "AI Classifier", type: "transform", icon: "🧠", description: "Classify intent & priority" },
      { id: "n3", label: "Route Logic", type: "condition", icon: "🔀", description: "Team routing rules" },
      { id: "n4", label: "Tech Support", type: "action", icon: "🔧", description: "Assign to tech team" },
      { id: "n5", label: "Billing Team", type: "action", icon: "💳", description: "Assign to billing" },
      { id: "n6", label: "Auto Response", type: "output", icon: "✉️", description: "Send AI-generated reply" },
    ],
    edges: [
      { from: "n1", to: "n2" },
      { from: "n2", to: "n3" },
      { from: "n3", to: "n4", label: "Technical" },
      { from: "n3", to: "n5", label: "Billing" },
      { from: "n4", to: "n6" },
      { from: "n5", to: "n6" },
    ],
    lastRun: minutesAgo(3),
    executions: generateExecutions("wf-003", 67, 99),
    timeSavedPerRun: 12,
    successRate: 99.1,
    runsToday: 41,
    createdAt: daysAgo(30),
    tags: ["zendesk", "ai", "support"],
  },
  {
    id: "wf-004",
    name: "Social Media → Multi-Platform Publish",
    description:
      "Write once, publish everywhere. Draft content in Notion, auto-format for each platform, schedule, and track engagement.",
    status: "paused",
    category: "Marketing",
    nodes: [
      { id: "n1", label: "Notion Trigger", type: "trigger", icon: "📝", description: "Content published in Notion" },
      { id: "n2", label: "AI Formatter", type: "transform", icon: "✨", description: "Format per platform style" },
      { id: "n3", label: "Twitter/X", type: "output", icon: "🐦", description: "Post thread" },
      { id: "n4", label: "LinkedIn", type: "output", icon: "💼", description: "Publish article" },
      { id: "n5", label: "Instagram", type: "output", icon: "📸", description: "Schedule post" },
    ],
    edges: [
      { from: "n1", to: "n2" },
      { from: "n2", to: "n3" },
      { from: "n2", to: "n4" },
      { from: "n2", to: "n5" },
    ],
    lastRun: daysAgo(2),
    executions: generateExecutions("wf-004", 15, 88),
    timeSavedPerRun: 35,
    successRate: 88.0,
    runsToday: 0,
    createdAt: daysAgo(20),
    tags: ["social", "content", "notion"],
  },
  {
    id: "wf-005",
    name: "New Signup → Welcome → Onboarding",
    description:
      "Frictionless user activation: personalized welcome email, in-app onboarding tasks, trial CRM sync, and engagement scoring.",
    status: "active",
    category: "Sales",
    nodes: [
      { id: "n1", label: "Signup Webhook", type: "trigger", icon: "👤", description: "User registers" },
      { id: "n2", label: "Segment User", type: "condition", icon: "🎯", description: "Persona detection" },
      { id: "n3", label: "Welcome Email", type: "action", icon: "💌", description: "Personalized welcome" },
      { id: "n4", label: "Intercom", type: "action", icon: "💬", description: "Create conversation" },
      { id: "n5", label: "Salesforce", type: "output", icon: "☁️", description: "Create trial opportunity" },
    ],
    edges: [
      { from: "n1", to: "n2" },
      { from: "n2", to: "n3" },
      { from: "n2", to: "n4" },
      { from: "n3", to: "n5" },
    ],
    lastRun: minutesAgo(28),
    executions: generateExecutions("wf-005", 52, 98),
    timeSavedPerRun: 20,
    successRate: 98.5,
    runsToday: 17,
    createdAt: daysAgo(90),
    tags: ["salesforce", "email", "onboarding"],
  },
  {
    id: "wf-006",
    name: "Inventory Alert → PO → Notification",
    description:
      "Monitor stock levels in real-time, auto-generate purchase orders when thresholds are breached, and notify procurement teams.",
    status: "error",
    category: "Operations",
    nodes: [
      { id: "n1", label: "Stock Monitor", type: "trigger", icon: "📦", description: "Inventory API polling" },
      { id: "n2", label: "Threshold Check", type: "condition", icon: "⚠️", description: "Below reorder point?" },
      { id: "n3", label: "Generate PO", type: "action", icon: "📋", description: "Create purchase order" },
      { id: "n4", label: "Approve PO", type: "condition", icon: "✅", description: "Auto-approve < $500" },
      { id: "n5", label: "Send PO", type: "output", icon: "📤", description: "Email to supplier" },
      { id: "n6", label: "Notify Team", type: "output", icon: "🔔", description: "Slack procurement channel" },
    ],
    edges: [
      { from: "n1", to: "n2" },
      { from: "n2", to: "n3", label: "Low stock" },
      { from: "n3", to: "n4" },
      { from: "n4", to: "n5", label: "Approved" },
      { from: "n4", to: "n6", label: "Needs approval" },
    ],
    lastRun: hoursAgo(3),
    executions: generateExecutions("wf-006", 22, 72),
    timeSavedPerRun: 40,
    successRate: 72.3,
    runsToday: 3,
    createdAt: daysAgo(15),
    tags: ["inventory", "procurement", "slack"],
  },
];

export const templates: Template[] = [
  {
    id: "tpl-001",
    name: "Lead Capture → CRM → Email Sequence",
    description:
      "Connect any web form to your CRM and auto-enroll leads in personalized email nurture sequences. Works with HubSpot, Salesforce, and Pipedrive.",
    category: "Sales",
    nodes: [
      { id: "n1", label: "Form Webhook", type: "trigger", icon: "🌐" },
      { id: "n2", label: "Enrich Data", type: "transform", icon: "🔍" },
      { id: "n3", label: "CRM Contact", type: "action", icon: "🟠" },
      { id: "n4", label: "Email Sequence", type: "output", icon: "📧" },
    ],
    edges: [
      { from: "n1", to: "n2" },
      { from: "n2", to: "n3" },
      { from: "n3", to: "n4" },
    ],
    timeSavedPerRun: 18,
    estimatedSetupTime: 20,
    complexity: "beginner",
    tags: ["crm", "email", "leads"],
    usedBy: 1240,
  },
  {
    id: "tpl-002",
    name: "Invoice → AI Extract → Accounting",
    description:
      "Stop manually entering invoices. AI extracts all data from PDFs, validates totals, and creates bills in QuickBooks or Xero automatically.",
    category: "Operations",
    nodes: [
      { id: "n1", label: "Email/Drive", type: "trigger", icon: "📨" },
      { id: "n2", label: "PDF Parser", type: "transform", icon: "📄" },
      { id: "n3", label: "GPT-4 Extract", type: "transform", icon: "🤖" },
      { id: "n4", label: "Accounting App", type: "output", icon: "💼" },
    ],
    edges: [
      { from: "n1", to: "n2" },
      { from: "n2", to: "n3" },
      { from: "n3", to: "n4" },
    ],
    timeSavedPerRun: 25,
    estimatedSetupTime: 30,
    complexity: "intermediate",
    tags: ["finance", "ai", "pdf"],
    usedBy: 876,
  },
  {
    id: "tpl-003",
    name: "Support Ticket AI Router",
    description:
      "AI classifies every support ticket by intent and priority, routes to the right team, and sends an instant acknowledgment to the customer.",
    category: "Support",
    nodes: [
      { id: "n1", label: "Helpdesk Trigger", type: "trigger", icon: "🎫" },
      { id: "n2", label: "AI Classify", type: "transform", icon: "🧠" },
      { id: "n3", label: "Smart Route", type: "condition", icon: "🔀" },
      { id: "n4", label: "Auto Response", type: "output", icon: "✉️" },
    ],
    edges: [
      { from: "n1", to: "n2" },
      { from: "n2", to: "n3" },
      { from: "n3", to: "n4" },
    ],
    timeSavedPerRun: 12,
    estimatedSetupTime: 25,
    complexity: "intermediate",
    tags: ["support", "ai", "routing"],
    usedBy: 2103,
  },
  {
    id: "tpl-004",
    name: "Content → Multi-Platform Publisher",
    description:
      "Write your content once in Notion or Airtable. AI reformats for each social platform and schedules posts at optimal times.",
    category: "Marketing",
    nodes: [
      { id: "n1", label: "Content Source", type: "trigger", icon: "📝" },
      { id: "n2", label: "AI Reformat", type: "transform", icon: "✨" },
      { id: "n3", label: "Platforms", type: "output", icon: "📡" },
    ],
    edges: [
      { from: "n1", to: "n2" },
      { from: "n2", to: "n3" },
    ],
    timeSavedPerRun: 35,
    estimatedSetupTime: 15,
    complexity: "beginner",
    tags: ["social", "content", "scheduling"],
    usedBy: 3456,
  },
  {
    id: "tpl-005",
    name: "Signup → Welcome → Onboarding",
    description:
      "Personalized onboarding that adapts to user segment. Sends tailored welcome emails, creates CRM entries, and triggers in-app onboarding flows.",
    category: "Sales",
    nodes: [
      { id: "n1", label: "User Signup", type: "trigger", icon: "👤" },
      { id: "n2", label: "Segment", type: "condition", icon: "🎯" },
      { id: "n3", label: "Welcome Email", type: "action", icon: "💌" },
      { id: "n4", label: "CRM + App", type: "output", icon: "☁️" },
    ],
    edges: [
      { from: "n1", to: "n2" },
      { from: "n2", to: "n3" },
      { from: "n3", to: "n4" },
    ],
    timeSavedPerRun: 20,
    estimatedSetupTime: 20,
    complexity: "beginner",
    tags: ["onboarding", "email", "crm"],
    usedBy: 1890,
  },
  {
    id: "tpl-006",
    name: "Inventory Alert → Auto Purchase Order",
    description:
      "Never run out of stock. Monitor inventory levels, auto-generate purchase orders when thresholds are breached, and get approval for large orders.",
    category: "Operations",
    nodes: [
      { id: "n1", label: "Inventory API", type: "trigger", icon: "📦" },
      { id: "n2", label: "Threshold Check", type: "condition", icon: "⚠️" },
      { id: "n3", label: "Generate PO", type: "action", icon: "📋" },
      { id: "n4", label: "Supplier + Team", type: "output", icon: "📤" },
    ],
    edges: [
      { from: "n1", to: "n2" },
      { from: "n2", to: "n3" },
      { from: "n3", to: "n4" },
    ],
    timeSavedPerRun: 40,
    estimatedSetupTime: 35,
    complexity: "advanced",
    tags: ["inventory", "procurement", "operations"],
    usedBy: 645,
  },
  {
    id: "tpl-007",
    name: "Meeting → Notes → CRM Update",
    description:
      "Record any meeting, transcribe with AI, extract action items and decisions, update the relevant CRM deal, and send summaries to participants.",
    category: "Sales",
    nodes: [
      { id: "n1", label: "Calendar Event", type: "trigger", icon: "📅" },
      { id: "n2", label: "AI Transcribe", type: "transform", icon: "🎤" },
      { id: "n3", label: "Extract Actions", type: "transform", icon: "📌" },
      { id: "n4", label: "CRM + Email", type: "output", icon: "💼" },
    ],
    edges: [
      { from: "n1", to: "n2" },
      { from: "n2", to: "n3" },
      { from: "n3", to: "n4" },
    ],
    timeSavedPerRun: 30,
    estimatedSetupTime: 20,
    complexity: "intermediate",
    tags: ["meetings", "ai", "crm"],
    usedBy: 2234,
  },
  {
    id: "tpl-008",
    name: "Customer Churn Risk → Retention Campaign",
    description:
      "Detect churn signals from product usage data, score risk with ML, trigger personalized retention sequences, and alert CSM team.",
    category: "Support",
    nodes: [
      { id: "n1", label: "Usage Events", type: "trigger", icon: "📊" },
      { id: "n2", label: "Churn Score", type: "transform", icon: "🔮" },
      { id: "n3", label: "Risk Level", type: "condition", icon: "⚡" },
      { id: "n4", label: "Retention Flow", type: "output", icon: "❤️" },
    ],
    edges: [
      { from: "n1", to: "n2" },
      { from: "n2", to: "n3" },
      { from: "n3", to: "n4" },
    ],
    timeSavedPerRun: 45,
    estimatedSetupTime: 45,
    complexity: "advanced",
    tags: ["retention", "ml", "churn"],
    usedBy: 987,
  },
];

// Generate chart data for the last 30 days
export function generateChartData(workflowId?: string) {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = daysAgo(i);
    const executions = Math.floor(Math.random() * 40) + 10;
    const successRate = 90 + Math.random() * 9;
    const timeSaved = executions * (15 + Math.random() * 20);
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      executions,
      successRate: Math.round(successRate * 10) / 10,
      timeSaved: Math.round(timeSaved),
      failed: Math.floor(executions * (1 - successRate / 100)),
    });
  }
  return data;
}

export function getGlobalMetrics() {
  const totalExecutionsToday = workflows.reduce((a, w) => a + w.runsToday, 0);
  const avgSuccessRate =
    workflows.reduce((a, w) => a + w.successRate, 0) / workflows.length;
  const totalTimeSavedToday = workflows.reduce(
    (a, w) => a + w.runsToday * w.timeSavedPerRun,
    0
  );
  const activeWorkflows = workflows.filter((w) => w.status === "active").length;

  return {
    totalExecutionsToday,
    avgSuccessRate: Math.round(avgSuccessRate * 10) / 10,
    totalTimeSavedToday,
    activeWorkflows,
    totalWorkflows: workflows.length,
  };
}
