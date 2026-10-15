import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server"; // ← the file that contains betterAuth({...})

/** Returns the session, or sends the visitor to /login. */
export async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  return session;
}

/** Accepts one role ("admin") or several (["seller", "admin"]). */
export async function requireRole(roles: string | readonly string[]) {
  const session = await requireSession();
  const allowed = typeof roles === "string" ? [roles] : roles;
  const role = session.user.role ?? "client";
  if (!allowed.includes(role)) redirect("/dashboard");
  return session;
}