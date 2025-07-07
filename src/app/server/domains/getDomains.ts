

"use server";

import { prisma } from "@/src/lib/db";

export async function getDomains() {
  try {
    const domains = await prisma.domain.findMany({
      include: {
        wpDetail: true,
      },
    });
    return domains;
  } catch (error) {
    console.error("❌ getDomains error", error);
    throw error;
  }
}