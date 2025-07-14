"use client";
import { Box, Button, Chip, Divider } from "@mui/material";
import { useParams } from "next/navigation";

import CopyAllIcon from "@mui/icons-material/CopyAll";

interface Domain {
  id: string;
  url: string;
  domainType: string;
  domainTeam: string;
  domainHost: string;
  domainProvider: string;
  domainCloudflare?: string;
  domainStatus: string;
  domainRedirect?: string;
  wpDetail?: {
    wpUser?: string;
    wpPassword?: string;
  };
}

import { useEffect, useState } from "react";

export default function Page() {
  const params = useParams();
  const id = params?.id;

  const [domain, setDomain] = useState<Domain | null>(null);

  // loading state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchDomain() {
      try {
        const res = await fetch(`/api/domains/${id}`);
        if (!res.ok) throw new Error("Failed to fetch domain data");
        const data = await res.json();
        setDomain(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching domain:", error);
      }
    }

    fetchDomain();
  }, [id]);

  if (!domain) {
    console.log("Loading domain data...", id);
    return (
      <Box>
        {/* <Skeleton variant="rounded" width="100%" height={200} /> */}
        <div className="p-6 flex h-[30vh] items-center justify-center">
          <div className="animate-spin text-blue-500 w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full"></div>
        </div>
      </Box>
    );
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text).then();
  }

  return (
    <div className="p-6 mt-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">ข้อมูลโดเมน: {domain.url}</h1>
      <div className="flex space-y-2">
        <div className="w-[30%] flex flex-col space-y-2 self-center items-center p-4 ">
          <div className="content-preview border border-gray-300 rounded-lg w-full h-full mr-8 min-h-[200px] flex items-center justify-center">
            {loading ? (
              <Box>
                {/* <Skeleton variant="rounded" width="100%" height={200} /> */}
                <div className="p-6 flex h-[30vh] items-center justify-center">
                  <div className="animate-spin text-blue-500 w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full"></div>
                </div>
              </Box>
            ) : (
              <img
                src={`https://image.thum.io/get/width/600/crop/768/https://${domain.url}`}
                alt={`Screenshot of ${domain.url}`}
                className="w-full h-full object-cover rounded-lg"
              />
            )}
          </div>
        </div>
        <div className="w-[45%] flex flex-col space-y-2 gap-2">
          <div className="flex flex-col space-y-2">
            <h2 className="font-semibold">ประเภทโดเมน</h2>
            <Divider className="my-2 w-[80%]" />
            <div className="flex flex-col gap-2 py-2">
              <div className="flex gap-2">
                <label className="font-semibold">Web Type :</label>
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
              <div className="flex gap-2">
                <label className="font-semibold">Host :</label>
                <Chip label={domain.domainHost} color="info" size="small" />
              </div>
              <div className="flex gap-2">
                <label className="font-semibold">Domain Name :</label>
                <Chip label={domain.domainProvider} color="info" size="small" />
              </div>
              <div className="flex gap-2">
                <label className="font-semibold">Cloudflare :</label>
                <Chip label={domain.domainCloudflare || "ไม่มี"} size="small" />
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <h2 className="font-semibold">Team</h2>
            <Divider className="my-2 w-[80%]" />
            <div className="flex flex-col gap-2 py-2">
              <div className="flex gap-2">
                <label className="font-semibold">Web Type :</label>
                <Chip
                  label={domain.domainTeam}
                  color={
                    domain.domainTeam === "NS"
                      ? "primary"
                      : domain.domainTeam === "Money Site"
                      ? "success"
                      : "info"
                  }
                  size="small"
                />
              </div>
              <div className="flex gap-2">
                <label className="font-semibold">Status :</label>
                <Chip label={domain.domainStatus} color="info" size="small" />
              </div>
              <div className="flex gap-2">
                <label className="font-semibold">Redirect :</label>
                <Chip label={domain.domainRedirect || "ไม่มี"} size="small" />
              </div>
            </div>
          </div>
        </div>
        <div className="w-[25%] flex flex-col space-y-2 gap-2">
          <div className="flex flex-col space-y-2">
            <h2 className="font-semibold">WordPress Detail</h2>
            <Divider className="my-2 w-[80%]" />
            <div className="flex gap-2 pt-3 items-center">
              <label className="font-semibold">WP User :</label>
              <span>{domain.wpDetail?.wpUser || "ไม่มีข้อมูล"}</span>
              {domain.wpDetail?.wpUser && (
                <Button onClick={() => handleCopy(domain.wpDetail!.wpUser!)}>
                  <CopyAllIcon fontSize="small" />
                </Button>
              )}
            </div>
            <div className="flex gap-2 pt-1 items-center">
              <label className="font-semibold">WP Password :</label>
              <span>{domain.wpDetail?.wpPassword || "ไม่มีข้อมูล"}</span>
              {domain.wpDetail?.wpPassword && (
                <Button
                  onClick={() => handleCopy(domain.wpDetail!.wpPassword!)}
                >
                  <CopyAllIcon fontSize="small" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
