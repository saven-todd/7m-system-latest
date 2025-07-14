import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const domain = await prisma.domain.findUnique({
      where: { id },
      include: { wpDetail: true },
    });

    if (!domain) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 });
    }

    return NextResponse.json(domain);
  } catch (error) {
    console.error("❌ Error fetching domain by ID:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}