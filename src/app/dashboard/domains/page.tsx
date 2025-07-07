"use client";

import * as React from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import {
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Button,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useEffect, useState } from "react";

import Link from "next/link";
import { getDomains } from "@/src/app/server/domains/getDomains";

import EditDomainModal from "./EditDomainModal";

// SnackbarContent Alert
import { SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function DomainsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState(false);

  // update domain
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<any>(null);

  // Snackbar Set Close
  const [openSnack, setOpenSnack] = React.useState(false);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnack(false);
  };

  useEffect(() => {
    if (localStorage.getItem("successAddDomain")) {
      setToastOpen(true);
      localStorage.removeItem("successAddDomain");
    }
    if (localStorage.getItem("editSuccess")) {
      setOpenSnack(true);
      localStorage.removeItem("editSuccess");
    }

    getDomains().then((data) => {
      setRows(
        data.map((d) => ({
          id: d.id,
          URL: d.url,
          domainType: d.domainType,
          domainTeam: d.domainTeam,
          domainStatus: d.domainStatus,
          domainHost: d.domainHost,
          domainCloudflare: d.domainCloudflare,
          domainProvider: d.domainProvider,
          wpDetail: d.wpDetail?.wpUser ? true : false,
        }))
      );
    });
  }, []);

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(id);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const columns: GridColDef[] = [
    {
      field: "URL",
      headerName: "URL",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <strong>{params.value}</strong>
          <Box fontSize={12} color="gray">
            Users can use the search bar, filters, and sorting.
          </Box>
        </Box>
      ),
    },
    {
      field: "domainType",
      headerName: "Web Type",
      width: 150,
    },
    {
      field: "domainTeam",
      headerName: "Team",
      width: 150,
    },
    {
      field: "domainStatus",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value == true ? "Published" : "Draft"}
          color={params.value == true ? "success" : "default"}
          size="small"
        />
      ),
    },
    {
      field: "domainHost",
      headerName: "Host",
      width: 150,
    },
    {
      field: "domainCloudflare",
      headerName: "Cloudflare",
      width: 150,
    },
    {
      field: "wpDetail",
      headerName: "WordPress",
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value == true ? "ติดตั้ง WP" : "ยังไม่ติดตั้ง"}
          color={params.value == true ? "success" : "default"}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Action",
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={(e) => handleOpenMenu(e, params.row.id)}
            size="small"
          >
            <MoreVertIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const action = (
    <Button color="secondary" size="small">
      ปิด
    </Button>
  );

  return (
    <>
      <Box p={2}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <h2 className="text-xl font-bold">จัดการ Domains</h2>
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              onClick={async () => {
                const data = await getDomains();
                setRows(
                  data.map((d) => ({
                    id: d.id,
                    URL: d.url,
                    domainType: d.domainType,
                    domainTeam: d.domainTeam,
                    domainStatus: d.domainStatus,
                    domainHost: d.domainHost,
                    domainCloudflare: d.domainCloudflare,
                    wpDetail: d.wpDetail?.wpUser ? true : false,
                  }))
                );
              }}
            >
              Reload
            </Button>
            <Link
              href="/dashboard/domains/add"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              เพิ่ม Domain
            </Link>
          </Box>
        </Box>
        <DataGrid
          rows={rows}
          columns={columns}
          disableRowSelectionOnClick
          checkboxSelection
          autoHeight
        />
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          <MenuItem
            onClick={() => {
              const selected = rows.find((r) => r.id === selectedRow);
              setSelectedDomain(selected);
              setEditModalOpen(true);

              console.log("data : ", JSON.stringify(selected, null, 2));
            }}
          >
            แก้ไข
          </MenuItem>
          <MenuItem>Publish</MenuItem>
          <MenuItem>ลบ</MenuItem>
        </Menu>
        <Snackbar
          open={toastOpen}
          autoHideDuration={4000}
          onClose={() => setToastOpen(false)}
          message="เพิ่ม Domain สำเร็จ!"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        />
        <EditDomainModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          domainData={selectedDomain}
          onRefresh={() => window.location.reload()} // หรือ reload table function
        />
      </Box>
      <Snackbar open={openSnack} autoHideDuration={5000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          แก้ไข Domain สำเร็จ!
        </Alert>
      </Snackbar>
    </>
  );
}
