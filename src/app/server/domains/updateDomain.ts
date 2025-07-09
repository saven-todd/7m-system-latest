"use server";

import { prisma } from "@/src/lib/db";
import bcrypt from "bcrypt";
import { encrypt } from "@/src/lib/encryption";


export async function updateDomain(id: string, formData: FormData) {
  const url = formData.get("url") as string;
  const domainType = formData.get("domainType") as string;
  const domainTeam = formData.get("domainTeam") as string;
  const domainHost = formData.get("domainHost") as string;
  const domainProvider = formData.get("domainProvider") as string;
  const domainCloudflare = formData.get("domainCloudflare") as string;
  const domainStatus = String(formData.get("domainStatus") || "");
  const domainRedirect = formData.get("redirectUrl") as string;

  // wpDetail
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
    const plainPassword = wpPassword || undefined;

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
        domainRedirect,
        wpDetail: wpUser || wpPassword
          ? {
              upsert: {
                update: {
                  wpUser,
                  ...(plainPassword && { wpPassword: plainPassword }),
                },
                create: {
                  wpUser,
                  wpPassword: plainPassword || "",
                },
              },
            }
          : undefined,
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
