// app/test/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { redirect } from "next/navigation";

export default async function TestPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <pre>{JSON.stringify(session, null, 2)}</pre>;
}
