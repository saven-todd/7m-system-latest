"use client";

import {
  Box,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  TextField,
  Button,
  MenuItem,
  IconButton,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDomain } from "@/src/app/server/domains/createDomain";

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

export default function AddDomainPage() {
  const [useWp, setUseWp] = useState(false);
  const [publishWp, setPublish] = useState("");
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const result = await createDomain(formData);

    if (result?.success) {
      localStorage.setItem("successAddDomain", "1");
      router.push("/dashboard/domains");
      console.log("data insert : " + result)
    } else {
      console.error(result?.error);
      alert(`เกิดข้อผิดพลาด: ${result?.error ?? "ไม่ทราบสาเหตุ"}`);
    }
  }

  return (
    <>
      <Box p={4}>
        <Card sx={{ position: "relative" }} className="p-8">
          <CardHeader
            title="เพิ่ม Domain"
            action={
              <IconButton onClick={() => history.back()}>
                <ArrowBackIcon />
              </IconButton>
            }
          />
          <CardContent>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                await handleSubmit(formData);
              }}
            >
              <Box display="flex" flexWrap="wrap" gap={2}>
                <TextField name="url" label="URL" required fullWidth />
                <TextField
                  name="domainType"
                  label="Domain Type"
                  select
                  required
                  defaultValue=""
                  fullWidth
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
                  defaultValue=""
                  fullWidth
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
                  defaultValue=""
                  fullWidth
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
                  defaultValue=""
                  fullWidth
                >
                  <MenuItem value="" disabled>
                    - เลือก -
                  </MenuItem>
                  {domainProvider.map((provider) => (
                    <MenuItem key={provider.key} value={provider.label}>
                      {provider.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  name="domainCloudflare"
                  label="Cloudflare Email"
                  fullWidth
                />

                <TextField
                  name="domainStatus"
                  label="สถานะเผยแพร่"
                  select
                  value={publishWp}
                  onChange={(e) => setPublish(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="publish">เผยแพร่</MenuItem>
                  <MenuItem value="draft">ไม่เผยแพร่</MenuItem>
                  <MenuItem value="redirect">Redirect 301</MenuItem>
                </TextField>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={useWp}
                      name="wpDetail"
                      onChange={(e) => setUseWp(e.target.checked)}
                    />
                  }
                  label="ใช้ WordPress"
                />

                {useWp && (
                  <>
                    <TextField name="wpUser" label="WordPress User" fullWidth />
                    <TextField
                      name="wpPassword"
                      label="WordPress Password"
                      type="password"
                      autoComplete="new-password"
                      fullWidth
                    />
                  </>
                )}
              </Box>
              <CardActions sx={{ justifyContent: "flex-end", mt: 2 }}>
                <Button type="reset" variant="outlined">
                  รีเซ็ต
                </Button>
                <Button type="submit" variant="contained">
                  บันทึก
                </Button>
              </CardActions>
            </form>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
