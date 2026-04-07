/**
 * Seed script — inserts all demo data into the Supabase DB.
 * Run with: npx tsx scripts/seed.ts
 *
 * Safe to re-run: clears all PMI/org tables first, then re-inserts.
 * Insertion order matters due to FK constraints.
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../src/db/schema";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DIRECT_URL ?? process.env.DATABASE_URL!, {
  prepare: false,
});
const db = drizzle(client, { schema });

// ─── Date helpers ───────────────────────────────────────────────
const MONTHS: Record<string, string> = {
  Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
  Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
};

/** Convert "Apr 7" → "2026-04-07" */
function toIso(dateStr: string | undefined): string | undefined {
  if (!dateStr) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const [mon, day] = dateStr.split(" ");
  if (!MONTHS[mon]) return undefined;
  return `2026-${MONTHS[mon]}-${day.padStart(2, "0")}`;
}

// ─── Clear existing data (reverse FK order) ─────────────────────
async function clearAll() {
  console.log("🗑  Clearing existing data...");
  await db.delete(schema.valueSnapshots);
  await db.delete(schema.valueInitiatives);
  await db.delete(schema.risks);
  await db.delete(schema.actionItems);
  await db.delete(schema.meetingAttendees);
  await db.delete(schema.meetingNotes);
  await db.delete(schema.pmiTasks);
  await db.delete(schema.pmiDecisionGates);
  await db.delete(schema.pmiMilestones);
  await db.delete(schema.pmiPhases);
  await db.delete(schema.pmiWorkstreams);
  await db.delete(schema.pmiConfig);
  await db.delete(schema.userEntityAccess);
  await db.delete(schema.users);
  await db.delete(schema.entities);
}

// ─── 1. Entities ────────────────────────────────────────────────
async function seedEntities() {
  console.log("🏢  Seeding entities...");
  const rows = await db.insert(schema.entities).values([
    { code: "UUL",  name: "UUL Global",          nameZh: null, legalName: "UUL Global LLC",           country: "US", currency: "USD", isActive: true },
    { code: "MH",   name: "US United Logistics",  nameZh: "美航",legalName: "US United Logistics Inc.", country: "CN", currency: "CNY", isActive: true },
    { code: "XH",   name: "Star Navigation",       nameZh: "星航",legalName: "Star Navigation Co.",      country: "CN", currency: "CNY", isActive: true },
    { code: "SAGE", name: "Sageline",              nameZh: null, legalName: "Sageline Ltd.",             country: "CN", currency: "CNY", isActive: true },
  ]).returning();

  const entityMap: Record<string, string> = {};
  rows.forEach((e) => { entityMap[e.code] = e.id; });
  return entityMap;
}

// ─── 2. Users ───────────────────────────────────────────────────
async function seedUsers(entityMap: Record<string, string>) {
  console.log("👥  Seeding users...");
  const uulId = entityMap["UUL"];
  const mhId  = entityMap["MH"];

  const rows = await db.insert(schema.users).values([
    { entityId: uulId, email: "jerry.shi@uulglobal.com",    fullName: "Jerry Shi",     fullNameZh: "施童洲", title: "PE Owner & Board Member",   role: "owner",     location: "Toronto / Asia", isActive: true },
    { entityId: mhId,  email: "alic.ge@uulglobal.com",      fullName: "Alic Ge",       fullNameZh: "葛成",   title: "Chairman of the Board",     role: "board",     location: "Ningbo",         isActive: true },
    { entityId: uulId, email: "billy.cheng@uulglobal.com",  fullName: "Billy Cheng",   fullNameZh: null,     title: "HK CEO & Board Member",     role: "board",     location: "Hong Kong",      isActive: true },
    { entityId: uulId, email: "season.yu@uulglobal.com",    fullName: "Season Yu",     fullNameZh: null,     title: "PE Partner, Finance Advisor",role: "advisor",   location: "Shanghai",       isActive: true },
    { entityId: uulId, email: "jason.likens@uulglobal.com", fullName: "Jason Likens",  fullNameZh: null,     title: "CEO, US Operations",        role: "executive", location: "US",             isActive: true },
    { entityId: uulId, email: "josh.foster@uulglobal.com",  fullName: "Josh Foster",   fullNameZh: null,     title: "COO, US Operations",        role: "executive", location: "US",             isActive: true },
    { entityId: uulId, email: "serena.lin@uulglobal.com",   fullName: "Serena Lin",    fullNameZh: "林静",   title: "CFO",                       role: "executive", location: null,             isActive: true },
    { entityId: uulId, email: "david.wu@uulglobal.com",     fullName: "David Wu",      fullNameZh: null,     title: "Engineer",                  role: "operator",  location: "North America",  isActive: true },
    // External contractor — not in settings page but used in task data
    { entityId: uulId, email: "ben.fogarty@external.com",   fullName: "Ben Fogarty",   fullNameZh: null,     title: "Marketing Contractor",      role: "viewer",    location: null,             isActive: true },
    // Operations — referenced in task data
    { entityId: mhId,  email: "marco@uulglobal.com",        fullName: "Marco",         fullNameZh: null,     title: "Operations Manager",        role: "operator",  location: "CN",             isActive: true },
  ]).returning();

  const userMap: Record<string, string> = {};
  rows.forEach((u) => { userMap[u.fullName] = u.id; });
  return userMap;
}

// ─── 3. PMI Config ──────────────────────────────────────────────
async function seedPmiConfig() {
  console.log("⚙️   Seeding PMI config...");
  await db.insert(schema.pmiConfig).values({
    id: "default",
    startDate: "2026-04-01",
    totalDays: 100,
    projectName: "UUL Post-Merger Integration",
  });
}

// ─── 4. Workstreams ─────────────────────────────────────────────
async function seedWorkstreams(userMap: Record<string, string>) {
  console.log("🔀  Seeding workstreams...");
  const rows = await db.insert(schema.pmiWorkstreams).values([
    { name: "Finance",          color: "#ef4444", ownerId: userMap["Serena Lin"],   targetCompletion: 5,  sortOrder: 1, status: "in_progress" },
    { name: "Operations",       color: "#f97316", ownerId: userMap["Alic Ge"],      targetCompletion: 5,  sortOrder: 2, status: "in_progress" },
    { name: "Sales",            color: "#3b82f6", ownerId: userMap["Jason Likens"], targetCompletion: 3,  sortOrder: 3, status: "in_progress" },
    { name: "Brand & Marketing",color: "#8b5cf6", ownerId: userMap["Jerry Shi"],    targetCompletion: 15, sortOrder: 4, status: "in_progress" },
    { name: "Technology & AI",  color: "#06b6d4", ownerId: userMap["David Wu"],     targetCompletion: 5,  sortOrder: 5, status: "in_progress" },
    { name: "Organization & HR",color: "#22c55e", ownerId: userMap["Jerry Shi"],    targetCompletion: 10, sortOrder: 6, status: "in_progress" },
  ]).returning();

  const wsMap: Record<string, string> = {};
  rows.forEach((w) => { wsMap[w.name] = w.id; });
  return wsMap;
}

// ─── 5. Phases ──────────────────────────────────────────────────
async function seedPhases() {
  console.log("📅  Seeding phases...");
  const rows = await db.insert(schema.pmiPhases).values([
    { phaseNumber: 1, name: "Stabilize & Signal",  description: "Business continuity, establish control, protect revenue",              startDay: 1,  endDay: 30,  startDate: "2026-04-01", endDate: "2026-04-30", status: "active" },
    { phaseNumber: 2, name: "Align & Pilot",        description: "Harmonize workflows, launch AI pilots, standardize SOPs",              startDay: 31, endDay: 60,  startDate: "2026-05-01", endDate: "2026-05-30", status: "not_started" },
    { phaseNumber: 3, name: "Commit & Execute",     description: "Institutionalize changes, recognize value gains, growth posture",      startDay: 61, endDay: 100, startDate: "2026-06-01", endDate: "2026-07-10", status: "not_started" },
  ]).returning();

  const phaseMap: Record<number, string> = {};
  rows.forEach((p) => { phaseMap[p.phaseNumber] = p.id; });
  return phaseMap;
}

// ─── 6. Decision Gates ──────────────────────────────────────────
async function seedGates(phaseMap: Record<number, string>) {
  console.log("🚦  Seeding decision gates...");
  await db.insert(schema.pmiDecisionGates).values([
    { phaseId: phaseMap[1], name: "Compass Go-Live",        targetDay: 14,  targetDate: "2026-04-14", ownerLabel: "Jerry + David Wu", status: "upcoming", criteria: ["Compass deployed to Vercel","Board members can access on mobile","Demo data populated"] },
    { phaseId: phaseMap[1], name: "Phase 1 Review",         targetDay: 30,  targetDate: "2026-04-30", ownerLabel: "Jerry (Board)",    status: "upcoming", criteria: ["Flash reporting operational","Workflow map complete","Talent assessment done","Top 20 customers contacted"] },
    { phaseId: phaseMap[2], name: "SOP Deployment Check",   targetDay: 45,  targetDate: "2026-05-15", ownerLabel: "Jerry + Jason",    status: "upcoming", criteria: ["All offices on unified workflows","Cross-office standups running","Pricing corrections executed"] },
    { phaseId: phaseMap[2], name: "Phase 2 Review",         targetDay: 60,  targetDate: "2026-05-30", ownerLabel: "Jerry (Board)",    status: "upcoming", criteria: ["Pallet AI live","AI pilots running","Profit improvement bridge tracking","Talent map finalized"] },
    { phaseId: phaseMap[3], name: "Compass Phase 3 Check",  targetDay: 75,  targetDate: "2026-06-15", ownerLabel: "Jerry + David Wu", status: "upcoming", criteria: ["Shipment + Finance modules live","SOP adoption measured"] },
    { phaseId: phaseMap[3], name: "Phase 3 Review",         targetDay: 90,  targetDate: "2026-06-30", ownerLabel: "Jerry (Board)",    status: "upcoming", criteria: ["First quarterly board package delivered","Value gains vs plan measured","Pricing impact quantified"] },
    { phaseId: phaseMap[3], name: "100-Day Scorecard",      targetDay: 100, targetDate: "2026-07-10", ownerLabel: "Jerry (Board)",    status: "upcoming", criteria: ["All scorecard targets assessed","AIOS roadmap finalized","Transition to Year 1 plan"] },
  ]);
}

// ─── 7. Milestones ──────────────────────────────────────────────
async function seedMilestones(wsMap: Record<string, string>) {
  console.log("🏁  Seeding milestones...");
  const rows = await db.insert(schema.pmiMilestones).values([
    // Phase 1
    { workstreamId: wsMap["Finance"],           code: "F-M1", phase: 1, name: "Weekly flash report operational",            targetDate: "2026-04-14", status: "not_started", sortOrder: 1 },
    { workstreamId: wsMap["Finance"],           code: "F-M2", phase: 1, name: "Unified chart of accounts mapped",           targetDate: "2026-04-30", status: "not_started", sortOrder: 2 },
    { workstreamId: wsMap["Operations"],        code: "O-M1", phase: 1, name: "Full workflow map completed",                targetDate: "2026-04-15", status: "not_started", sortOrder: 1 },
    { workstreamId: wsMap["Operations"],        code: "O-M2", phase: 1, name: "Top 20 customer outreach completed",         targetDate: "2026-04-30", status: "not_started", sortOrder: 2 },
    { workstreamId: wsMap["Sales"],             code: "S-M1", phase: 1, name: "Pricing audit complete",                    targetDate: "2026-04-30", status: "not_started", sortOrder: 1 },
    { workstreamId: wsMap["Brand & Marketing"], code: "M-M1", phase: 1, name: "Corporate deck v1 delivered",               targetDate: "2026-04-10", status: "in_progress", sortOrder: 1 },
    { workstreamId: wsMap["Technology & AI"],   code: "T-M1", phase: 1, name: "Compass live with real data",               targetDate: "2026-04-21", status: "not_started", sortOrder: 1 },
    { workstreamId: wsMap["Technology & AI"],   code: "T-M2", phase: 1, name: "Pallet pricing pilot complete",             targetDate: "2026-04-14", status: "in_progress", sortOrder: 2 },
    { workstreamId: wsMap["Organization & HR"], code: "H-M1", phase: 1, name: "Talent assessment complete",                targetDate: "2026-04-30", status: "not_started", sortOrder: 1 },
    // Phase 2
    { workstreamId: wsMap["Finance"],           code: "F-M3", phase: 2, name: "Profit improvement bridge operational",     targetDate: "2026-05-15", status: "not_started", sortOrder: 3 },
    { workstreamId: wsMap["Finance"],           code: "F-M4", phase: 2, name: "Back-office AI pilot live",                 targetDate: "2026-05-30", status: "not_started", sortOrder: 4 },
    { workstreamId: wsMap["Operations"],        code: "O-M3", phase: 2, name: "Unified SOPs deployed across all offices",  targetDate: "2026-05-15", status: "not_started", sortOrder: 3 },
    { workstreamId: wsMap["Operations"],        code: "O-M4", phase: 2, name: "Cross-office standups running",             targetDate: "2026-05-07", status: "not_started", sortOrder: 4 },
    { workstreamId: wsMap["Sales"],             code: "S-M2", phase: 2, name: "Pricing corrections executed",             targetDate: "2026-05-15", status: "not_started", sortOrder: 2 },
    { workstreamId: wsMap["Technology & AI"],   code: "T-M3", phase: 2, name: "Compass Phase 2 live",                     targetDate: "2026-05-15", status: "not_started", sortOrder: 3 },
    { workstreamId: wsMap["Technology & AI"],   code: "T-M4", phase: 2, name: "Pallet AI fully operational",              targetDate: "2026-05-30", status: "not_started", sortOrder: 4 },
    { workstreamId: wsMap["Organization & HR"], code: "H-M2", phase: 2, name: "Talent map finalized",                     targetDate: "2026-05-15", status: "not_started", sortOrder: 2 },
    // Phase 3
    { workstreamId: wsMap["Finance"],           code: "F-M5", phase: 3, name: "First quarterly board package delivered",   targetDate: "2026-06-30", status: "not_started", sortOrder: 5 },
  ]).returning();

  // code → UUID map for task linking
  const msMap: Record<string, string> = {};
  rows.forEach((m) => { if (m.code) msMap[m.code] = m.id; });
  return msMap;
}

// ─── 8. Tasks ───────────────────────────────────────────────────
async function seedTasks(
  wsMap: Record<string, string>,
  msMap: Record<string, string>,
  userMap: Record<string, string>,
) {
  console.log("✅  Seeding tasks...");

  // Demo milestone IDs (short codes like "f-m1") → DB milestone codes ("F-M1")
  const demoToCode: Record<string, string> = {
    "f-m1": "F-M1", "f-m2": "F-M2",
    "o-m1": "O-M1", "o-m2": "O-M2",
    "s-m1": "S-M1",
    "m-m1": "M-M1",
    "t-m1": "T-M1", "t-m2": "T-M2",
    "h-m1": "H-M1",
  };

  type RawTask = {
    id: string; taskCode: string; milestoneId?: string; phase: 1|2|3;
    isCrossOffice?: boolean; title: string; status: string; priority: string;
    assignee?: { name: string }; dueDate?: string; workstream: string;
  };

  const raw: RawTask[] = (await import("../src/lib/data/demo/tasks.js")).demoTasks;

  const values = raw.map((t) => ({
    taskCode:     t.taskCode,
    phase:        t.phase,
    isCrossOffice: t.isCrossOffice ?? false,
    workstreamId: wsMap[t.workstream],
    milestoneId:  t.milestoneId ? msMap[demoToCode[t.milestoneId]] : null,
    title:        t.title,
    assigneeId:   t.assignee ? (userMap[t.assignee.name] ?? null) : null,
    status:       t.status as any,
    priority:     t.priority as any,
    dueDate:      toIso(t.dueDate) ?? null,
    sortOrder:    0,
  }));

  await db.insert(schema.pmiTasks).values(values);
  console.log(`   inserted ${values.length} tasks`);
}

// ─── 9. Risks ───────────────────────────────────────────────────
async function seedRisks(
  wsMap: Record<string, string>,
  userMap: Record<string, string>,
) {
  console.log("⚠️   Seeding risks...");
  const { demoRisks } = await import("../src/lib/data/demo/risks.js");

  await db.insert(schema.risks).values(
    demoRisks.map((r) => ({
      title:           r.title,
      description:     r.description,
      severity:        r.severity as any,
      status:          r.status as any,
      mitigationPlan:  r.mitigationPlan,
      ownerId:         userMap[r.owner.name] ?? null,
      workstreamId:    r.workstream ? (wsMap[r.workstream] ?? null) : null,
      linkedTaskCodes: r.linkedTaskCodes,
      targetDate:      toIso(r.targetDate) ?? null,
    }))
  );
}

// ─── 10. Value Initiatives ──────────────────────────────────────
async function seedValueInitiatives(
  wsMap: Record<string, string>,
  userMap: Record<string, string>,
) {
  console.log("💰  Seeding value initiatives...");
  const { demoValueInitiatives } = await import("../src/lib/data/demo/value-gains.js");

  const rows = await db.insert(schema.valueInitiatives).values(
    demoValueInitiatives.map((v) => ({
      name:                v.name,
      category:            v.category as any,
      description:         v.description,
      targetDescription:   v.targetDescription,
      plannedImpactCents:  Math.round(v.plannedImpact * 100),
      capturedImpactCents: Math.round(v.capturedImpact * 100),
      status:              v.status as any,
      ownerId:             userMap[v.owner.name] ?? null,
      workstreamId:        v.workstream ? (wsMap[v.workstream] ?? null) : null,
    }))
  ).returning();

  return rows.map((r) => r.id);
}

// ─── 11. Value Snapshots ────────────────────────────────────────
async function seedValueSnapshots(initiativeIds: string[]) {
  console.log("📊  Seeding value snapshots...");
  const { demoValueSnapshots } = await import("../src/lib/data/demo/value-gains.js");

  // Snapshots are project-level projections, attach to first initiative as anchor
  const anchorId = initiativeIds[0];
  await db.insert(schema.valueSnapshots).values(
    demoValueSnapshots.map((s) => ({
      initiativeId:     anchorId,
      snapshotDate:     `2026-${MONTHS[s.month.split(" ")[0]]}-01`,
      runRateCents:     Math.round(s.planned * 100),
      cumulativeCents:  Math.round(s.captured * 100),
      notes:            s.month,
    }))
  );
}

// ─── 12. Meeting Notes + Attendees ──────────────────────────────
async function seedMeetings(userMap: Record<string, string>) {
  console.log("📝  Seeding meeting notes...");

  const nameToUser: Record<string, string | undefined> = {
    "Jerry":  userMap["Jerry Shi"],
    "Alic":   userMap["Alic Ge"],
    "Billy":  userMap["Billy Cheng"],
    "Season": userMap["Season Yu"],
    "Jason":  userMap["Jason Likens"],
    "Josh":   userMap["Josh Foster"],
  };

  const meetings = [
    {
      title: "Strategy Call",          meetingDate: "2026-03-31", meetingType: "strategy",
      attendees: ["Jerry","Alic","Billy","Season"],
      decisions: [
        "Exploring logistics stablecoin for on-chain factoring",
        "LC Warehouse + Packsmith WMS integration approved",
        "Ben Fogarty hired for corporate deck rewrite ($4K)",
      ],
    },
    {
      title: "Board Decision",         meetingDate: "2026-03-26", meetingType: "board",
      attendees: ["Jerry","Alic","Billy","Season"],
      decisions: [
        "Shenzhen warehouse expansion approved",
        "Hiring 3 operations managers in Q2",
      ],
    },
    {
      title: "Operations & Cash Flow Review", meetingDate: "2026-03-25", meetingType: "board",
      attendees: ["Jerry","Alic","Billy","Season","Jason","Josh"],
      decisions: [
        "VP Finance hire approved at RMB 250-300K/year",
        "$20K marketing budget approved",
        "Bridge financing: Jerry to provide $300K if needed Apr-May",
        "Supply chain finance partnerships: Standard Chartered + Klear",
      ],
    },
    {
      title: "Board Sync",             meetingDate: "2026-03-23", meetingType: "board",
      attendees: ["Jerry","Alic","Billy"],
      decisions: [
        "New sales rule: collect payment before shipping for all new contracts",
        "Silfab Plan A: demand 30% prepayment before port arrival",
        "Board structure: Jerry (Chair), Alic, Billy, Season",
        "Jason Likens appointed CEO US, Josh Foster appointed COO US",
        "Three business pillars confirmed: Logistics, SCF, Compliance & Sourcing",
      ],
    },
  ];

  for (const m of meetings) {
    const [note] = await db.insert(schema.meetingNotes).values({
      title:        m.title,
      meetingDate:  m.meetingDate,
      meetingType:  m.meetingType,
      decisions:    m.decisions,
      createdBy:    userMap["Jerry Shi"],
    }).returning();

    const attendeeRows = m.attendees
      .map((name) => nameToUser[name])
      .filter((id): id is string => !!id)
      .map((userId) => ({ meetingId: note.id, userId }));

    if (attendeeRows.length > 0) {
      await db.insert(schema.meetingAttendees).values(attendeeRows);
    }
  }
}

// ─── Main ────────────────────────────────────────────────────────
async function main() {
  try {
    await clearAll();

    const entityMap = await seedEntities();
    const userMap   = await seedUsers(entityMap);
    await seedPmiConfig();
    const wsMap     = await seedWorkstreams(userMap);
    const phaseMap  = await seedPhases();
    await seedGates(phaseMap);
    const msMap     = await seedMilestones(wsMap);
    await seedTasks(wsMap, msMap, userMap);
    await seedRisks(wsMap, userMap);
    const initiativeIds = await seedValueInitiatives(wsMap, userMap);
    await seedValueSnapshots(initiativeIds);
    await seedMeetings(userMap);

    console.log("\n✅  Seed complete!");
  } catch (err) {
    console.error("❌  Seed failed:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
