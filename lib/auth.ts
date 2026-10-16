import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";

import { prisma } from "@/lib/db/prisma";
import { resetPasswordEmail, sendEmail } from "@/lib/email/send";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    revokeSessionsOnPasswordReset: true,

    sendResetPassword: async ({ user, url }) => {
      const { subject, text, html } = resetPasswordEmail(
        user.name,
        url,
      );

      void sendEmail({
        to: user.email,
        subject,
        text,
        html,
      });
    },
  },


  user: {
    additionalFields: {
      phone: {
        type: "string",
        required: false,
      },

      status: {
        type: "string",
        required: false,
        defaultValue: "ACTIVE",
        input: false,
      },

      accountType: {
        type: "string",
        required: false,
        defaultValue: "buyer",
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const data = user as typeof user & {
            role?: string;
            accountType?: string;
          };

          // Preserve the admin role when assigned by trusted admin logic.
          if (data.role === "admin") {
            return {
              data: {
                ...user,
                role: "admin",
                status: "ACTIVE",
              },
            };
          }

          // Public registration can create buyers or sellers.
          const isSeller = data.accountType === "seller";

          return {
            data: {
              ...user,
              role: isSeller ? "SELLER" : "BUYER",
              status: isSeller ? "PENDING" : "ACTIVE",
            },
          };
        },
      },
    },
  },

  plugins: [
    admin({
      defaultRole: "BUYER",
      adminRoles: ["admin"],
    }),
    nextCookies(),
  ],
});