'use client';
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/components/providers/auth-provider";
// import LogoutButton from "./logout-button";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase/client";

export default function Navbar() {
  const { user, logout, credits, creditsLoading, creditsError, refetchCredits, loading: authLoading } = useAuth();
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
    } else {
      setProfile(null);
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
        <Link href={user ? "/query" : "/"} className="text-xl font-bold tracking-tight hover:opacity-80 transition flex items-center gap-1 select-none">
          {/* Gradient "AI" */}
          <span
            className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-400 bg-clip-text text-transparent"
            style={{ fontWeight: 800, letterSpacing: '-0.04em', fontSize: "1.45rem" }}
          >
            AI
          </span>
          <span className="text-black ml-1" style={{ letterSpacing: '-0.03em' }}>
            rena
          </span>
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-end gap-4">
        {!user ? (
          <Link href="/login" className="px-4 py-2 rounded-lg bg-black text-white font-semibold shadow hover:bg-[#222] transition">
            Login
          </Link>
        ) : (
          <>
            {creditsLoading ? (
              <div className="hidden sm:block w-24 h-8 bg-gray-200 rounded-md animate-pulse"></div>
            ) : creditsError ? (
              <div className="hidden sm:flex items-center gap-2 text-sm font-semibold text-red-500">
                <span className="px-3 py-1.5 rounded-full bg-red-100 text-red-700">
                  Error loading credits
                </span>
                <button onClick={refetchCredits} className="text-xs underline text-blue-600 hover:text-blue-800">Retry</button>
              </div>
            ) : credits !== null ? (
              <div className="hidden sm:flex items-center gap-2 text-sm font-semibold" title="Each query uses credits based on the model.">
                <span className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700">
                  Credits: <span className="font-bold text-blue-600">{credits.credits}</span>
                </span>
              </div>
            ) : null}
            <Link href="/pricing" className="px-4 py-2 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-all">Pricing</Link>
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-black rounded-full px-2 py-1 hover:bg-[#f5f5f5] transition"
                onClick={() => setDropdownOpen((v) => !v)}
                aria-label="User menu"
              >
                {authLoading ? <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div> : profile?.avatar_url ? (
                  <Image src={profile.avatar_url} alt="avatar" width={32} height={32} className="w-8 h-8 rounded-full object-cover border border-[#e0e0e0]" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#e0e0e0] flex items-center justify-center text-lg font-bold text-black">
                    {profile?.name ? profile.name[0] : (user.email ?? '')[0]}
                  </div>
                )}
                <span className="hidden sm:block font-semibold text-black text-base max-w-[120px] truncate">
                    {authLoading ? <div className="w-20 h-5 bg-gray-200 rounded-md animate-pulse"></div> : profile?.name || (user.email ?? '')}
                </span>
                <svg className="w-4 h-4 ml-1 text-[#888]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-[#e0e0e0] rounded-lg shadow-lg py-2 z-50">
                  <button
                    className="w-full text-left px-4 py-2 text-black hover:bg-[#f5f5f5] transition"
                    onClick={async () => { setDropdownOpen(false); await logout(); }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
