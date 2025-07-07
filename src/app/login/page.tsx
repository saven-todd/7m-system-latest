// app/login/page.tsx
"use client";

import { useState } from "react";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("🟡 Signin attempt:", { email, password });

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/dashboard", // ✅ เส้นทางหลังเข้าสู่ระบบ
    });

    console.log("🟢 signIn result:", res);

    if (res?.error) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      setLoading(false);
    } else {
      router.push(res?.url || "/dashboard/admin");
    }
  };

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
          id="email-input"
          label="Email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4"
          required
          autoComplete="username" // ใช้ username แทน
        />

        <TextField
          id="password-input"
          label="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4"
          required
          autoComplete="new-password" // ใช้ new-password แทน
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
