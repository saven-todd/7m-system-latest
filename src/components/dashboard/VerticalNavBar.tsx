"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

type Props = {
  groups?: NavGroup[];
};

export default function VerticalNavBar({
  groups = [
    {
      title: "Dashboard",
      items: [
        { label: "Dashboard", href: "/dashboard/admin" },
      ],
    },
    {
      title: "Hosts & Domains",
      items: [
        { label: "Domains", href: "/dashboard/domains" },
        { label: "Hosts", href: "/dashboard/hosts" },
      ],
    },
  ],
}: Props) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white shadow px-4 py-6">
      <header className="mb-6 flex justify-center">
        <Link href="/dashboard/admin">
          <Image
            src="/assets/images/logo.png"
            alt="7M System Admin Logo"
            width={150}
            height={50}
          />
        </Link>
      </header>
      <nav>
        {groups.map((group) => (
          <div key={group.title} className="mb-4">
            <h3 className="text-shadow-md uppercase font-bold text-gray-800 mb-2">
              {group.title}
            </h3>
            <div className="space-y-2">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block w-full p-2 rounded transition-colors
                    ${pathname === item.href ? "bg-blue-800 text-white" : "text-gray-600 hover:bg-blue-800 hover:text-white"}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
