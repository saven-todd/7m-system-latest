import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/src/lib/auth";
import type { ReactNode } from "react";
import VerticalNavBar from "@/src/components/dashboard/VerticalNavBar";

type Props = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: Props) {
  const session = await getServerSession(authOptions);

  // DEBUG
  console.log("💥 [AdminLayout] session:", session);

  // ถ้าไม่มี session หรือ role ไม่ใช่ admin → redirect
  if (!session || session.user?.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-[#f5f5fa] te">
      {/* Sidebar */}
      <VerticalNavBar />

      {/* Content */}
      <main className="flex-1 p-6 overflow-y-auto text-gray-800">
        {children}
      </main>
    </div>
  )
}