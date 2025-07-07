// app/api/users/route.ts
import { prisma } from "@/src/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}
