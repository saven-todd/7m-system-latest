import React from "react";
import { Metadata } from "next";
import AuthGuard from "@/src/components/AuthGuard";
import VerticalNavBar from "@/src/components/dashboard/VerticalNavBar";
import NavbarHorizon from "@/src/components/dashboard/NavbarHorizon";

export const metadata: Metadata = {
  title: "Dashboard | 7M System",
  description: "Admin dashboard for managing domains and staff",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <VerticalNavBar />

        <main className="flex-1 p-4 bg-gray-50 text-gray-800">
          <NavbarHorizon />
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
