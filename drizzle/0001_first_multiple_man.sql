CREATE TYPE "public"."carrier_contract_status" AS ENUM('in_negotiation', 'active', 'expired', 'terminated');--> statement-breakpoint
CREATE TYPE "public"."chat_role" AS ENUM('user', 'assistant', 'system', 'tool_call', 'tool_result');--> statement-breakpoint
CREATE TYPE "public"."chat_status" AS ENUM('active', 'archived');--> statement-breakpoint
CREATE TYPE "public"."demand_confidence" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."draft_status" AS ENUM('pending', 'approved', 'edited', 'discarded');--> statement-breakpoint
CREATE TYPE "public"."feedback_status" AS ENUM('open', 'triaged', 'in_progress', 'resolved', 'wont_fix');--> statement-breakpoint
CREATE TYPE "public"."feedback_type" AS ENUM('bug', 'idea', 'question', 'praise');--> statement-breakpoint
CREATE TYPE "public"."growth_priority_status" AS ENUM('active', 'planned');--> statement-breakpoint
CREATE TYPE "public"."handoff_status" AS ENUM('sent', 'seen', 'acknowledged', 'in_progress', 'completed', 'declined', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."handoff_urgency" AS ENUM('low', 'medium', 'high', 'urgent');--> statement-breakpoint
CREATE TYPE "public"."notification_kind" AS ENUM('handoff_received', 'handoff_status_changed', 'mention', 'watch_alert', 'ai_insight', 'system');--> statement-breakpoint
CREATE TYPE "public"."opportunity_stage" AS ENUM('lead', 'qualified', 'quoted', 'negotiating', 'won', 'lost');--> statement-breakpoint
CREATE TYPE "public"."watch_type" AS ENUM('any_change', 'major_only', 'mentions_only');--> statement-breakpoint
ALTER TYPE "public"."user_role" ADD VALUE 'customer_service' BEFORE 'finance';--> statement-breakpoint
ALTER TYPE "public"."user_role" ADD VALUE 'procurement' BEFORE 'finance';--> statement-breakpoint
ALTER TYPE "public"."user_role" ADD VALUE 'operations' BEFORE 'finance';--> statement-breakpoint
CREATE TABLE "task_meetings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"meeting_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "task_meetings_task_id_meeting_id_unique" UNIQUE("task_id","meeting_id")
);
--> statement-breakpoint
CREATE TABLE "growth_priorities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"status" "growth_priority_status" DEFAULT 'planned' NOT NULL,
	"icon" varchar(100) DEFAULT 'star' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"metrics" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"role" "chat_role" NOT NULL,
	"content" text,
	"tool_name" varchar(100),
	"tool_input" jsonb,
	"tool_output" jsonb,
	"draft_payload" jsonb,
	"draft_status" "draft_status",
	"token_count" integer,
	"model" varchar(50),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(500),
	"page_context" jsonb,
	"status" "chat_status" DEFAULT 'active' NOT NULL,
	"message_count" integer DEFAULT 0,
	"last_message_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "opportunities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_contact_id" uuid,
	"customer_name" varchar(255) NOT NULL,
	"description" text,
	"salesperson_id" uuid NOT NULL,
	"supporting_user_ids" uuid[],
	"stage" "opportunity_stage" DEFAULT 'lead' NOT NULL,
	"stage_changed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expected_value_cents" bigint,
	"expected_margin_cents" bigint,
	"won_value_cents" bigint,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"lane" varchar(255),
	"origin_city" varchar(100),
	"destination_city" varchar(100),
	"commodity" varchar(255),
	"volume_teu" integer,
	"volume_teu_monthly" integer,
	"incoterm" varchar(10),
	"expected_close_date" timestamp with time zone,
	"expected_start_date" timestamp with time zone,
	"created_by_ai" boolean DEFAULT false NOT NULL,
	"ai_conversation_id" uuid,
	"metadata" jsonb,
	"entity_id" uuid NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "opportunity_activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"opportunity_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"kind" varchar(50) NOT NULL,
	"title" varchar(255),
	"body" text,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "carrier_contracts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"carrier_contact_id" uuid,
	"carrier_name" varchar(255) NOT NULL,
	"carrier_type" "carrier_type" DEFAULT 'ocean' NOT NULL,
	"contract_code" varchar(100),
	"transport_mode" "transport_mode" DEFAULT 'ocean_fcl' NOT NULL,
	"lane" varchar(255) NOT NULL,
	"origin_city" varchar(100),
	"destination_city" varchar(100),
	"commodity_scope" text,
	"validity_start" timestamp with time zone NOT NULL,
	"validity_end" timestamp with time zone NOT NULL,
	"base_rate_cents" bigint,
	"rate_unit" varchar(20) DEFAULT 'per_container',
	"mqc_committed" integer NOT NULL,
	"mqc_utilized" integer DEFAULT 0 NOT NULL,
	"peak_season_terms" text,
	"baf_gri_terms" jsonb,
	"status" "carrier_contract_status" DEFAULT 'in_negotiation' NOT NULL,
	"negotiation_owner_id" uuid,
	"signed_at" timestamp with time zone,
	"on_time_pct" integer,
	"claims_count" integer DEFAULT 0 NOT NULL,
	"notes" text,
	"metadata" jsonb,
	"entity_id" uuid NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contract_utilization" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contract_id" uuid NOT NULL,
	"shipment_ref" varchar(100),
	"teu_used" integer NOT NULL,
	"booked_at" timestamp with time zone DEFAULT now() NOT NULL,
	"booked_by_user_id" uuid,
	"notes" text,
	"voided" boolean DEFAULT false NOT NULL,
	"voided_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "demand_signals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"salesperson_id" uuid NOT NULL,
	"opportunity_id" uuid,
	"customer_name" varchar(255),
	"lane" varchar(255) NOT NULL,
	"origin_city" varchar(100),
	"destination_city" varchar(100),
	"commodity" varchar(255),
	"expected_volume_teu" integer NOT NULL,
	"expected_start_date" timestamp with time zone NOT NULL,
	"expected_end_date" timestamp with time zone,
	"recurrence_pattern" varchar(50),
	"confidence" "demand_confidence" DEFAULT 'medium' NOT NULL,
	"assigned_cs_user_id" uuid,
	"assigned_at" timestamp with time zone,
	"fulfilled" boolean DEFAULT false NOT NULL,
	"fulfilled_at" timestamp with time zone,
	"notes" text,
	"created_by_ai" boolean DEFAULT false NOT NULL,
	"ai_conversation_id" uuid,
	"metadata" jsonb,
	"entity_id" uuid NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "handoffs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"from_user_id" uuid NOT NULL,
	"from_office_id" uuid,
	"from_department_id" uuid,
	"to_user_id" uuid,
	"to_department_code" varchar(50),
	"to_office_id" uuid,
	"subject" varchar(255) NOT NULL,
	"context" text NOT NULL,
	"requested_action" text NOT NULL,
	"urgency" "handoff_urgency" DEFAULT 'medium' NOT NULL,
	"due_by" timestamp with time zone,
	"related_type" varchar(50),
	"related_id" uuid,
	"status" "handoff_status" DEFAULT 'sent' NOT NULL,
	"seen_at" timestamp with time zone,
	"acknowledged_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"declined_at" timestamp with time zone,
	"decline_reason" text,
	"drafted_by_ai" boolean DEFAULT false NOT NULL,
	"ai_conversation_id" uuid,
	"entity_id" uuid NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "thread_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"thread_id" uuid NOT NULL,
	"author_id" uuid NOT NULL,
	"body" text NOT NULL,
	"mentioned_user_ids" uuid[],
	"parent_message_id" uuid,
	"drafted_by_ai" boolean DEFAULT false NOT NULL,
	"edited_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "thread_participants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"thread_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_read_at" timestamp with time zone,
	"is_muted" boolean DEFAULT false NOT NULL,
	CONSTRAINT "thread_participants_unique" UNIQUE("thread_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "threads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"target_type" varchar(50) NOT NULL,
	"target_id" uuid NOT NULL,
	"title" varchar(255),
	"is_resolved" boolean DEFAULT false NOT NULL,
	"resolved_at" timestamp with time zone,
	"resolved_by" uuid,
	"last_message_at" timestamp with time zone DEFAULT now() NOT NULL,
	"message_count" integer DEFAULT 0 NOT NULL,
	"entity_id" uuid NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "threads_target_unique" UNIQUE("target_type","target_id")
);
--> statement-breakpoint
CREATE TABLE "watches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"target_type" varchar(50) NOT NULL,
	"target_id" uuid NOT NULL,
	"watch_type" "watch_type" DEFAULT 'any_change' NOT NULL,
	"entity_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "watches_unique" UNIQUE("user_id","target_type","target_id")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"kind" "notification_kind" NOT NULL,
	"source_type" varchar(50),
	"source_id" uuid,
	"title" varchar(255) NOT NULL,
	"body" text,
	"action_url" text,
	"metadata" jsonb,
	"delivered_in_app" timestamp with time zone DEFAULT now() NOT NULL,
	"delivered_push" timestamp with time zone,
	"delivered_email" timestamp with time zone,
	"delivered_wechat" timestamp with time zone,
	"read_at" timestamp with time zone,
	"dismissed_at" timestamp with time zone,
	"entity_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "office_status" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"office_id" uuid NOT NULL,
	"current_focus" text,
	"capacity_indicator" varchar(10) DEFAULT 'green',
	"blockers" text,
	"set_by_user_id" uuid,
	"set_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "office_status_unique" UNIQUE("office_id")
);
--> statement-breakpoint
CREATE TABLE "user_feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "feedback_type" NOT NULL,
	"body" text NOT NULL,
	"page_url" text,
	"user_agent" text,
	"screenshot_url" text,
	"page_context" jsonb,
	"status" "feedback_status" DEFAULT 'open' NOT NULL,
	"triaged_by" uuid,
	"triaged_at" timestamp with time zone,
	"admin_notes" text,
	"resolution_notes" text,
	"resolved_at" timestamp with time zone,
	"related_issue_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "task_meetings" ADD CONSTRAINT "task_meetings_task_id_pmi_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."pmi_tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_meetings" ADD CONSTRAINT "task_meetings_meeting_id_meeting_notes_id_fk" FOREIGN KEY ("meeting_id") REFERENCES "public"."meeting_notes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_customer_contact_id_contacts_id_fk" FOREIGN KEY ("customer_contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_salesperson_id_users_id_fk" FOREIGN KEY ("salesperson_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunity_activities" ADD CONSTRAINT "opportunity_activities_opportunity_id_opportunities_id_fk" FOREIGN KEY ("opportunity_id") REFERENCES "public"."opportunities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunity_activities" ADD CONSTRAINT "opportunity_activities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carrier_contracts" ADD CONSTRAINT "carrier_contracts_carrier_contact_id_contacts_id_fk" FOREIGN KEY ("carrier_contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carrier_contracts" ADD CONSTRAINT "carrier_contracts_negotiation_owner_id_users_id_fk" FOREIGN KEY ("negotiation_owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carrier_contracts" ADD CONSTRAINT "carrier_contracts_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contract_utilization" ADD CONSTRAINT "contract_utilization_contract_id_carrier_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."carrier_contracts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contract_utilization" ADD CONSTRAINT "contract_utilization_booked_by_user_id_users_id_fk" FOREIGN KEY ("booked_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demand_signals" ADD CONSTRAINT "demand_signals_salesperson_id_users_id_fk" FOREIGN KEY ("salesperson_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demand_signals" ADD CONSTRAINT "demand_signals_opportunity_id_opportunities_id_fk" FOREIGN KEY ("opportunity_id") REFERENCES "public"."opportunities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demand_signals" ADD CONSTRAINT "demand_signals_assigned_cs_user_id_users_id_fk" FOREIGN KEY ("assigned_cs_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demand_signals" ADD CONSTRAINT "demand_signals_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "handoffs" ADD CONSTRAINT "handoffs_from_user_id_users_id_fk" FOREIGN KEY ("from_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "handoffs" ADD CONSTRAINT "handoffs_from_office_id_offices_id_fk" FOREIGN KEY ("from_office_id") REFERENCES "public"."offices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "handoffs" ADD CONSTRAINT "handoffs_from_department_id_departments_id_fk" FOREIGN KEY ("from_department_id") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "handoffs" ADD CONSTRAINT "handoffs_to_user_id_users_id_fk" FOREIGN KEY ("to_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "handoffs" ADD CONSTRAINT "handoffs_to_office_id_offices_id_fk" FOREIGN KEY ("to_office_id") REFERENCES "public"."offices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "handoffs" ADD CONSTRAINT "handoffs_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread_messages" ADD CONSTRAINT "thread_messages_thread_id_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread_messages" ADD CONSTRAINT "thread_messages_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread_participants" ADD CONSTRAINT "thread_participants_thread_id_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread_participants" ADD CONSTRAINT "thread_participants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "threads" ADD CONSTRAINT "threads_resolved_by_users_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "threads" ADD CONSTRAINT "threads_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "watches" ADD CONSTRAINT "watches_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "watches" ADD CONSTRAINT "watches_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "office_status" ADD CONSTRAINT "office_status_office_id_offices_id_fk" FOREIGN KEY ("office_id") REFERENCES "public"."offices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "office_status" ADD CONSTRAINT "office_status_set_by_user_id_users_id_fk" FOREIGN KEY ("set_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_feedback" ADD CONSTRAINT "user_feedback_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_feedback" ADD CONSTRAINT "user_feedback_triaged_by_users_id_fk" FOREIGN KEY ("triaged_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_chat_messages_conv" ON "chat_messages" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "idx_chat_messages_conv_created" ON "chat_messages" USING btree ("conversation_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_conversations_status" ON "conversations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_conversations_last_msg" ON "conversations" USING btree ("last_message_at");--> statement-breakpoint
CREATE INDEX "opportunities_salesperson_stage_idx" ON "opportunities" USING btree ("salesperson_id","stage");--> statement-breakpoint
CREATE INDEX "opportunities_stage_idx" ON "opportunities" USING btree ("stage","expected_close_date");--> statement-breakpoint
CREATE INDEX "opportunities_entity_idx" ON "opportunities" USING btree ("entity_id","stage");--> statement-breakpoint
CREATE INDEX "opportunities_customer_idx" ON "opportunities" USING btree ("customer_name");--> statement-breakpoint
CREATE INDEX "opp_activities_opp_idx" ON "opportunity_activities" USING btree ("opportunity_id","occurred_at");--> statement-breakpoint
CREATE INDEX "carrier_contracts_status_idx" ON "carrier_contracts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "carrier_contracts_lane_idx" ON "carrier_contracts" USING btree ("lane","validity_start");--> statement-breakpoint
CREATE INDEX "carrier_contracts_entity_idx" ON "carrier_contracts" USING btree ("entity_id","status");--> statement-breakpoint
CREATE INDEX "carrier_contracts_carrier_idx" ON "carrier_contracts" USING btree ("carrier_name");--> statement-breakpoint
CREATE INDEX "contract_utilization_contract_idx" ON "contract_utilization" USING btree ("contract_id","booked_at");--> statement-breakpoint
CREATE INDEX "demand_signals_lane_date_idx" ON "demand_signals" USING btree ("lane","expected_start_date");--> statement-breakpoint
CREATE INDEX "demand_signals_salesperson_idx" ON "demand_signals" USING btree ("salesperson_id","created_at");--> statement-breakpoint
CREATE INDEX "demand_signals_assigned_idx" ON "demand_signals" USING btree ("assigned_cs_user_id");--> statement-breakpoint
CREATE INDEX "demand_signals_entity_idx" ON "demand_signals" USING btree ("entity_id","expected_start_date");--> statement-breakpoint
CREATE INDEX "handoffs_to_user_status_idx" ON "handoffs" USING btree ("to_user_id","status");--> statement-breakpoint
CREATE INDEX "handoffs_from_user_idx" ON "handoffs" USING btree ("from_user_id","created_at");--> statement-breakpoint
CREATE INDEX "handoffs_entity_idx" ON "handoffs" USING btree ("entity_id","status");--> statement-breakpoint
CREATE INDEX "handoffs_department_idx" ON "handoffs" USING btree ("to_department_code","status");--> statement-breakpoint
CREATE INDEX "handoffs_related_idx" ON "handoffs" USING btree ("related_type","related_id");--> statement-breakpoint
CREATE INDEX "thread_messages_thread_idx" ON "thread_messages" USING btree ("thread_id","created_at");--> statement-breakpoint
CREATE INDEX "thread_messages_author_idx" ON "thread_messages" USING btree ("author_id","created_at");--> statement-breakpoint
CREATE INDEX "thread_participants_user_idx" ON "thread_participants" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "threads_target_idx" ON "threads" USING btree ("target_type","target_id");--> statement-breakpoint
CREATE INDEX "threads_entity_idx" ON "threads" USING btree ("entity_id","last_message_at");--> statement-breakpoint
CREATE INDEX "watches_target_idx" ON "watches" USING btree ("target_type","target_id");--> statement-breakpoint
CREATE INDEX "watches_user_idx" ON "watches" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notifications_user_unread_idx" ON "notifications" USING btree ("user_id","read_at");--> statement-breakpoint
CREATE INDEX "notifications_user_created_idx" ON "notifications" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "notifications_source_idx" ON "notifications" USING btree ("source_type","source_id");--> statement-breakpoint
CREATE INDEX "feedback_status_idx" ON "user_feedback" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "feedback_user_idx" ON "user_feedback" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "feedback_type_idx" ON "user_feedback" USING btree ("type","status");