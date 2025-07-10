"use client";

import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

// NavBar
import NavbarHorizon from "@/components/dashboard/NavbarHorizon";

export default function AdminDashboardPage() {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("th-TH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
    <NavbarHorizon />
      <div className="space-y-6">
        {/* Congratulations Card */}
        <Box>
          <CardContent className="text-gray-800">
            <Typography
              gutterBottom
              sx={{ color: "text.secondary", fontSize: 14 }}
            >
              {formattedDate}
            </Typography>
            <Typography variant="h5" component="div" className="text-gray-800">
              ประกาศ
            </Typography>
            <Typography variant="body2">
              well meaning and kindly.
              <br />
              {'"a benevolent smile"'}
            </Typography>
          </CardContent>
        </Box>
        {/* Statistics cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded shadow p-4">
            <div className="text-purple-600">245k Sales</div>
          </div>
          <div className="bg-white rounded shadow p-4">
            <div className="text-green-600">12.5k Customers</div>
          </div>
          <div className="bg-white rounded shadow p-4">
            <div className="text-yellow-600">1.54k Products</div>
          </div>
          <div className="bg-white rounded shadow p-4">
            <div className="text-blue-600">$88k Revenue</div>
          </div>
        </section>

        {/* Weekly Overview */}
        <section className="bg-white rounded shadow p-4">
          <h3 className="font-semibold mb-2">Weekly Overview</h3>
          <div className="h-40 bg-gray-200 rounded">[ Chart Here ]</div>
          <div className="mt-2 text-gray-600">45% sales performance</div>
        </section>

        {/* Total Earnings and Other Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded shadow p-4">
            <h3 className="font-semibold mb-2">Total Earnings</h3>
            <div className="text-2xl">$24,895</div>
          </div>
          <div className="bg-white rounded shadow p-4">Total Profit $25.6k</div>
          <div className="bg-white rounded shadow p-4">Refunds $78</div>
        </section>
      </div>
    </>
  );
}
