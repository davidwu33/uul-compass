import {
  getTasks,
  getTaskById,
  getWorkstreams,
  getRisks,
  getValueInitiatives,
  getGates,
  getUsers,
  getTaskStats,
  getNeedsAttention,
  getTaskMeetings,
  getTaskActivities,
  getMeetings,
} from "@/lib/data";
import { ADMIN_ROLES, CONTRIBUTOR_ROLES, TIER1_TOOLS, TIER2_TOOLS } from "./tools";

export type StagedAction = {
  kind: "confirm" | "draft";
  entityType: string;
  description: string;
  payload: Record<string, any>;
};

export type ToolCallResult = {
  /** Returned to Claude as the tool result */
  content: string;
  /** Present only for write tools — triggers a confirm/draft card in the UI */
  staged?: StagedAction;
};

type ToolContext = {
  userRole: string;
  userId: string;
};

function canWrite(role: string): boolean {
  return ADMIN_ROLES.has(role) || CONTRIBUTOR_ROLES.has(role);
}

function permissionDenied(role: string): ToolCallResult {
  return {
    content: `Permission denied: your role (${role}) is read-only. Contact an admin to make changes.`,
  };
}

export async function handleToolCall(
  name: string,
  input: Record<string, any>,
  ctx: ToolContext
): Promise<ToolCallResult> {
  try {
    // ── Read tools ───────────────────────────────────────────────────────
    switch (name) {
      case "get_tasks": {
        const tasks = await getTasks();
        if (input.filter && input.filter !== "all") {
          const now = new Date();
          const filtered = tasks.filter((t) => {
            if (input.filter === "blocked") return t.status === "blocked";
            if (input.filter === "in_progress") return t.status === "in_progress";
            if (input.filter === "done") return t.status === "done";
            if (input.filter === "overdue")
              return t.dueDate && new Date(t.dueDate) < now && t.status !== "done";
            return true;
          });
          return { content: JSON.stringify(filtered) };
        }
        return { content: JSON.stringify(tasks) };
      }

      case "get_task_by_id": {
        const task = await getTaskById(input.id);
        if (!task) return { content: JSON.stringify({ error: `Task ${input.id} not found` }) };
        const [meetings, activities] = await Promise.all([
          getTaskMeetings(task.id),
          getTaskActivities(task.id),
        ]);
        return { content: JSON.stringify({ ...task, meetings, activities }) };
      }

      case "get_workstreams":
        return { content: JSON.stringify(await getWorkstreams()) };

      case "get_risks":
        return { content: JSON.stringify(await getRisks()) };

      case "get_initiatives":
        return { content: JSON.stringify(await getValueInitiatives()) };

      case "get_gates":
        return { content: JSON.stringify(await getGates()) };

      case "get_users":
        return { content: JSON.stringify(await getUsers()) };

      case "get_task_stats":
        return { content: JSON.stringify(await getTaskStats()) };

      case "get_needs_attention":
        return { content: JSON.stringify(await getNeedsAttention()) };

      case "get_meetings":
        return { content: JSON.stringify(await getMeetings()) };
    }

    // ── Write tools — permission gate ────────────────────────────────────
    if (TIER1_TOOLS.has(name) || TIER2_TOOLS.has(name)) {
      if (!canWrite(ctx.userRole)) return permissionDenied(ctx.userRole);
    }

    // ── Tier 1: confirm cards ────────────────────────────────────────────
    switch (name) {
      case "update_task_status": {
        const tasks = await getTasks();
        const task = tasks.find(
          (t) =>
            t.taskCode?.toLowerCase() === input.taskId?.toLowerCase() ||
            t.id === input.taskId
        );
        if (!task) return { content: `Task "${input.taskId}" not found.` };

        return {
          content: `Staged status update for ${task.taskCode ?? task.title}: → ${input.status}. Waiting for user confirmation.`,
          staged: {
            kind: "confirm",
            entityType: "task",
            description: `Update **${task.taskCode ?? task.title}**: status → **${input.status}**${input.notes ? ` · ${input.notes}` : ""}`,
            payload: {
              action: "update_task_status",
              taskId: task.id,
              taskCode: task.taskCode,
              taskTitle: task.title,
              updates: { status: input.status, ...(input.notes ? { notes: input.notes } : {}) },
            },
          },
        };
      }

      case "update_task_progress": {
        const tasks = await getTasks();
        const task = tasks.find(
          (t) =>
            t.taskCode?.toLowerCase() === input.taskId?.toLowerCase() ||
            t.id === input.taskId
        );
        if (!task) return { content: `Task "${input.taskId}" not found.` };
        const pct = Math.min(100, Math.max(0, Math.round(input.progress)));

        return {
          content: `Staged progress update for ${task.taskCode ?? task.title}: → ${pct}%. Waiting for user confirmation.`,
          staged: {
            kind: "confirm",
            entityType: "task",
            description: `Update **${task.taskCode ?? task.title}**: progress → **${pct}%**`,
            payload: {
              action: "update_task_progress",
              taskId: task.id,
              taskCode: task.taskCode,
              taskTitle: task.title,
              updates: { progress: pct },
            },
          },
        };
      }

      case "update_risk_status": {
        const risks = await getRisks();
        const risk = risks.find((r) => r.id === input.riskId);
        if (!risk) return { content: `Risk "${input.riskId}" not found.` };

        const changes: string[] = [];
        const updates: Record<string, any> = {};
        if (input.status) { updates.status = input.status; changes.push(`status → **${input.status}**`); }
        if (input.severity) { updates.severity = input.severity; changes.push(`severity → **${input.severity}**`); }
        if (input.notes) { updates.notes = input.notes; }

        return {
          content: `Staged update for risk "${risk.title}". Waiting for user confirmation.`,
          staged: {
            kind: "confirm",
            entityType: "risk",
            description: `Update risk **"${risk.title}"**: ${changes.join(", ")}`,
            payload: {
              action: "update_risk",
              riskId: risk.id,
              riskTitle: risk.title,
              updates,
            },
          },
        };
      }

      case "create_comment": {
        return {
          content: `Staged comment on ${input.targetType} ${input.targetId}. Waiting for user confirmation.`,
          staged: {
            kind: "confirm",
            entityType: "comment",
            description: `Add comment to **${input.targetType}**: "${input.body.slice(0, 80)}${input.body.length > 80 ? "…" : ""}"`,
            payload: {
              action: "create_comment",
              targetType: input.targetType,
              targetId: input.targetId,
              body: input.body,
            },
          },
        };
      }
    }

    // ── Tier 2: draft cards ──────────────────────────────────────────────
    switch (name) {
      case "create_task": {
        const fields: string[] = [`"${input.title}"`];
        if (input.workstream) fields.push(input.workstream);
        if (input.priority) fields.push(input.priority);
        if (input.assignee) fields.push(`→ ${input.assignee}`);

        return {
          content: `Staged new task for review: ${fields.join(" · ")}. Waiting for user approval.`,
          staged: {
            kind: "draft",
            entityType: "task",
            description: fields.join(" · "),
            payload: {
              action: "create_task",
              title: input.title,
              workstream: input.workstream,
              assignee: input.assignee,
              priority: input.priority ?? "medium",
              phase: input.phase ?? 1,
              dueDate: input.dueDate,
              description: input.description,
            },
          },
        };
      }

      case "create_risk": {
        return {
          content: `Staged new risk for review: "${input.title}" (${input.severity}). Waiting for user approval.`,
          staged: {
            kind: "draft",
            entityType: "risk",
            description: `"${input.title}" · ${input.severity} severity${input.workstream ? ` · ${input.workstream}` : ""}`,
            payload: {
              action: "create_risk",
              title: input.title,
              severity: input.severity,
              workstream: input.workstream,
              owner: input.owner,
              description: input.description,
              mitigationPlan: input.mitigationPlan,
            },
          },
        };
      }

      case "create_initiative": {
        return {
          content: `Staged new initiative for review: "${input.name}" (${input.category}). Waiting for user approval.`,
          staged: {
            kind: "draft",
            entityType: "initiative",
            description: `"${input.name}" · ${input.category.replace(/_/g, " ")}${input.plannedImpactUsd ? ` · $${input.plannedImpactUsd.toLocaleString()}` : ""}`,
            payload: {
              action: "create_initiative",
              name: input.name,
              category: input.category,
              workstream: input.workstream,
              owner: input.owner,
              plannedImpactCents: input.plannedImpactUsd ? Math.round(input.plannedImpactUsd * 100) : 0,
              description: input.description,
            },
          },
        };
      }
    }

    return { content: JSON.stringify({ error: `Unknown tool: ${name}` }) };
  } catch (err) {
    return { content: JSON.stringify({ error: (err as Error).message }) };
  }
}
