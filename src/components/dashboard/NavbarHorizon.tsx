"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@mui/material";

export default function NavbarHorizon() {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !(modalRef.current as HTMLElement).contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="w-full bg-white shadow px-4 py-2 flex justify-between items-center rounded-b-md">
      {/* Logo */}
      <div className="font-bold text-xl text-blue-600">
        <Link href="/">7M System</Link>
      </div>

      {/* Right Side */}
      <div className="relative">
        {/* Profile image */}
        <Button onClick={() => setIsOpen((prev) => !prev)}>
          <Image
            src="/assets/images/profiles/profile.png"
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full cursor-pointer h-[40px]"
            style={{ objectFit: "cover", objectPosition: "top center" }}
          />
        </Button>

        {/* Modal */}
        {isOpen && (
          <div
            ref={modalRef}
            className="absolute right-0 mt-2 w-48 bg-white rounded shadow border z-10 text-gray-800"
          >
            <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">
              Profile
            </Link>
            <Link
              href="/settings"
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Settings
            </Link>
            <hr className="my-2 border-gray-200 mx-auto w-11/12" />
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
              >
                Logout
              </button>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
}
