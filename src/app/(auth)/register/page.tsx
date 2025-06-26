"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const isStrongPassword = (val: string) => val.length >= 8;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    // Register with Supabase (email verification enabled in dashboard)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "http://localhost:3000/login",
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    // Insert user details in 'users' table
    await supabase.from("users").insert({
      email,
      name,
      created_at: new Date().toISOString(),
    });
    setLoading(false);
    setSuccess("Check your inbox to verify your email.");
    setTimeout(() => {
      router.push("/login");
    }, 1800);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4" style={{ fontFamily: 'Open Sans, ui-sans-serif, sans-serif' }}>
      <main className="w-full max-w-sm flex flex-col items-center justify-center flex-1">
        <h1 className="text-2xl font-bold text-center mb-2 text-black">Create your account</h1>
        <form onSubmit={handleRegister} className="w-full flex flex-col gap-4 mt-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-semibold text-black">Full Name</label>
            <input
              id="name"
              type="text"
              placeholder="Type your full name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-[#e0e0e0] text-black bg-white focus:outline-none focus:ring-2 focus:ring-black transition placeholder:text-[#bbb]"
              required
              autoComplete="name"
              style={{ fontFamily: 'inherit', fontSize: '1rem' }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-semibold text-black">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Type your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-[#e0e0e0] text-black bg-white focus:outline-none focus:ring-2 focus:ring-black transition placeholder:text-[#bbb]"
              required
              autoComplete="email"
              style={{ fontFamily: 'inherit', fontSize: '1rem' }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-semibold text-black">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Create a password (min 8 chars)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-[#e0e0e0] text-black bg-white focus:outline-none focus:ring-2 focus:ring-black transition placeholder:text-[#bbb]"
              required
              autoComplete="new-password"
              minLength={8}
              style={{ fontFamily: 'inherit', fontSize: '1rem' }}
            />
            {password && !isStrongPassword(password) && (
              <span className="text-red-500 text-xs mt-1">Password must be at least 8 characters.</span>
            )}
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">{success}</div>}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-black text-white font-bold text-base hover:bg-[#222] focus:ring-2 focus:ring-black focus:outline-none transition disabled:opacity-60 flex items-center justify-center"
            disabled={loading || !name || !isValidEmail(email) || !isStrongPassword(password)}
            style={{ letterSpacing: 0.5 }}
          >
            {loading ? (
              <svg className="animate-spin mr-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity=".2"/><path d="M22 12a10 10 0 0 1-10 10"/></svg>
            ) : null}
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-[#666]">
          Already have an account? <a href="/login" className="text-black font-semibold underline hover:opacity-80">Login</a>
        </p>
      </main>
      <footer className="w-full text-center text-xs text-[#bbb] mt-12 mb-2">
        © 2025 BrandName. All rights reserved.
      </footer>
    </div>
  );
} 