import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import AdminRegisterForm from "./AdminRegisterForm";

export const metadata = {
  title: "Admin Registration | AutoZone",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminRegisterPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Only an existing admin can access this page.
  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-xl">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D80005]">
            AutoZone Administration
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-black">
            Create an administrator
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-600">
            Create a separate administrator account to manage the AutoZone
            platform. Only authorized administrators can access this page.
          </p>
        </div>

        <div className="border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <AdminRegisterForm />
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          Restricted access · AutoZone Admin
        </p>
      </div>
    </main>
  );
}
