'use client';
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import LogoutButton from "./logout-button";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase/client";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<{ name?: string; avatar_url?: string } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.email) {
      supabase
        .from("users")
        .select("name, avatar_url")
        .eq("email", user.email)
        .single()
        .then(({ data }) => {
          setProfile(data || null);
        });
    }
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <nav className="fixed top-0 left-0 w-full z-30 bg-white border-b border-[#e0e0e0] h-16 flex items-center px-4 md:px-8" style={{ fontFamily: 'Open Sans, ui-sans-serif, sans-serif' }}>
      <div className="flex-1 flex items-center">
        <Link href="/" className="text-xl font-bold text-black tracking-tight hover:opacity-80 transition">
          Aural
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-end gap-4">
        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-black rounded-full px-2 py-1 hover:bg-[#f5f5f5] transition"
              onClick={() => setDropdownOpen((v) => !v)}
              aria-label="User menu"
            >
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="avatar" className="w-8 h-8 rounded-full object-cover border border-[#e0e0e0]" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#e0e0e0] flex items-center justify-center text-lg font-bold text-black">
                  {profile?.name ? profile.name[0] : (user.email ?? '')[0]}
                </div>
              )}
              <span className="hidden sm:block font-semibold text-black text-base max-w-[120px] truncate">{profile?.name || (user.email ?? '')}</span>
              <svg className="w-4 h-4 ml-1 text-[#888]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-[#e0e0e0] rounded-lg shadow-lg py-2 z-50">
                {/* <Link href="/profile" className="block px-4 py-2 text-black hover:bg-[#f5f5f5] transition">Profile</Link> */}
                <button
                  className="w-full text-left px-4 py-2 text-black hover:bg-[#f5f5f5] transition"
                  onClick={async () => { setDropdownOpen(false); await logout(); }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
} 
