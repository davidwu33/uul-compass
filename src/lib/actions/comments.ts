"use server";

import { db } from "@/db";
import { comments } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/supabase/get-current-user";

export async function addTaskComment(taskId: string, body: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Unauthorized");

  const trimmed = body.trim();
  if (!trimmed) return;

  await db.insert(comments).values({
    authorId: currentUser.id,
    targetType: "task",
    targetId: taskId,
    body: trimmed,
  });

  revalidatePath(`/tasks/${taskId}`);
}
