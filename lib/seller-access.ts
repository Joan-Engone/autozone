import { auth } from "@/lib/auth/server"; // ← the file that contains betterAuth({...}), same path as in lib/auth/session.ts

/** For API routes: returns the signed-in seller (or admin), otherwise null. */
export async function getSellerFromRequest(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return null;
  const role = session.user.role ?? "client";
  return role === "seller" || role === "admin" ? session.user : null;
}