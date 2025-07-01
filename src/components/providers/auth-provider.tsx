"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, SupabaseClient, User } from "@supabase/auth-helpers-nextjs";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

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
  refetchCredits: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const router = useRouter();

  const refetchCredits = async () => {
    if (user) {
        const { data } = await supabase
            .from("user_credits")
            .select("credits")
            .eq("id", user.id)
            .single();
        setCredits(data || null);
    }
  };

  useEffect(() => {
    const fetchCredits = async (userId: string) => {
        const { data, error } = await supabase
            .from("user_credits")
            .select("credits")
            .eq("id", userId)
            .single();
        
        if (error && error.code !== 'PGRST116') {
            toast.error("Unable to fetch credits.");
            setCredits(null);
        } else if (data) {
            setCredits(data || null);
        }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null;
        setSession(session);
        setUser(currentUser);
        setLoading(false);

        if (currentUser) {
            fetchCredits(currentUser.id);
        } else {
            setCredits(null);
        }

        if (event === "SIGNED_IN" && currentUser) {
          // Check if user credits exist
          const { data: creditsData, error: selectError } = await supabase
            .from("user_credits")
            .select("id")
            .eq("id", currentUser.id)
            .single();

          // If no credits exist and there's no error other than "not found"
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
              fetchCredits(currentUser.id); // Re-fetch credits after granting
            }
          }
        }
      }
    );

    // Initial session fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setSession(session);
      setLoading(false);
      if (currentUser) {
        fetchCredits(currentUser.id);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setCredits(null);
    router.push("/login");
    toast.success("Logged out successfully.");
    setLoading(false);
  };

  const value = {
    session,
    user,
    loading,
    logout,
    supabase,
    credits,
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