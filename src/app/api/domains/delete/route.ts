import { prisma } from "@/src/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    console.log("📦 DELETE domain id:", id);
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing id" },
        { status: 400 }
      );
    }

    // ค้นหา domain เพื่อนำ url ไปใช้ลบ wpDetail
    const domain = await prisma.domain.findUnique({
      where: { id },
      select: { url: true },
    });

    if (!domain) {
      return NextResponse.json(
        { success: false, error: "Domain not found" },
        { status: 404 }
      );
    }

    // ลบ wpDetail ที่มี domainUrl ตรงกับ domain.url
    await prisma.wpDetail.deleteMany({
      where: { domainUrl: domain.url },
    });

    // ลบ domain
    await prisma.domain.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Delete API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
