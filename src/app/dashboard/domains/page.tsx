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
  TextField,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useEffect, useState } from "react";

import Link from "next/link";
import { getDomains } from "@/app/server/domains/getDomains";

import EditDomainModal from "./EditDomainModal";
import DeleteDomainModal from "./components/deleteModal";

// SnackbarContent Alert
import { SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

//icons
import RotateLeftIcon from "@mui/icons-material/RotateLeft";

interface DomainResponse {
  id: string;
  url: string;
  domainType: string;
  domainTeam: string;
  domainStatus: string | null;
  domainRedirect: string | null;
  domainHost: string;
  domainCloudflare: string | null;
  domainProvider: string;
  wpDetail: {
    wpUser: string;
    wpPassword: string;
  } | null;
}

interface DomainRow {
  id: string;
  URL: string;
  domainType: string;
  domainTeam: string;
  domainStatus: string;
  domainRedirect: string;
  domainHost: string;
  domainCloudflare: string;
  domainProvider: string;
  wpDetail: boolean;
}

export default function DomainsPage() {
  const [rows, setRows] = useState<DomainRow[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState(false);

  // update domain
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<DomainRow | null>(null);
  // delete domain
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Snackbar Set Close
  const [openSnack, setOpenSnack] = React.useState(false);

  // loading state
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const filteredRows = rows.filter((row) =>
    row.URL.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        data.map((d: any) => ({
          id: d.id,
          URL: d.url,
          domainType: d.domainType,
          domainTeam: d.domainTeam,
          domainStatus: d.domainStatus ?? "draft",
          domainRedirect: d.domainRedirect ?? "",
          domainHost: d.domainHost,
          domainCloudflare: d.domainCloudflare ?? "",
          domainProvider: d.domainProvider,
          wpDetail: d.wpDetail && typeof d.wpDetail === "object" && "wpUser" in d.wpDetail && d.wpDetail.wpUser ? true : false,
        }))
      );
      setLoading(false);
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
          <Link href={`/dashboard/domains/view?id=${params.row.id}`}>
            <strong>{params.value}</strong>
          </Link>
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
          label={
            params.value === "publish"
              ? "Published"
              : params.value === "redirect"
              ? "Redirect"
              : "Draft"
          }
          color={
            params.value === "publish"
              ? "success"
              : params.value === "redirect"
              ? "warning"
              : "default"
          }
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

  return (
    <>
      <Box p={2}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          gap={1}
        >
          <h2 className="text-xl font-bold">จัดการ Domains</h2>

          <Box display="flex" width={900} gap={1} justifyContent="flex-end">
            <TextField
              label="ค้นหา Domain"
              variant="outlined"
              sx={{ width: 300, backgroundColor: "#fff" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหา URL หรือชื่อ Domain"
            />
            <Button
              variant="outlined"
              sx={{ width: 60 }}
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                const data = await getDomains();
                setRows(
                  data.map((d: any) => ({
                    id: d.id,
                    URL: d.url,
                    domainType: d.domainType,
                    domainTeam: d.domainTeam,
                    domainStatus: d.domainStatus ?? "draft",
                    domainRedirect: d.domainRedirect ?? "",
                    domainHost: d.domainHost,
                    domainCloudflare: d.domainCloudflare ?? "",
                    domainProvider: d.domainProvider,
                    wpDetail: d.wpDetail && typeof d.wpDetail === "object" && "wpUser" in d.wpDetail && d.wpDetail.wpUser ? true : false,
                  }))
                );
                setLoading(false);
              }}
            >
              <RotateLeftIcon />
            </Button>
            <Link
              href="/dashboard/domains/add"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              style={{
                width: 150,
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
              }}
            >
              เพิ่ม Domain
            </Link>
          </Box>
        </Box>
        <Box mb={2}></Box>
        {loading ? (
          <Box>
            {/* <Skeleton variant="rounded" width="100%" height={200} /> */}
            <div className="p-6 flex items-center justify-center">
              <div className="animate-spin text-blue-500 w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full"></div>
            </div>
          </Box>
        ) : (
          <DataGrid
            rows={filteredRows}
            columns={columns}
            disableRowSelectionOnClick
            checkboxSelection
            autoHeight
          />
        )}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          <MenuItem
            onClick={() => {
              if (selectedRow) {
                const selected = rows.find((r) => r.id === selectedRow);
                if (selected) {
                  setSelectedDomain(selected);
                  setEditModalOpen(true);
                }
              }
            }}
          >
            แก้ไข
          </MenuItem>
          <MenuItem>Publish</MenuItem>
          <MenuItem
            onClick={() => {
              if (selectedRow) {
                const selected = rows.find((r) => r.id === selectedRow);
                if (selected) {
                  setSelectedDomain(selected);
                  setDeleteModalOpen(true);
                }
              }
            }}
          >
            ลบ
          </MenuItem>
        </Menu>
        <Snackbar
          open={toastOpen}
          autoHideDuration={4000}
          onClose={() => setToastOpen(false)}
          message="เพิ่ม Domain สำเร็จ!"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        />
        {selectedDomain && (
          <EditDomainModal
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            domainData={selectedDomain}
            onRefresh={() => window.location.reload()} // หรือ reload table function
          />
        )}
        {selectedDomain && (
          <DeleteDomainModal
            open={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            domainData={selectedDomain}
            onRefresh={async () => {
              setLoading(true);
              const data = await getDomains();
              setRows(
                data.map((d: any) => ({
                  id: d.id,
                  URL: d.url,
                  domainType: d.domainType,
                  domainTeam: d.domainTeam,
                  domainStatus: d.domainStatus ?? "draft",
                  domainRedirect: d.domainRedirect ?? "",
                  domainHost: d.domainHost,
                  domainCloudflare: d.domainCloudflare ?? "",
                  domainProvider: d.domainProvider,
                  wpDetail: d.wpDetail && typeof d.wpDetail === "object" && "wpUser" in d.wpDetail && d.wpDetail.wpUser ? true : false,
                }))
              );
              setLoading(false);
            }}
          />
        )}
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
