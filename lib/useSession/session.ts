import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth"; // ← adjust to the file that contains betterAuth({...})

/** Returns the session, or sends the visitor to /login. */
export async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  return session;
}

/** Same as requireSession, but also checks the user's role. */
export async function requireRole(roles: string[]) {
  const session = await requireSession();
  const role = session.user.role ?? "client";
  if (!roles.includes(role)) redirect("/dashboard");
  return session;
}