"use client";
import { useAuth } from "../providers/auth-provider";

export default function LogoutButton() {
  const { logout, loading } = useAuth();
  return (
    <button
      onClick={logout}
      className="py-1 px-4 rounded-md text-sm font-semibold bg-[#f5f5f5] text-[#d32d2f] border border-[#e0e0e0] hover:bg-[#e0e0e0] hover:text-white hover:bg-[#d32d2f] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#d32d2f] disabled:opacity-60"
      disabled={loading}
      style={{ minWidth: 80 }}
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
} 