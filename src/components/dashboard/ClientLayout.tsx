

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import type { ReactNode } from "react";
import VerticalNavBar from "@/components/dashboard/VerticalNavBar";
import NavbarHorizen from "@/components/dashboard/NavbarHorizon";

type Props = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: Props) {
  let session = null;

  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error("❌ Error fetching session:", error);
  }

  const allowedRoles = new Set(["admin", "manager"]);

  if (!session || !session.user || !allowedRoles.has(session.user.role ?? "")) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-[#f5f5fa]">
      {/* Sidebar */}
      <VerticalNavBar />

      {/* Content */}
      <main className="flex-1 p-6 overflow-y-auto text-gray-800">
        <NavbarHorizen />
        {children}
      </main>
    </div>
  );
}