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

import Divider from "@mui/material/Divider";

interface DomainData {
  id: string | number;
  URL?: string;
  url?: string;
  domainType?: string;
  domainTeam?: string;
  domainHost?: string;
  domainProvider?: string;
  domainCloudflare?: string;
  domainStatus?: string;
  wpUser?: string;
  wpPassword?: string;
  redirectUrl?: string;
}

interface EditDomainModalProps {
  open: boolean;
  onClose: () => void;
  domainData: DomainData;
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
  const [formData, setFormData] = useState({
    url: "",
    domainType: "",
    domainTeam: "",
    domainHost: "",
    domainProvider: "",
    domainCloudflare: "",
    domainStatus: "",
    wpUser: "",
    wpPassword: "",
  });

  const [redirectUrl, setRedirectUrl] = useState("");
  const [showWpFields, setShowWpFields] = useState(false);

  useEffect(() => {
    if (domainData) {
      setFormData({
        url: domainData.URL || "",
        domainType: domainData.domainType || "",
        domainTeam: domainData.domainTeam || "",
        domainHost: domainData.domainHost || "",
        domainProvider: domainData.domainProvider || "",
        domainCloudflare: domainData.domainCloudflare || "",
        domainStatus: domainData.domainStatus || "",
        wpUser: domainData.wpUser || "",
        wpPassword: "",
      });
      setRedirectUrl(domainData.redirectUrl || "");
    }
  }, [domainData]);

  async function handleSubmit() {
    const fd = new FormData();
    const finalData = {
      ...formData,
      wpUser: showWpFields ? formData.wpUser : domainData.wpUser || "",
      wpPassword: showWpFields ? formData.wpPassword : "",
    };

    Object.entries(finalData).forEach(([k, v]) => {
      fd.append(k, v.toString());
    });
    fd.append("redirectUrl", redirectUrl);
    const result = await updateDomain(domainData.id.toString(), fd);
    if (result.success) {
      onRefresh();
      onClose();
    } else {
      alert(result.error);
    }
  }

  console.log("Domain Data:", domainData);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      className="rounded-b-lg"
    >
      <DialogTitle sx={{ fontSize: 34, fontWeight: 'bold' }}>แก้ไข Domain</DialogTitle>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 3, padding: 2 }}
      >
        <Divider variant="middle" sx={{ pt: 1 }} />
        <TextField
          name="url"
          label="URL"
          sx={{ pt: 1 }}
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
        <TextField
          name="domainStatus"
          label="สถานะเผยแพร่"
          select
          value={formData.domainStatus}
          onChange={(e) =>
            setFormData({ ...formData, domainStatus: e.target.value })
          }
        >
          <MenuItem value="publish">เผยแพร่</MenuItem>
          <MenuItem value="draft">ไม่เผยแพร่</MenuItem>
          <MenuItem value="redirect">Redirect 301</MenuItem>
        </TextField>
        {formData.domainStatus === "redirect" && (
          <TextField
            name="redirectUrl"
            label="URL สำหรับ Redirect 301"
            value={redirectUrl}
            onChange={(e) => setRedirectUrl(e.target.value)}
            fullWidth
          />
        )}
        <FormControlLabel
          control={
            <Checkbox
              checked={showWpFields}
              onChange={(e) => setShowWpFields(e.target.checked)}
            />
          }
          label="แก้ไขข้อมูล WordPress"
        />
        {showWpFields && (
          <>
            <TextField
              name="wpUser"
              label="WordPress User"
              value={formData.wpUser}
              onChange={(e) =>
                setFormData({ ...formData, wpUser: e.target.value })
              }
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
          </>
        )}
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
