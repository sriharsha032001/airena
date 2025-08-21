"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showVerifiedToast, setShowVerifiedToast] = useState(false);

  useEffect(() => {
    // Show toast if redirected from email verification
    if (searchParams.get("verified") === "1") {
      setShowVerifiedToast(true);
      setTimeout(() => setShowVerifiedToast(false), 3500);
    }
  }, [searchParams]);

  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailTouched(true);
    setLoading(true);
    setError("");
    setSuccess("");
    // Try to sign in
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      if (error.message.toLowerCase().includes("invalid login credentials")) {
        setError("Email not found, please register.");
      } else if (error.message.toLowerCase().includes("email not confirmed")) {
        setError("Please verify your email before logging in.");
      } else {
        setError(error.message);
      }
      return;
    }
    // Check if email is confirmed
    if (data?.user && !data.user.email_confirmed_at) {
      setError("Please verify your email before logging in.");
      return;
    }
    setSuccess("Login successful! Redirecting...");
    setTimeout(() => {
      router.push("/#");
    }, 1000);
  };

  return (
    
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4" style={{ fontFamily: 'Open Sans, ui-sans-serif, sans-serif' }}>
      <main className="w-full max-w-sm flex flex-col items-center justify-center flex-1">
        <h1 className="text-2xl font-bold text-center mb-2 text-black">Sign in to AIrena</h1>
        {showVerifiedToast && (
          <div className="w-full mb-4 p-3 rounded-lg bg-green-50 text-green-800 text-center text-sm font-semibold border border-green-200 transition">
            Your email has been verified. You can now log in.
          </div>
        )}
        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4 mt-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-semibold text-black">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Type your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              className="w-full px-4 py-3 rounded-lg border border-[#e0e0e0] text-black bg-white focus:outline-none focus:ring-2 focus:ring-black transition placeholder:text-[#bbb]"
              required
              aria-invalid={emailTouched && !isValidEmail(email)}
              aria-describedby="email-error"
              autoComplete="email"
              style={{ fontFamily: 'inherit', fontSize: '1rem' }}
            />
            {emailTouched && !isValidEmail(email) && (
              <span id="email-error" className="text-red-500 text-xs mt-1">Please enter a valid email address.</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-semibold text-black">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-[#e0e0e0] text-black bg-white focus:outline-none focus:ring-2 focus:ring-black transition placeholder:text-[#bbb]"
              required
              autoComplete="current-password"
              style={{ fontFamily: 'inherit', fontSize: '1rem' }}
            />
          </div>
          {error && error === "Email not found, please register." ? (
            <div className="text-red-500 text-sm text-center flex flex-col gap-2">
              {error}
              <button
                type="button"
                className="underline text-black font-semibold hover:opacity-80"
                onClick={() => router.push("/register")}
              >
                Go to Register
              </button>
            </div>
          ) : error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          {success && <div className="text-green-600 text-sm text-center">{success}</div>}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-black text-white font-bold text-base hover:bg-[#222] focus:ring-2 focus:ring-black focus:outline-none transition disabled:opacity-60 flex items-center justify-center"
            disabled={loading || !isValidEmail(email) || !password}
            style={{ letterSpacing: 0.5 }}
          >
            {loading ? (
              <svg className="animate-spin mr-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity=".2"/><path d="M22 12a10 10 0 0 1-10 10"/></svg>
            ) : null}
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-[#666]">
          Don&apos;t have an account? <a href="/register" className="text-black font-semibold underline hover:opacity-80">Register</a>
        </p>
      </main>
      <footer className="w-full text-center text-xs text-[#bbb] mt-12 mb-2">
        © 2025 BrandName. All rights reserved.
      </footer>
    </div>
  );
} 