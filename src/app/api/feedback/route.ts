import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { userFeedback } from "@/db/schema/feedback";
import { users } from "@/db/schema/org";
import { eq } from "drizzle-orm";

const VALID_TYPES = ["bug", "idea", "question", "praise"] as const;
type FeedbackType = (typeof VALID_TYPES)[number];

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userRecord = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.authId, user.id))
    .limit(1)
    .then((r) => r[0] ?? null);
  if (!userRecord) return NextResponse.json({ error: "User not found" }, { status: 401 });

  const body = await req.json();
  const { type, body: feedbackBody, pageUrl, pageContext } = body as {
    type: string;
    body: string;
    pageUrl?: string;
    pageContext?: Record<string, unknown>;
  };

  if (!VALID_TYPES.includes(type as FeedbackType)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }
  if (!feedbackBody?.trim()) {
    return NextResponse.json({ error: "Body is required" }, { status: 400 });
  }

  const [inserted] = await db
    .insert(userFeedback)
    .values({
      userId: userRecord.id,
      type: type as FeedbackType,
      body: feedbackBody.trim(),
      pageUrl: pageUrl ?? null,
      userAgent: req.headers.get("user-agent"),
      pageContext: pageContext ?? null,
    })
    .returning({ id: userFeedback.id });

  return NextResponse.json({ id: inserted.id }, { status: 201 });
}
