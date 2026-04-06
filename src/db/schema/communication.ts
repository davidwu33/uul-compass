import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  date,
  timestamp,
  jsonb,
  unique,
} from "drizzle-orm/pg-core";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { actionItemStatusEnum } from "./enums";
import { entities, users } from "./org";

// ─── Activity Feed ──────────────────────────────────────────────
export const activities = pgTable("activities", {
  id: uuid().defaultRandom().primaryKey(),
  entityId: uuid("entity_id").references(() => entities.id),
  actorId: uuid("actor_id").references(() => users.id),
  action: varchar({ length: 50 }).notNull(), // created, updated, status_changed, commented
  targetType: varchar("target_type", { length: 50 }).notNull(), // task, shipment, quote, etc.
  targetId: uuid("target_id").notNull(),
  targetLabel: varchar("target_label", { length: 255 }), // Human-readable label
  changes: jsonb(), // { field: { old: x, new: y } }
  notes: text(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Comments (Polymorphic) ─────────────────────────────────────
export const comments = pgTable("comments", {
  id: uuid().defaultRandom().primaryKey(),
  entityId: uuid("entity_id").references(() => entities.id),
  authorId: uuid("author_id")
    .references(() => users.id)
    .notNull(),
  targetType: varchar("target_type", { length: 50 }).notNull(),
  targetId: uuid("target_id").notNull(),
  body: text().notNull(),
  isInternal: boolean("is_internal").default(true),
  parentId: uuid("parent_id").references((): AnyPgColumn => comments.id), // thread replies
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Meeting Notes ──────────────────────────────────────────────
export const meetingNotes = pgTable("meeting_notes", {
  id: uuid().defaultRandom().primaryKey(),
  entityId: uuid("entity_id").references(() => entities.id),
  title: varchar({ length: 255 }).notNull(),
  meetingDate: date("meeting_date").notNull(),
  meetingType: varchar("meeting_type", { length: 50 }), // board, leadership, department, strategy
  // attendees are stored in the meeting_attendees junction table
  body: text(),
  decisions: jsonb(), // Array of decision strings
  brainNotePath: text("brain_note_path"),
  gdriveLink: text("gdrive_link"),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Meeting Attendees (junction) ──────────────────────────────
export const meetingAttendees = pgTable("meeting_attendees", {
  id: uuid().defaultRandom().primaryKey(),
  meetingId: uuid("meeting_id").references(() => meetingNotes.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
}, (t) => [
  unique().on(t.meetingId, t.userId),
]);

// ─── Action Items ───────────────────────────────────────────────
export const actionItems = pgTable("action_items", {
  id: uuid().defaultRandom().primaryKey(),
  meetingId: uuid("meeting_id").references(() => meetingNotes.id),
  targetType: varchar("target_type", { length: 50 }), // optional polymorphic link
  targetId: uuid("target_id"),
  title: varchar({ length: 500 }).notNull(),
  description: text(),
  assigneeId: uuid("assignee_id").references(() => users.id),
  dueDate: date("due_date"),
  status: actionItemStatusEnum().default("open").notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
