"use server";

import { db } from "@/db";
import { pmiTasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type TaskStatus = "todo" | "in_progress" | "blocked" | "review" | "done";

export async function updateTaskStatus(taskId: string, status: TaskStatus) {
  await db
    .update(pmiTasks)
    .set({ status, updatedAt: new Date() })
    .where(eq(pmiTasks.id, taskId));

  revalidatePath("/");
  revalidatePath("/plan");
  revalidatePath("/my-tasks");
}
