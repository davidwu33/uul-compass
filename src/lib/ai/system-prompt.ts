export type PageContext = {
  route: string;
  entityType?:
    | "task"
    | "plan"
    | "risks"
    | "initiatives"
    | "decisions"
    | "dashboard"
    | "settings";
  entityId?: string;
  entityName?: string;
  formFields?: Array<{
    name: string;
    label: string;
    type: "text" | "textarea" | "select" | "number";
    value: string;
    options?: string[];
    placeholder?: string;
  }>;
  formSummary?: string;
};

export type CompassData = {
  tasks?: any[];
  workstreams?: any[];
  phases?: any[];
  risks?: any[];
  initiatives?: any[];
  gates?: any[];
  users?: any[];
  taskStats?: any;
  needsAttention?: any[];
  currentTask?: any;
  taskMeetings?: any[];
  taskActivities?: any[];
};

export function buildSystemPrompt(
  pageContext: PageContext,
  data: CompassData,
  userRole: string
): string {
  const isAdmin = ["owner", "board", "executive"].includes(userRole);
  const isContributor = [
    "department_head",
    "manager",
    "operator",
    "sales",
    "finance",
    "compliance",
  ].includes(userRole);

  const sections: string[] = [];

  // ── Persona ──────────────────────────────────────────────────────────────
  sections.push(`You are Compass AI, the embedded intelligence layer for UUL's Post-Merger Integration (PMI) program. You serve as a knowledgeable chief of staff with full awareness of the integration's tasks, risks, initiatives, decisions, and team.

Your role is to help the UUL team understand what's happening in the integration, surface insights, draft new items, and take actions when directed.`);

  // ── Access rules ──────────────────────────────────────────────────────────
  if (isAdmin) {
    sections.push(`Access level: ADMIN — you can read all data and propose any create/update actions.`);
  } else if (isContributor) {
    sections.push(`Access level: CONTRIBUTOR — you can read all data and propose creates/updates for items in your workstream.`);
  } else {
    sections.push(`Access level: VIEWER — read-only. Do not propose any create or update actions.`);
  }

  // ── Page context ──────────────────────────────────────────────────────────
  sections.push(`Current page: ${pageContext.route}${pageContext.entityType ? ` (${pageContext.entityType}${pageContext.entityId ? ` #${pageContext.entityId}` : ""})` : ""}`);

  // ── Entity data ───────────────────────────────────────────────────────────
  if (data.currentTask) {
    sections.push(`Current task in view:\n${JSON.stringify(data.currentTask).slice(0, 4000)}`);
  }
  if (data.taskMeetings?.length) {
    sections.push(`Task meeting history (${data.taskMeetings.length} meetings):\n${JSON.stringify(data.taskMeetings).slice(0, 2000)}`);
  }
  if (data.taskActivities?.length) {
    sections.push(`Task activity log:\n${JSON.stringify(data.taskActivities).slice(0, 1500)}`);
  }
  if (data.tasks?.length) {
    const slim = data.tasks.map((t: any) => ({
      id: t.id, code: t.code, title: t.title, status: t.status,
      workstream: t.workstream, assignee: t.assignee, priority: t.priority,
      dueDate: t.dueDate, progress: t.progress,
    }));
    sections.push(`All PMI tasks (${data.tasks.length} total):\n${JSON.stringify(slim).slice(0, 4000)}`);
  }
  if (data.workstreams?.length) {
    sections.push(`Workstreams:\n${JSON.stringify(data.workstreams).slice(0, 2000)}`);
  }
  if (data.risks?.length) {
    sections.push(`Risk register (${data.risks.length} risks):\n${JSON.stringify(data.risks).slice(0, 3000)}`);
  }
  if (data.initiatives?.length) {
    sections.push(`Value initiatives (${data.initiatives.length}):\n${JSON.stringify(data.initiatives).slice(0, 3000)}`);
  }
  if (data.gates?.length) {
    sections.push(`Decision gates:\n${JSON.stringify(data.gates).slice(0, 2000)}`);
  }
  if (data.taskStats) {
    sections.push(`Task stats: ${JSON.stringify(data.taskStats)}`);
  }
  if (data.needsAttention?.length) {
    sections.push(`Needs attention (blocked/overdue): ${JSON.stringify(data.needsAttention).slice(0, 2000)}`);
  }
  if (data.users?.length) {
    sections.push(`Team members: ${JSON.stringify(data.users.map((u) => ({ name: u.name, role: u.role, workstream: u.workstream })))}`);
  }

  // ── Form fields ───────────────────────────────────────────────────────────
  if (pageContext.formFields?.length) {
    sections.push(
      `The user is currently editing a form on this page${pageContext.formSummary ? `: ${pageContext.formSummary}` : ""}.\n` +
        `Form fields:\n${JSON.stringify(pageContext.formFields, null, 2)}\n\n` +
        `You may suggest values for these fields using the json-proposal format:\n` +
        "```json-proposal\n" +
        `{"field":"<name>","value":"<suggested value>","reasoning":"<why>"}\n` +
        "```"
    );
  }

  // ── Tool rules ────────────────────────────────────────────────────────────
  sections.push(`Tool usage rules:
- Read tools (get_*): Use freely to answer questions.
- Write tools (create_*, update_*): Always present as a draft for the user to approve before executing. Never silently mutate data.
- When proposing new items from a meeting transcript, use the create_draft_record tool to stage them for review.`);

  // ── Response style ────────────────────────────────────────────────────────
  sections.push(`Response style:
- Be concise and direct. Use bullet points for lists.
- When referencing tasks, use their code (e.g. F3, O7, T2).
- Dates: use YYYY-MM-DD format.
- Never fabricate data — only reference what is in the provided context.
- If asked about something not in the context, say so clearly.`);

  return sections.join("\n\n---\n\n");
}
