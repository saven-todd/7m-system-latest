"use client";

import * as React from "react";

import {
  Modal,
  Box,
  Button,
  TextField,
  Divider,
  Typography,
} from "@mui/material";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";

// SnackBar
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";


const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  border: "2px solid #000",
  color: "#2a2a2a",
  boxShadow: 24,
  p: 4,
};

interface DeleteDomainModalProps {
  open: boolean;
  onClose: () => void;
  domainData: any;
  onRefresh: () => void;
}

export default function DeleteDomainModal({
  open,
  onClose,
  domainData,
  onRefresh,
}: DeleteDomainModalProps) {
  
  // รวม State สำหรับคำสั่ง
  // State สำหรับ Confirm Delete
  const [confirmInput, setConfirmInput] = React.useState("");

  // State สำหรับ SnackBar Report Alert Error ในการลบข้อมูล
  const [errorOpen, setErrorOpen] = React.useState(false);

  // State Action ยืนยันข้อมูลการลบ ก่อนส่งไปที่ Server
  const handleDelete = async () => {
    if (confirmInput !== domainData?.URL) {
      alert("กรุณาพิมพ์ URL ให้ถูกต้องเพื่อยืนยันการลบ");
      return;
    }

    try {
      const response = await fetch("/api/domains/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: domainData.id }),
      });
      
      if (!response.ok) {
        console.error("❌ Network error:", response.status);
        setErrorOpen(true);
        return;
      }

      let res: any = {};
      try {
        res = await response.json();
      } catch (err) {
        console.error("❌ ไม่สามารถแปลง response เป็น JSON:", err);
        setErrorOpen(true);
        return;
      }

      if (res.success) {
        onRefresh();
        onClose();
      } else {
        setErrorOpen(true);
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการลบ:", error);
      alert("เกิดข้อผิดพลาดในการลบ");
    }
  };
  console.log("🆔 domainData.id:", domainData?.id);
  
  // แสดงผล Modal
  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <Box sx={style}>
          <Typography id="delete-modal-title" variant="h5" component="h2">
            <b>ยืนยันการลบ Domain</b>
          </Typography>
          <Typography id="delete-modal-description" sx={{ mt: 1 }}>
            คุณแน่ใจหรือไม่ว่าต้องการลบโดเมนนี้:
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box
            id="content-url"
            className="w-full flex items-center justify-between pl-4 py-2 my-3 bg-red-400 rounded-md"
          >
            <strong id="url">{domainData?.URL}</strong>
            <Button
              size="small"
              variant="text"
              onClick={() => {
                navigator.clipboard.writeText(domainData?.URL || "");
              }}
            >
              <ContentCopyIcon className="text-gray-600" />
            </Button>
          </Box>
          <TextField
            id="confirm-delete"
            label="พิมพ์ URL เพื่อยืนยัน"
            variant="outlined"
            fullWidth
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            error={confirmInput.length > 0 && confirmInput !== domainData?.URL}
            helperText={
              confirmInput.length > 0 && confirmInput !== domainData?.URL
                ? "URL ไม่ตรง กรุณาตรวจสอบอีกครั้ง"
                : " "
            }
          />
          <Box display="flex" justifyContent="flex-end" gap={1} mt={3}>
            <Button variant="outlined" onClick={onClose}>
              ยกเลิก
            </Button>
            <Button variant="contained" color="error" onClick={handleDelete}>
              ลบ
            </Button>
          </Box>
        </Box>
      </Modal>
      <Snackbar
        open={errorOpen}
        autoHideDuration={3000}
        onClose={() => setErrorOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setErrorOpen(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          ไม่สามารถลบข้อมูลได้
        </Alert>
      </Snackbar>
    </>
  );
}
