"use client";

import { Box } from "@mui/material";
import React from "react";

// This is the main page for the hosts management section
// It can be used to display a list of hosts, add new hosts, etc.

export default function HostsPage() {
  return (
    <Box sx={{ display: "flex",justifyContent: "space-between", gap: 2, my: "2rem" }}>
      <div className="p-6 bg-white rounded shadow w-full">
        <label className="text-2xl font-bold">จัดการข้อมูล Host</label>
        <p className="mt-2 text-gray-600">This is the hosts dashboard page.</p>
      </div>
      <div className="p-6 bg-white rounded shadow w-full">
        <label className="text-2xl font-bold">จัดการข้อมูล Domain Name Register</label>
        <p className="mt-2 text-gray-600">This is the hosts dashboard page.</p>
      </div>
      <div className="p-6 bg-white rounded shadow w-full">
        <label className="text-2xl font-bold">จัดการ Cloudflare</label>
        <p className="mt-2 text-gray-600">This is the hosts dashboard page.</p>
      </div>
      <div className="p-6 bg-white rounded shadow w-full">
        <label className="text-2xl font-bold">จัดการข้อมูล อื่นๆ</label>
        <p className="mt-2 text-gray-600">This is the hosts dashboard page.</p>
      </div>
    </Box>
  );
}
