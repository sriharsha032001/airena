"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-provider";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ background: 'var(--color-bg)' }}
      >
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white"
            style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)' }}
          >
            Ai
          </div>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--color-accent)', animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--color-accent)', animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--color-accent)', animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
