

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing domain ID" }, { status: 400 });
    }

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