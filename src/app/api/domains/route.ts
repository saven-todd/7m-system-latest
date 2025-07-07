// src/app/api/domains/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";

export async function POST(req: Request) {
  const data = await req.json();

  console.log("🔥 POST /api/domains called");
  console.log("✅ req data:", data);

  try {
    const domain = await prisma.domain.create({
      data: {
        url: data.url,
        domainType: data.domainType,
        domainTeam: data.domainTeam,
        domainHost: data.domainHost,
        domainProvider: data.domainProvider,
        domainCloudflare: data.domainCloudflare || null,
        wpDetail: {
          create: {
            wpUser: data.wpUser || "",
            wpPassword: data.wpPassword || "",
          },
        },
      },
    });

    console.log("✅ Domain saved successfully:", domain);

    return NextResponse.json(domain, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการบันทึก" },
      { status: 500 }
    );
  }
}