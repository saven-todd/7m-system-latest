"use server";

import { prisma } from "@/src/lib/db";
import bcrypt from "bcrypt";

type CreateDomainResult = {
  success: boolean;
  error?: string;
};

export async function createDomain(formData: FormData) {
  const url = formData.get("url") as string;
  const domainType = formData.get("domainType") as string;
  const domainTeam = formData.get("domainTeam") as string;
  const domainHost = formData.get("domainHost") as string;
  const domainProvider = formData.get("domainProvider") as string;
  const domainCloudflare = formData.get("domainCloudflare") as string;
  const domainStatus = formData.get("domainStatus") === "on" ? true : false;
  const wpUser = (formData.get("wpUser") as string) || "";
  const wpPassword = (formData.get("wpPassword") as string) || "";

  try {
    // hash password
    const hashedPassword = wpPassword ? await bcrypt.hash(wpPassword, 10) : "";

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
