"use server";

import { db } from "@/db";
import { growthPriorities } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/supabase/get-current-user";

export interface GrowthPriorityInput {
  name: string;
  description?: string;
  status: "active" | "planned";
  icon?: string;
  sortOrder?: number;
  metrics?: Array<{ label: string; value: string }>;
}

function revalidateAll() {
  revalidatePath("/value-gains");
  revalidatePath("/");
}

export async function createGrowthPriority(data: GrowthPriorityInput) {
  const currentUser = await getCurrentUser();
  if (!currentUser || (!currentUser.isAdmin && !currentUser.isContributor)) {
    throw new Error("Unauthorized");
  }

  await db.insert(growthPriorities).values({
    name: data.name,
    description: data.description || null,
    status: data.status,
    icon: data.icon || "star",
    sortOrder: data.sortOrder ?? 0,
    metrics: data.metrics ?? [],
  });

  revalidateAll();
}

export async function updateGrowthPriority(id: string, data: GrowthPriorityInput) {
  const currentUser = await getCurrentUser();
  if (!currentUser || (!currentUser.isAdmin && !currentUser.isContributor)) {
    throw new Error("Unauthorized");
  }

  await db
    .update(growthPriorities)
    .set({
      name: data.name,
      description: data.description || null,
      status: data.status,
      icon: data.icon || "star",
      sortOrder: data.sortOrder ?? 0,
      metrics: data.metrics ?? [],
      updatedAt: new Date(),
    })
    .where(eq(growthPriorities.id, id));

  revalidateAll();
}

export async function deleteGrowthPriority(id: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser || !currentUser.isAdmin) {
    throw new Error("Unauthorized");
  }

  await db.delete(growthPriorities).where(eq(growthPriorities.id, id));
  revalidateAll();
}
