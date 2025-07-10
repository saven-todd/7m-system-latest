"use server";

import { prisma } from "@/lib/db";

export async function getDomains() {
  try {
    const domains = await prisma.domain.findMany({
      include: {
        wpDetail: true,
      },
    });

    return domains;
    
  } catch (error) {
    console.error("❌ getDomains error:", (error as Error).message);

    // Fallback สำหรับ production: return [] แทน throw
    if (process.env.NODE_ENV === "production") {
      return [];
    }

    throw error;
  }
}