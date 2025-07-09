"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// MUI
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("🔐 useSession:", session);
    console.log("📦 Status:", status);
  }, [session, status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/dashboard",
    });

    console.log("🔐 signIn response:", res);

    if (res?.ok && res.url) {
      const url = new URL(res.url, window.location.origin); // ใช้ origin ป้องกัน error
      console.log("✅ Redirecting to:", url.pathname);
      setRedirectUrl(url.pathname);
    } else {
      console.error("❌ Login failed:", res);
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (redirectUrl) {
      console.log("🚀 Performing redirect:", redirectUrl);
      router.push(redirectUrl);
    }
  }, [redirectUrl, router]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4 text-black mx-auto">
          ลงชื่อเข้าใช้
        </h1>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4"
          required
          autoComplete="username"
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4"
          required
          autoComplete="current-password"
        />

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          className="text-white w-full py-2 rounded hover:bg-blue-700"
        >
          {loading ? "กำลังเข้าสู่ระบบ..." : "ลงชื่อเข้าใช้"}
        </Button>
      </form>
    </div>
  );
}
