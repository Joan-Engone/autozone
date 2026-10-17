import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";

/**
 * Requires the user to be authenticated.
 */
export async function requireSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return session;
}

/**
 * Requires authentication and one of the specified roles.
 * Role comparisons are case-insensitive.
 */
export async function requireRole(
  roles: string | readonly string[],
) {
  const session = await requireSession();

  const allowedRoles = (
    typeof roles === "string" ? [roles] : roles
  ).map((role) => role.toUpperCase());

  const userRole = (
    session.user.role ?? "BUYER"
  ).toUpperCase();

  if (!allowedRoles.includes(userRole)) {
    redirect("/dashboard");
  }

  return session;
}