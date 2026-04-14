import { createClient } from "./server";
import { db } from "@/db";
import { users, userEntityAccess, entities } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export type AccessLevel = "full" | "read" | "restricted";

export type EntityAccess = {
  entityId: string;
  entityCode: string;
  entityName: string;
  accessLevel: AccessLevel;
};

export type CurrentUser = {
  id: string;          // our internal users.id (used in all FK references)
  authId: string;      // auth.users.id
  email: string;
  fullName: string;
  role: string;
  isAdmin: boolean;       // owner | board | executive — can edit everything
  isContributor: boolean; // dept heads, managers, operators, etc — can edit own tasks

  // ─── Entity scoping ──────────────────────────────────────────
  entityAccess: EntityAccess[];
  accessibleEntityIds: string[];
  accessibleEntityCodes: string[];
};

/**
 * Returns the current authenticated user from our users table, along with
 * the full list of entities this user can access (from user_entity_access).
 * Use in Server Components, Server Actions, and API routes.
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

  const accessRows = await db
    .select({
      entityId: userEntityAccess.entityId,
      accessLevel: userEntityAccess.accessLevel,
      entityCode: entities.code,
      entityName: entities.name,
    })
    .from(userEntityAccess)
    .innerJoin(entities, eq(entities.id, userEntityAccess.entityId))
    .where(
      and(
        eq(userEntityAccess.userId, row.id),
        eq(entities.isActive, true),
      ),
    );

  const entityAccess: EntityAccess[] = accessRows.map((a) => ({
    entityId: a.entityId,
    entityCode: a.entityCode,
    entityName: a.entityName,
    accessLevel: a.accessLevel as AccessLevel,
  }));

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
    entityAccess,
    accessibleEntityIds: entityAccess.map((a) => a.entityId),
    accessibleEntityCodes: entityAccess.map((a) => a.entityCode),
  };
}

export function requireEntityAccess(user: CurrentUser, entityId: string): void {
  if (!user.accessibleEntityIds.includes(entityId)) {
    throw new Error(`Access denied: user ${user.email} cannot access entity ${entityId}`);
  }
}

export function requireEntityWrite(user: CurrentUser, entityId: string): void {
  const access = user.entityAccess.find((a) => a.entityId === entityId);
  if (!access) {
    throw new Error(`Access denied: user ${user.email} cannot access entity ${entityId}`);
  }
  if (access.accessLevel !== "full") {
    throw new Error(`Access denied: user ${user.email} has ${access.accessLevel} access to ${access.entityCode}; write operations require full access`);
  }
}

const ADMIN_ROLES = new Set(["owner", "board", "executive"]);
const CONTRIBUTOR_ROLES = new Set([
  "department_head", "manager", "operator",
  "sales", "customer_service", "procurement", "operations",
  "finance", "compliance",
]);
