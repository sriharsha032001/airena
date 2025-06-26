"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    // Initial load
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setLoading(false);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Post-login user existence check (for Google OAuth)
  useEffect(() => {
    // Only run if user is logged in
    if (!user) return;
    // Only run on /login or root (not /register)
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/register")) return;
    // Only run for Google OAuth (user has no app_metadata.provider for email/password)
    const provider = (user as User & { app_metadata?: { provider?: string } })?.app_metadata?.provider;
    if (provider !== "google") return;
    // Check if user exists in 'users' table
    (async () => {
      const { data } = await supabase
        .from("users")
        .select("id")
        .eq("email", user.email)
        .single();
      if (data && data.id) {
        // User exists, update last_login
        await supabase.from("users").update({ last_login: new Date().toISOString() }).eq("id", data.id);
        window.location.href = "/#";
      } else {
        // User does not exist, redirect to register with pre-filled email
        window.location.href = `/register?email=${encodeURIComponent(user.email ?? "")}`;
      }
    })();
  }, [user]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) throw error;
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) throw error;
  };

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
} 