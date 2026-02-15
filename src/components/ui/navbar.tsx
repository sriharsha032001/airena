'use client';
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/components/providers/auth-provider";
import { useEffect, useState, useRef, useCallback } from "react";
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

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen, handleClickOutside]);

  const initials = profile?.name
    ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : (user?.email ?? '')[0]?.toUpperCase() ?? '?';

  return (
    <nav
      className="glass fixed top-0 left-0 w-full z-30 h-[var(--nav-height)] flex items-center px-5 md:px-8 border-b"
      style={{ borderColor: 'var(--color-border)' }}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex-1 flex items-center">
        <Link
          href="/"
          className="flex items-center gap-2.5 group no-underline"
          aria-label="AIrena Home"
        >
          {/* Logo icon */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm text-white"
            style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)' }}
          >
            Ai
          </div>
          <span
            className="text-lg font-bold tracking-tight"
            style={{ color: 'var(--color-text)' }}
          >
            AIrena
          </span>
        </Link>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-2.5 rounded-full px-2 py-1.5 transition-colors duration-200"
              style={{
                background: dropdownOpen ? 'var(--color-bg-muted)' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (!dropdownOpen) e.currentTarget.style.background = 'var(--color-bg-subtle)';
              }}
              onMouseLeave={(e) => {
                if (!dropdownOpen) e.currentTarget.style.background = 'transparent';
              }}
              onClick={() => setDropdownOpen((v) => !v)}
              aria-label="User menu"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt=""
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                  style={{ border: '2px solid var(--color-border)' }}
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, var(--color-accent) 0%, #818cf8 100%)' }}
                >
                  {initials}
                </div>
              )}
              <span
                className="hidden sm:block font-medium text-sm max-w-[140px] truncate"
                style={{ color: 'var(--color-text)' }}
              >
                {profile?.name || (user.email ?? '')}
              </span>
              <svg
                className="w-3.5 h-3.5 transition-transform duration-200"
                style={{
                  color: 'var(--color-text-muted)',
                  transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 py-1.5 animate-slide-down"
                style={{
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-xl)',
                }}
                role="menu"
                aria-orientation="vertical"
              >
                {/* User info */}
                <div
                  className="px-4 py-2.5 mb-1"
                  style={{ borderBottom: '1px solid var(--color-border)' }}
                >
                  <p
                    className="text-sm font-semibold truncate"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {profile?.name || 'User'}
                  </p>
                  <p
                    className="text-xs truncate mt-0.5"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {user.email}
                  </p>
                </div>

                {/* Logout */}
                <button
                  className="w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-2.5 transition-colors duration-150"
                  style={{ color: 'var(--color-error)' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-error-bg)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  onClick={async () => {
                    setDropdownOpen(false);
                    await logout();
                  }}
                  role="menuitem"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
