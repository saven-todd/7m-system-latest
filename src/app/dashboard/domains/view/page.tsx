"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import CopyAllIcon from "@mui/icons-material/CopyAll";
import Button from "@mui/material/Button";


import EditDomainModal from "../EditDomainModal";

export default function DomainViewPage() {
  const domainId = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("id") : null;

  interface DomainData {
    id: string;
    url: string;
    domainType: string;
    domainTeam: string;
    domainHost: string;
    domainProvider: string;
    domainCloudflare?: string;
    domainStatus: string;
    domainRedirect?: string;
    createdAt: string;
    wpDetail?: {
      wpUser: string;
      wpPassword: string;
    };
  }

  const [domain, setDomain] = useState<DomainData | null>(null);
  const [domainError, setDomainError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [openEditModal, setOpenEditModal] = useState(false);

  useEffect(() => {
    const fetchDomain = async () => {
      if (!domainId) return;
      try {
        const res = await fetch("/api/domains/getById", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: domainId }),
        });
        const data = await res.json();

        if (data.error) {
          setDomainError(data.error);
        } else {
          setDomain(data);
        }
      } catch (err) {
        console.error("Error fetching domain:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDomain();
  }, [domainId]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin text-blue-500 w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full"></div>
      </div>
    );
  }

  if (!domain || domainError) {
    return (
      <div className="p-6">
        <p className="text-lg text-red-600 font-semibold">
          {domainError || "ไม่พบโดเมนที่ระบุ"}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-4">
        <Link href="/dashboard/domains">
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded">
            ← ย้อนกลับ
          </button>
        </Link>
      </div>
      <div className="bg-white shadow-md rounded p-6">
        <div className="flex flex-col text-center mb-6 items-center">
          <span className="text-xl font-bold mb-1">Domain Detail</span>
          <Link
            href={domain.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit text-gray-800 font-black text-4xl"
          >
            {domain.url}
          </Link>
          <div className="text-gray-400 text-sm">
            สร้างเมื่อ: {new Date(domain.createdAt).toLocaleDateString()}
          </div>
          <button
            onClick={() => setOpenEditModal(true)}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow"
          >
            แก้ไขโดเมน
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-base font-semibold mb-2">ข้อมูลโดเมน</h2>
            <hr className="my-4" />
            <div className="mb-4">
              <div>
                <span className="font-semibold">ประเภท:</span>{" "}
                {domain.domainType}
              </div>
              <div>
                <span className="font-semibold">ทีม:</span> {domain.domainTeam}
              </div>
              <div>
                <span className="font-semibold">Host:</span> {domain.domainHost}
              </div>
              <div>
                <span className="font-semibold">Provider:</span>{" "}
                {domain.domainProvider}
              </div>
              <div>
                <span className="font-semibold">Cloudflare:</span>{" "}
                {(domain.domainCloudflare ?? "") || "-"}
              </div>
            </div>
          </div>
          <div>
            <div className="mb-4">
              <h2 className="text-base font-semibold mb-2">สถานะ Domain</h2>
              <hr className="my-4" />
              <div>
                <span className="font-semibold">สถานะ : </span>
                {domain.domainStatus}
              </div>
              <div>
                <label className="font-semibold">Redirect URL : </label>
                <Link
                  href={typeof domain.domainRedirect === "string" && domain.domainRedirect.length > 0 ? domain.domainRedirect : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline font-bold"
                >
                  {(domain.domainRedirect ?? "") || "-"}
                </Link>
              </div>
            </div>
            <div className="mt-15">
              <h2 className="text-base font-semibold mb-2">Wordpress</h2>
              <hr className="my-4" />
              <div>
                <label className="font-semibold">User : </label>
                <span className="text-gray-800 mr-2">
                  {domain.wpDetail?.wpUser || "-"}
                </span>
                {domain.wpDetail?.wpUser && (
                  <Button
                    onClick={() => {
                      const wpUser = domain?.wpDetail?.wpUser;
                      if (wpUser) {
                        navigator.clipboard.writeText(wpUser);
                      }
                    }}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    <CopyAllIcon className="inline-block mr-1" />
                  </Button>
                )}
              </div>
              <div>
                <label className="font-semibold">Password : </label>
                <span className="text-gray-800 mr-2">
                  {domain.wpDetail?.wpPassword || "-"}
                </span>
                {domain.wpDetail?.wpPassword && (
                  <Button
                    onClick={() => {
                      const wpPassword = domain?.wpDetail?.wpPassword;
                      if (wpPassword) {
                        navigator.clipboard.writeText(wpPassword);
                      }
                    }}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    <CopyAllIcon className="inline-block mr-1" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {openEditModal && domain && (
        <EditDomainModal
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          domainData={domain}
          onRefresh={() => {
            // Optional: implement actual refresh logic here
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
