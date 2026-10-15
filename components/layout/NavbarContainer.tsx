"use client";

import { useRouter } from "next/navigation";
import Navbar, { type NavbarUser } from "./Navbar";
import { signOut, useSession } from "@/lib/auth/client";

/** Connects the Navbar to the real Better Auth session. */
export default function NavbarContainer() {
  const router = useRouter();
  const { data: session } = useSession();

  const user: NavbarUser | null = session?.user
    ? {
        name: session.user.name,
        role: (session.user.role as NavbarUser["role"]) ?? "client",
      }
    : null;

  const handleLogout = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return <Navbar user={user} onLogout={handleLogout} />;
}