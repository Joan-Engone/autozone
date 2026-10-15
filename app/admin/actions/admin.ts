"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

type CreateAdminAccountInput = {
  name: string;
  email: string;
  password: string;
};

export async function createAdminAccount({
  name,
  email,
  password,
}: CreateAdminAccountInput): Promise<{ error?: string }> {
  try {
    // Validate input on the server
    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!trimmedName || !normalizedEmail || !password) {
      return { error: "All fields are required." };
    }

    if (trimmedName.length > 100) {
      return { error: "The name is too long." };
    }

    if (password.length < 8) {
      return {
        error: "The password must contain at least 8 characters.",
      };
    }

    // Require an existing authenticated administrator.
    // This prevents public visitors from creating privileged accounts.
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "admin") {
      return {
        error: "You are not authorized to create administrator accounts.",
      };
    }

    // Create the user through Better Auth.
    // Verify that your Better Auth configuration supports the admin plugin
    // and the role field used above.
    await auth.api.createUser({
      body: {
        name: trimmedName,
        email: normalizedEmail,
        password,
        role: "admin",
      },
      headers: await headers(),
    });

    return {};
  } catch (error) {
    console.error("createAdminAccount failed:", error);

    return {
      error: "Unable to create the administrator account.",
    };
  }
}