import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Chip, Divider } from "@mui/material";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const domain = await prisma.domain.findUnique({
    where: { id: id },
    include: { wpDetail: true },
  });

  if (!domain) notFound();

  console.log("Fetched domain from DB:", domain);

  return (
    <div className="p-6 mt-4 bg-white rounded-lg shadow-md ">
      <h1 className="text-2xl font-bold mb-4">ข้อมูลโดเมน: {domain.url}</h1>
      <div className="flex space-y-2">
        <div className="content-wrapper w-[30%] flex flex-col space-y-2">
          <div className="content-preview">test</div>
        </div>
        <div className="content-wrapper w-[70%] flex flex-col space-y-2 gap-2">
          <div className="content-paper flex flex-col space-y-2">
            <h2 className="font-semibold">ประเภทโดเมน</h2>
            <Divider className="my-2 w-[80%]" />
            <div className="flex flex-col gap-2 py-2">
              <div className="flex flex-row gap-2">
                <label className="font-semibold">Web Type : </label>
                <Chip
                  label={domain.domainType}
                  color={
                    domain.domainType === "NS"
                      ? "primary"
                      : domain.domainType === "Money Site"
                      ? "warning"
                      : "success"
                  }
                  size="small"
                />
              </div>
              <div className="flex flex-row gap-2">
                <label className="font-semibold">Host : </label>
                <Chip label={domain.domainHost} color="info" size="small" />
              </div>
              <div className="flex flex-row gap-2">
                <label className="font-semibold">Domain Name : </label>
                <Chip label= {domain.domainProvider} color="info" size="small" />
              </div>
              <div className="flex flex-row gap-2">
                <label className="font-semibold">Cloudflare : </label>
                <Chip label={domain.domainCloudflare} size="small" />
              </div>
            </div>
          </div>
          <div className="content-paper flex flex-col space-y-2">
            <h2 className="font-semibold">Team</h2>
            <Divider className="my-2 w-[80%]" />
            <div className="flex flex-col gap-2 py-2">
              <div className="flex flex-row gap-2">
                <label className="font-semibold">Web Type : </label>
                <Chip
                  label={domain.domainTeam}
                  {domain.domainTeam === "Center X" ? {color=info} : "success"}
                  size="small"
                />
              </div>
              <div className="flex flex-row gap-2">
                <label className="font-semibold">Host : </label>
                <Chip label={domain.domainHost} color="info" size="small" />
              </div>
              <div className="flex flex-row gap-2">
                <label className="font-semibold">Cloudflare : </label>
                <Chip label={domain.domainCloudflare} size="small" />
              </div>
            </div>
          </div>\
          <span className="font-semibold">ผู้ให้บริการ:</span>{" "}
          {domain.domainProvider}
          <span className="font-semibold">โฮสต์:</span> {domain.domainHost}
          <span className="font-semibold">Cloudflare:</span>{" "}
          {domain.domainCloudflare || "ไม่มี"}
          <span className="font-semibold">สถานะ:</span> {domain.domainStatus}
          <span className="font-semibold">Redirect:</span>{" "}
          {domain.domainRedirect || "ไม่มี"}
        </div>

        {domain.wpDetail && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">WordPress Detail</h2>
            <span className="font-semibold">WP User:</span>{" "}
            {domain.wpDetail.wpUser}
            <span className="font-semibold">WP Password:</span>
            {domain.wpDetail.wpPassword}
          </div>
        )}
      </div>
    </div>
  );
}
