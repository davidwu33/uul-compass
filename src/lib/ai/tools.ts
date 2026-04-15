import type Anthropic from "@anthropic-ai/sdk";

const WRITE_TOOL_DESCRIPTION = {
  update_task_status: "Update a task's status. Emits an inline confirmation card — user must confirm before the DB is written.",
  update_task_progress: "Update a task's progress percentage (0–100). Emits a confirmation card.",
  update_risk_status: "Update a risk's status or severity. Emits a confirmation card.",
  create_task: "Stage a new PMI task for user review. Emits a draft card — user can accept, edit, or dismiss before saving.",
  create_risk: "Stage a new risk entry for user review. Emits a draft card.",
  create_initiative: "Stage a new value initiative for user review. Emits a draft card.",
  create_comment: "Add a comment to a task, risk, or initiative. Emits a confirmation card.",
};

/**
 * Stage 1 — Read-only tools
 * Stage 2 — Write tools added below (Tier 1: confirm cards, Tier 2: draft cards)
 */
export const compassTools: Anthropic.Tool[] = [
  // ── Read tools ─────────────────────────────────────────────────────────
  {
    name: "get_tasks",
    description: "Get all PMI tasks with status, workstream, assignee, priority, and progress.",
    input_schema: {
      type: "object" as const,
      properties: {
        filter: {
          type: "string",
          enum: ["all", "blocked", "overdue", "in_progress", "done"],
        },
      },
      required: [],
    },
  },
  {
    name: "get_task_by_id",
    description: "Get full details for a single task by its code (e.g. F3) or UUID.",
    input_schema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Task code (e.g. F3) or UUID" },
      },
      required: ["id"],
    },
  },
  {
    name: "get_workstreams",
    description: "Get all workstreams with progress and task counts.",
    input_schema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "get_risks",
    description: "Get the full risk register.",
    input_schema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "get_initiatives",
    description: "Get all value initiatives with planned and captured impact.",
    input_schema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "get_gates",
    description: "Get all decision gates with criteria, status, and target dates.",
    input_schema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "get_users",
    description: "Get all active team members and their roles.",
    input_schema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "get_task_stats",
    description: "Get aggregate task statistics: total, done, active, blocked, overdue.",
    input_schema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "get_needs_attention",
    description: "Get tasks that are blocked or overdue.",
    input_schema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "get_meetings",
    description: "Get all recorded meeting notes with decisions and linked tasks.",
    input_schema: { type: "object" as const, properties: {}, required: [] },
  },

  // ── Tier 1 write tools (emit confirm card) ──────────────────────────────
  {
    name: "update_task_status",
    description: WRITE_TOOL_DESCRIPTION.update_task_status,
    input_schema: {
      type: "object" as const,
      properties: {
        taskId: { type: "string", description: "Task code (e.g. F3) or UUID" },
        status: {
          type: "string",
          enum: ["todo", "in_progress", "blocked", "review", "done"],
        },
        notes: { type: "string", description: "Optional context note about the change" },
      },
      required: ["taskId", "status"],
    },
  },
  {
    name: "update_task_progress",
    description: WRITE_TOOL_DESCRIPTION.update_task_progress,
    input_schema: {
      type: "object" as const,
      properties: {
        taskId: { type: "string", description: "Task code (e.g. F3) or UUID" },
        progress: { type: "number", description: "Progress percentage 0–100" },
      },
      required: ["taskId", "progress"],
    },
  },
  {
    name: "update_risk_status",
    description: WRITE_TOOL_DESCRIPTION.update_risk_status,
    input_schema: {
      type: "object" as const,
      properties: {
        riskId: { type: "string", description: "Risk UUID" },
        status: { type: "string", enum: ["open", "mitigating", "resolved"] },
        severity: { type: "string", enum: ["high", "medium", "low"] },
        notes: { type: "string" },
      },
      required: ["riskId"],
    },
  },
  {
    name: "create_comment",
    description: WRITE_TOOL_DESCRIPTION.create_comment,
    input_schema: {
      type: "object" as const,
      properties: {
        targetType: { type: "string", enum: ["task", "risk", "initiative"] },
        targetId: { type: "string", description: "UUID of the target entity" },
        body: { type: "string", description: "Comment text" },
      },
      required: ["targetType", "targetId", "body"],
    },
  },

  // ── Tier 2 write tools (emit draft card) ────────────────────────────────
  {
    name: "create_task",
    description: WRITE_TOOL_DESCRIPTION.create_task,
    input_schema: {
      type: "object" as const,
      properties: {
        title: { type: "string" },
        workstream: { type: "string", description: "Workstream name (e.g. Finance, Technology, Operations)" },
        assignee: { type: "string", description: "Assignee full name" },
        priority: { type: "string", enum: ["critical", "high", "medium", "low"] },
        phase: { type: "number", enum: [1, 2, 3] },
        dueDate: { type: "string", description: "YYYY-MM-DD" },
        description: { type: "string" },
      },
      required: ["title", "workstream"],
    },
  },
  {
    name: "create_risk",
    description: WRITE_TOOL_DESCRIPTION.create_risk,
    input_schema: {
      type: "object" as const,
      properties: {
        title: { type: "string" },
        severity: { type: "string", enum: ["high", "medium", "low"] },
        workstream: { type: "string" },
        owner: { type: "string", description: "Owner full name" },
        description: { type: "string" },
        mitigationPlan: { type: "string" },
      },
      required: ["title", "severity"],
    },
  },
  {
    name: "create_initiative",
    description: WRITE_TOOL_DESCRIPTION.create_initiative,
    input_schema: {
      type: "object" as const,
      properties: {
        name: { type: "string" },
        category: { type: "string", enum: ["cost_savings", "revenue_growth", "cash_flow"] },
        workstream: { type: "string" },
        owner: { type: "string" },
        plannedImpactUsd: { type: "number", description: "Planned impact in USD" },
        description: { type: "string" },
      },
      required: ["name", "category"],
    },
  },
];

export const TIER1_TOOLS = new Set([
  "update_task_status",
  "update_task_progress",
  "update_risk_status",
  "create_comment",
]);

export const TIER2_TOOLS = new Set([
  "create_task",
  "create_risk",
  "create_initiative",
]);

export const WRITE_TOOLS = new Set([...TIER1_TOOLS, ...TIER2_TOOLS]);

export const ADMIN_ROLES = new Set(["owner", "board", "executive"]);
export const CONTRIBUTOR_ROLES = new Set([
  "department_head", "manager", "operator", "sales", "finance", "compliance",
]);

export type ChatMode = "create_task" | "log_risk" | "analyze_meeting" | "status" | null;

const MODE_TOOLS: Record<NonNullable<ChatMode>, string[]> = {
  create_task:      ["get_workstreams", "get_users", "create_task"],
  log_risk:         ["get_risks", "get_workstreams", "get_users", "create_risk"],
  analyze_meeting:  ["get_tasks", "get_workstreams", "get_users", "get_risks", "create_task", "create_risk", "create_initiative"],
  status:           ["get_tasks", "get_task_stats", "get_needs_attention", "get_workstreams", "get_risks", "get_gates"],
};

export function getToolsForMode(mode: ChatMode): Anthropic.Tool[] {
  if (!mode) return compassTools;
  const allowed = new Set(MODE_TOOLS[mode]);
  return compassTools.filter((t) => allowed.has(t.name));
}
