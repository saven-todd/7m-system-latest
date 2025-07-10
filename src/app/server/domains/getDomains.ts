"use server";

import { prisma } from "@/lib/db";
import { Domain } from "@/generated/prisma/client";

export async function getDomains(): Promise<Domain[] | []> {
  try {
    if (!prisma || !prisma.domain) {
      throw new Error("Prisma client is not initialized or 'domain' model not found.");
    }

    const domains = await prisma.domain.findMany({
      include: {
        wpDetail: true,
      },
    });

    return domains;
  } catch (error: any) {
    console.error("❌ getDomains error:", error?.message || error);
    
    // Fallback สำหรับ production: return [] แทน throw
    if (process.env.NODE_ENV === "production") {
      return [];
    }

    throw error;
  }
}