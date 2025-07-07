"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  MenuItem,
} from "@mui/material";
import { useState, useEffect } from "react";
import { updateDomain } from "@/src/app/server/domains/updateDomain";

interface EditDomainModalProps {
  open: boolean;
  onClose: () => void;
  domainData: any;
  onRefresh: () => void;
}

const domainTypes = [
  { key: "moneysite", label: "Money Site" },
  { key: "ns", label: "NS" },
  { key: "pbn", label: "PBN" },
];

const domainTeams = [
  { key: "7m", label: "7M" },
  { key: "center-x", label: "Center X" },
  { key: "rca", label: "RCA" },
];

const domainProvider = [
  { key: "godaddy", label: "Godaddy" },
  { key: "namecheap", label: "Namecheap" },
  { key: "other", label: "Other" },
];

const hosts = [
  { key: "aws", label: "AWS" },
  { key: "ls", label: "AWS Lightsail" },
  { key: "wpx", label: "WPX" },
  { key: "plesk", label: "Plesk" },
  { key: "digitalocean", label: "DigitalOcean" },
  { key: "hostinger", label: "Hostinger" },
];

export default function EditDomainModal({
  open,
  onClose,
  domainData,
  onRefresh,
}: EditDomainModalProps) {

console.log("ข้อมูลส่งมา :\n" + JSON.stringify(domainData, null, 2));

  const [formData, setFormData] = useState({
    url: "",
    domainType: "",
    domainTeam: "",
    domainHost: "",
    domainProvider: "",
    domainCloudflare: "",
    domainStatus: false,
    wpUser: "",
    wpPassword: "",
  });

  useEffect(() => {
    

    if (domainData) {
      setFormData({
        url: domainData.URL || "",
        domainType: domainData.domainType || "",
        domainTeam: domainData.domainTeam || "",
        domainHost: domainData.domainHost || "",
        domainProvider: domainData.domainProvider || "",
        domainCloudflare: domainData.domainCloudflare || "",
        domainStatus: domainData.domainStatus || false,
        wpUser: domainData.wpUser || "",
        wpPassword: "",
      });
    }
  }, [domainData]);

  async function handleSubmit() {
    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => fd.append(k, v.toString()));
    const result = await updateDomain(domainData.id, fd);
    if (result.success) {
      onRefresh();
      onClose();
    } else {
      alert(result.error);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      className="rounded-b-lg"
    >
      <DialogTitle>แก้ไข Domain</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          name="url"
          label="URL"
          defaultValue={domainData?.url || ""}
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          required
        />
        <TextField
          name="domainType"
          label="Domain Type"
          select
          value={formData.domainType}
          onChange={(e) =>
            setFormData({ ...formData, domainType: e.target.value })
          }
          required
        >
          <MenuItem value="" disabled>
            - เลือก -
          </MenuItem>
          {domainTypes.map((type) => (
            <MenuItem key={type.key} value={type.label}>
              {type.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          name="domainTeam"
          label="Domain Team"
          select
          value={formData.domainTeam}
          onChange={(e) =>
            setFormData({ ...formData, domainTeam: e.target.value })
          }
        >
          <MenuItem value="" disabled>
            - เลือก -
          </MenuItem>
          {domainTeams.map((team) => (
            <MenuItem key={team.key} value={team.label}>
              {team.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          name="domainHost"
          label="Domain Host"
          select
          value={formData.domainHost}
          onChange={(e) =>
            setFormData({ ...formData, domainHost: e.target.value })
          }
        >
          <MenuItem value="" disabled>
            - เลือก -
          </MenuItem>
          {hosts.map((host) => (
            <MenuItem key={host.key} value={host.label}>
              {host.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          name="domainProvider"
          label="Domain Provider"
          select
          value={formData.domainProvider}
          onChange={(e) =>
            setFormData({ ...formData, domainProvider: e.target.value })
          }
        >
          <MenuItem value="" disabled>
            - เลือก -
          </MenuItem>
          {domainProvider.map((prov) => (
            <MenuItem key={prov.key} value={prov.label}>
              {prov.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          name="domainCloudflare"
          label="Cloudflare Email"
          value={formData.domainCloudflare}
          onChange={(e) =>
            setFormData({ ...formData, domainCloudflare: e.target.value })
          }
        />
        <FormControlLabel
          control={
            <Checkbox
              name="domainStatus"
              checked={formData.domainStatus}
              onChange={(e) =>
                setFormData({ ...formData, domainStatus: e.target.checked })
              }
            />
          }
          label="สถานะ เผยแพร่"
        />
        <TextField
          name="wpUser"
          label="WordPress User"
          value={formData.wpUser}
          onChange={(e) => setFormData({ ...formData, wpUser: e.target.value })}
        />
        <TextField
          name="wpPassword"
          label="WordPress Password"
          type="password"
          value={formData.wpPassword}
          onChange={(e) =>
            setFormData({ ...formData, wpPassword: e.target.value })
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>ยกเลิก</Button>
        <Button variant="contained" onClick={handleSubmit}>
          บันทึก
        </Button>
      </DialogActions>
    </Dialog>
  );
}
