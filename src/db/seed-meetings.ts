/**
 * Seed the 4 pre-launch board meetings into meeting_notes + meeting_attendees.
 * Run once: npx tsx src/db/seed-meetings.ts
 */

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { ilike, or } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
const db = drizzle(client, { schema });

const { meetingNotes, meetingAttendees, users } = schema;

async function resolveUser(name: string): Promise<string | null> {
  const [u] = await db
    .select({ id: users.id })
    .from(users)
    .where(or(ilike(users.fullName, `%${name}%`), ilike(users.fullNameZh, `%${name}%`)))
    .limit(1);
  return u?.id ?? null;
}

const meetings = [
  {
    title: "Board Sync",
    meetingDate: "2026-03-23",
    meetingType: "board" as const,
    attendees: ["Jerry", "Alic", "Billy"],
    decisions: [
      "New sales rule: collect payment before shipping for all new contracts",
      "Silfab Plan A: demand 30% prepayment before port arrival",
      "Board structure: Jerry (Chair), Alic, Billy, Season",
      "Jason Likens appointed CEO US, Josh Foster appointed COO US",
      "Three business pillars confirmed: Logistics, SCF, Compliance & Sourcing",
    ],
  },
  {
    title: "Operations & Cash Flow Review",
    meetingDate: "2026-03-25",
    meetingType: "department" as const,
    attendees: ["Jerry", "Alic", "Billy", "Season", "Jason", "Josh"],
    decisions: [
      "VP Finance hire approved at RMB 250-300K/year",
      "$20K marketing budget approved",
      "Bridge financing: Jerry to provide $300K if needed Apr-May",
      "Supply chain finance partnerships: Standard Chartered + Klear",
    ],
  },
  {
    title: "Board Decision",
    meetingDate: "2026-03-26",
    meetingType: "board" as const,
    attendees: ["Jerry", "Alic", "Billy", "Season"],
    decisions: [
      "Shenzhen warehouse expansion approved",
      "Hiring 3 operations managers in Q2",
    ],
  },
  {
    title: "Strategy Call",
    meetingDate: "2026-03-31",
    meetingType: "strategy" as const,
    attendees: ["Jerry", "Alic", "Billy", "Season"],
    decisions: [
      "Exploring logistics stablecoin for on-chain factoring",
      "LC Warehouse + Packsmith WMS integration approved",
      "Ben Fogarty hired for corporate deck rewrite ($4K)",
    ],
  },
];

async function main() {
  for (const m of meetings) {
    const [row] = await db
      .insert(meetingNotes)
      .values({
        title: m.title,
        meetingDate: m.meetingDate,
        meetingType: m.meetingType,
        decisions: m.decisions,
      })
      .returning({ id: meetingNotes.id });

    console.log(`Created meeting: ${m.title} (${m.meetingDate}) → ${row.id}`);

    for (const name of m.attendees) {
      const userId = await resolveUser(name);
      if (userId) {
        await db
          .insert(meetingAttendees)
          .values({ meetingId: row.id, userId })
          .onConflictDoNothing();
        console.log(`  Linked attendee: ${name}`);
      } else {
        console.warn(`  ⚠ User not found: ${name}`);
      }
    }
  }

  console.log("\nDone. Closing connection.");
  await client.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
