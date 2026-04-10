"use server";

import { db } from "@/db";
import { risks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/supabase/get-current-user";

export type RiskSeverity = "high" | "medium" | "low";
export type RiskStatus = "open" | "mitigating" | "resolved";

export interface RiskInput {
  title: string;
  description?: string;
  severity: RiskSeverity;
  status: RiskStatus;
  mitigationPlan?: string;
  ownerId?: string;
  workstreamId?: string;
  linkedTaskCodes?: string[];
  raisedDate?: string;
  targetDate?: string;
  resolvedDate?: string;
}

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/risks");
}

export async function createRisk(data: RiskInput) {
  const currentUser = await getCurrentUser();
  if (!currentUser || (!currentUser.isAdmin && !currentUser.isContributor)) {
    throw new Error("Unauthorized");
  }

  await db.insert(risks).values({
    title: data.title,
    description: data.description || null,
    severity: data.severity,
    status: data.status,
    mitigationPlan: data.mitigationPlan || null,
    ownerId: data.ownerId || null,
    workstreamId: data.workstreamId || null,
    linkedTaskCodes: data.linkedTaskCodes ?? [],
    raisedDate: data.raisedDate || null,
    targetDate: data.targetDate || null,
    resolvedDate: data.resolvedDate || null,
  });

  revalidateAll();
}

export async function updateRisk(riskId: string, data: RiskInput) {
  const currentUser = await getCurrentUser();
  if (!currentUser || (!currentUser.isAdmin && !currentUser.isContributor)) {
    throw new Error("Unauthorized");
  }

  await db
    .update(risks)
    .set({
      title: data.title,
      description: data.description || null,
      severity: data.severity,
      status: data.status,
      mitigationPlan: data.mitigationPlan || null,
      ownerId: data.ownerId || null,
      workstreamId: data.workstreamId || null,
      linkedTaskCodes: data.linkedTaskCodes ?? [],
      raisedDate: data.raisedDate || null,
      targetDate: data.targetDate || null,
      resolvedDate: data.resolvedDate || null,
      updatedAt: new Date(),
    })
    .where(eq(risks.id, riskId));

  revalidateAll();
}

export async function deleteRisk(riskId: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser || !currentUser.isAdmin) {
    throw new Error("Unauthorized");
  }

  await db.delete(risks).where(eq(risks.id, riskId));
  revalidateAll();
}
