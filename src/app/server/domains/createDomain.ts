

"use server";

import { prisma } from "@/lib/db";

type CreateDomainResult = {
  success: boolean;
  error?: string;
};

export async function createDomain(formData: FormData): Promise<CreateDomainResult> {
  const url = formData.get("url") as string;
  const domainType = formData.get("domainType") as string;
  const domainTeam = formData.get("domainTeam") as string;
  const domainHost = formData.get("domainHost") as string;
  const domainProvider = formData.get("domainProvider") as string;
  const domainCloudflare = formData.get("domainCloudflare") as string;
  const domainStatus = formData.get("domainStatus") as string;
  const wpUser = (formData.get("wpUser") as string) || "";
  const wpPassword = (formData.get("wpPassword") as string) || "";

  try {
    const hashedPassword = wpPassword;

    await prisma.domain.create({
      data: {
        url,
        domainType,
        domainTeam,
        domainHost,
        domainProvider,
        domainCloudflare: domainCloudflare || null,
        domainStatus,
        wpDetail: {
          create: {
            wpUser,
            wpPassword: hashedPassword,
          },
        },
      },
    });
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "unknown error" };
  }
}