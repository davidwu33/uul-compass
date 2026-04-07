import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  date,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { phaseStatusEnum, gateStatusEnum } from "./enums";
import { users } from "./org";

// ─── PMI Config (singleton row) ────────────────────────────────
// Stores project-level settings. Always query with id = 'default'.
export const pmiConfig = pgTable("pmi_config", {
  id: varchar({ length: 20 }).primaryKey().default("default"),
  startDate: date("start_date").notNull(),   // e.g. 2026-04-01 — used to calculate dayNumber
  totalDays: integer("total_days").default(100).notNull(),
  projectName: varchar("project_name", { length: 255 }).default("UUL Post-Merger Integration"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── PMI Phases ────────────────────────────────────────────────
export const pmiPhases = pgTable("pmi_phases", {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  phaseNumber: integer("phase_number").notNull(), // 1, 2, 3
  startDay: integer("start_day").notNull(),
  endDay: integer("end_day").notNull(),
  startDate: date("start_date"),
  endDate: date("end_date"),
  status: phaseStatusEnum().default("not_started").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── PMI Decision Gates ────────────────────────────────────────
export const pmiDecisionGates = pgTable("pmi_decision_gates", {
  id: uuid().defaultRandom().primaryKey(),
  phaseId: uuid("phase_id")
    .references(() => pmiPhases.id)
    .notNull(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  targetDay: integer("target_day").notNull(), // Day 14, 30, 45, etc.
  targetDate: date("target_date"),
  status: gateStatusEnum().default("upcoming").notNull(),
  ownerLabel: varchar("owner_label", { length: 255 }), // e.g. "Jerry + David Wu"
  criteria: jsonb(), // Array of { criterion: string, met: boolean }
  decidedBy: uuid("decided_by").references(() => users.id),
  decidedAt: timestamp("decided_at", { withTimezone: true }),
  outcome: text(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
