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
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-lg">Loading...</span>
      </div>
    );
  }

  return <>{children}</>;
} 