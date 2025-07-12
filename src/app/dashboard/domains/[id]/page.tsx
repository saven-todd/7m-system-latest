import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

type Props = {
  params: {
    id: string;
  };
};

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
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">ข้อมูลโดเมน: {domain.url}</h1>
      <div className="space-y-2">
        <p>
          <span className="font-semibold">ประเภทโดเมน:</span>{" "}
          {domain.domainType}
        </p>
        <p>
          <span className="font-semibold">ทีม:</span> {domain.domainTeam}
        </p>
        <p>
          <span className="font-semibold">ผู้ให้บริการ:</span>{" "}
          {domain.domainProvider}
        </p>
        <p>
          <span className="font-semibold">โฮสต์:</span> {domain.domainHost}
        </p>
        <p>
          <span className="font-semibold">Cloudflare:</span>{" "}
          {domain.domainCloudflare || "ไม่มี"}
        </p>
        <p>
          <span className="font-semibold">สถานะ:</span> {domain.domainStatus}
        </p>
        <p>
          <span className="font-semibold">Redirect:</span>{" "}
          {domain.domainRedirect || "ไม่มี"}
        </p>
        {domain.wpDetail && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">WordPress Detail</h2>
            <p>
              <span className="font-semibold">WP User:</span>{" "}
              {domain.wpDetail.wpUser}
            </p>
            <p>
              <span className="font-semibold">WP Password:</span>
              {domain.wpDetail.wpPassword}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
