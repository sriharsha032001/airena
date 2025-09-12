"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, SupabaseClient, User } from "@supabase/auth-helpers-nextjs";
import { supabase } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-hot-toast";
import useSWR from "swr";

interface UserCredits {
    credits: number;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  logout: () => Promise<void>;
  supabase: SupabaseClient;
  credits: UserCredits | null;
  creditsLoading: boolean;
  creditsError: unknown;
  refetchCredits: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const fetchCredits = async (userId: string | undefined | null) => {
  if (!userId) return null;
  const { data, error } = await supabase
    .from("user_credits")
    .select("credits")
    .eq("id", userId)
    .single();
  if (error && error.code !== 'PGRST116') {
    throw new Error("Unable to fetch credits.");
  }
  return data || null;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // SWR for credits
  const {
    data: credits,
    error: creditsError,
    isLoading: creditsLoading,
    mutate: mutateCredits
  } = useSWR(user ? ["user_credits", user.id] : null, () => fetchCredits(user?.id), {
    revalidateOnFocus: true,
    shouldRetryOnError: false,
  });

  const refetchCredits = () => {
    mutateCredits();
  };

  useEffect(() => {
    const protectedRoutes = ['/query', '/pricing'];
    const isProtectedRoute = protectedRoutes.includes(pathname);

    if (!loading && !user && isProtectedRoute) {
      toast.error("Your session has expired. Please log in again.");
      router.push('/login');
    }
  }, [user, loading, pathname, router]);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null;
        setSession(session);
        setUser(currentUser);
        setLoading(false);
        if (event === "SIGNED_IN" && currentUser) {
          // Check if user credits exist
          const { data: creditsData, error: selectError } = await supabase
            .from("user_credits")
            .select("id")
            .eq("id", currentUser.id)
            .single();
          if (!creditsData && (!selectError || selectError.code === 'PGRST116')) {
            // Grant welcome credits
            const { error: insertError } = await supabase
              .from("user_credits")
              .insert({
                id: currentUser.id,
                email: currentUser.email,
                credits: 20, // Welcome credits
                last_updated: new Date().toISOString(),
              });
            if (insertError) {
              toast.error("Failed to grant welcome credits, please try again.");
            } else {
              toast.success("Welcome! We've added 20 free credits to your account.");
              mutateCredits();
            }
          }
        }
        if (!currentUser) {
          mutateCredits(null, false); // Clear credits on logout
        }
      }
    );

    // Initial session fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setSession(session);
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    // The onAuthStateChange listener will handle setting user/session to null and clearing credits.
    router.push("/login");
    toast.success("Logged out successfully.");
  };

  const value = {
    session,
    user,
    loading,
    logout,
    supabase,
    credits: credits ?? null,
    creditsLoading,
    creditsError,
    refetchCredits,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}; 