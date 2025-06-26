'use client';
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import LogoutButton from "./logout-button";

export default function Navbar() {
  const { user } = useAuth();
  return (
    <nav className="fixed top-0 left-0 w-full z-30 bg-white border-b border-[#e0e0e0] h-16 flex items-center px-4 md:px-8" style={{ fontFamily: 'Open Sans, ui-sans-serif, sans-serif' }}>
      <div className="flex-1 flex items-center">
        <Link href="/" className="text-xl font-bold text-black tracking-tight hover:opacity-80 transition">
          AIrena
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-end gap-4">
        {user && (
          <>
            <span className="text-base text-black font-normal truncate max-w-xs">{user.email}</span>
            <LogoutButton />
          </>
        )}
      </div>
    </nav>
  );
} 
