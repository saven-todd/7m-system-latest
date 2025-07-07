"use server";

import { prisma } from "@/src/lib/db";
import bcrypt from "bcrypt";

export async function updateDomain(id: string, formData: FormData) {
  const url = formData.get("url") as string;
  const domainType = formData.get("domainType") as string;
  const domainTeam = formData.get("domainTeam") as string;
  const domainHost = formData.get("domainHost") as string;
  const domainProvider = formData.get("domainProvider") as string;
  const domainCloudflare = formData.get("domainCloudflare") as string;
  const domainStatus = formData.get("domainStatus") === "on" ? true : false;
  const wpUser = (formData.get("wpUser") as string) || "";
  const wpPassword = (formData.get("wpPassword") as string) || "";

  console.log({
    id,
    url,
    domainType,
    domainStatus,
    wpUser,
  });

  try {
    const hashedPassword = wpPassword
      ? await bcrypt.hash(wpPassword, 10)
      : undefined;

    await prisma.domain.update({
      where: { id },
      data: {
        url,
        domainType,
        domainTeam,
        domainHost,
        domainProvider,
        domainCloudflare: domainCloudflare || null,
        domainStatus,
        wpDetail: {
          upsert: {
            update: {
              wpUser,
              ...(hashedPassword && { wpPassword: hashedPassword }),
            },
            create: {
              wpUser,
              wpPassword: hashedPassword || "",
            },
          },
        },
      },
    });

    return { success: true, editSuccess: true };
  } catch (error) {
    console.error("❌ updateDomain error", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "unknown error",
    };
  }
}
