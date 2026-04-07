import { createClient } from "./server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export type CurrentUser = {
  id: string;          // our internal users.id (used in all FK references)
  authId: string;      // auth.users.id
  email: string;
  fullName: string;
  role: string;
  isAdmin: boolean;       // owner | board | executive — can edit everything
  isContributor: boolean; // dept heads, managers, operators, etc — can edit own tasks
};

/**
 * Returns the current authenticated user from our users table.
 * Returns null if not authenticated or not in our users table.
 * Use in Server Components and Server Actions.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const [row] = await db
    .select({
      id: users.id,
      authId: users.authId,
      email: users.email,
      fullName: users.fullName,
      role: users.role,
    })
    .from(users)
    .where(eq(users.authId, user.id))
    .limit(1);

  if (!row || !row.authId) return null;

  const isAdmin = ADMIN_ROLES.has(row.role);
  const isContributor = CONTRIBUTOR_ROLES.has(row.role);

  return {
    id: row.id,
    authId: row.authId,
    email: row.email,
    fullName: row.fullName,
    role: row.role,
    isAdmin,
    isContributor,
  };
}

const ADMIN_ROLES = new Set(["owner", "board", "executive"]);
const CONTRIBUTOR_ROLES = new Set([
  "department_head", "manager", "operator",
  "sales", "finance", "compliance",
]);
