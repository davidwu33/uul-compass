"use server";

import { db } from "@/db";
import { valueInitiatives } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/supabase/get-current-user";

export interface InitiativeInput {
  name: string;
  category: "cost_savings" | "revenue_growth" | "cash_flow";
  description?: string;
  targetDescription?: string;
  plannedImpact?: number; // USD dollars
  capturedImpact?: number;
  status: "planned" | "in_progress" | "capturing" | "captured";
  ownerId?: string;
  workstreamId?: string;
  startDate?: string;
  targetDate?: string;
}

function revalidateAll() {
  revalidatePath("/value-gains");
  revalidatePath("/");
}

export async function createInitiative(data: InitiativeInput) {
  const currentUser = await getCurrentUser();
  if (!currentUser || (!currentUser.isAdmin && !currentUser.isContributor)) {
    throw new Error("Unauthorized");
  }

  await db.insert(valueInitiatives).values({
    name: data.name,
    category: data.category,
    description: data.description || null,
    targetDescription: data.targetDescription || null,
    plannedImpactCents: Math.round((data.plannedImpact ?? 0) * 100),
    capturedImpactCents: Math.round((data.capturedImpact ?? 0) * 100),
    status: data.status,
    ownerId: data.ownerId || null,
    workstreamId: data.workstreamId || null,
    startDate: data.startDate || null,
    targetDate: data.targetDate || null,
  });

  revalidateAll();
}

export async function updateInitiative(id: string, data: InitiativeInput) {
  const currentUser = await getCurrentUser();
  if (!currentUser || (!currentUser.isAdmin && !currentUser.isContributor)) {
    throw new Error("Unauthorized");
  }

  await db
    .update(valueInitiatives)
    .set({
      name: data.name,
      category: data.category,
      description: data.description || null,
      targetDescription: data.targetDescription || null,
      plannedImpactCents: Math.round((data.plannedImpact ?? 0) * 100),
      capturedImpactCents: Math.round((data.capturedImpact ?? 0) * 100),
      status: data.status,
      ownerId: data.ownerId || null,
      workstreamId: data.workstreamId || null,
      startDate: data.startDate || null,
      targetDate: data.targetDate || null,
      updatedAt: new Date(),
    })
    .where(eq(valueInitiatives.id, id));

  revalidateAll();
}

export async function deleteInitiative(id: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser || !currentUser.isAdmin) {
    throw new Error("Unauthorized");
  }

  await db.delete(valueInitiatives).where(eq(valueInitiatives.id, id));
  revalidateAll();
}
