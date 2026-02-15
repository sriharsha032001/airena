"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "react-hot-toast";
import Loader from "@/components/ui/loader";

const RegisterPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();

  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const isStrongPassword = (val: string) => val.length >= 8;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
        toast.error("Please enter your full name.");
        return;
    }
    if (!isValidEmail(email)) {
        toast.error("Please enter a valid email address.");
        return;
    }
    if (!isStrongPassword(password)) {
        toast.error("Password must be at least 8 characters.");
        return;
    }

    setLoading(true);
    // Register with Supabase (email verification enabled in dashboard)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login?verified=1`,
      },
    });
    if (error) {
      toast.error(error.message);
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
    toast.success("Registration successful! Check your inbox to verify your email.");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 relative" style={{ fontFamily: 'Open Sans, ui-sans-serif, sans-serif' }}>
      {loading && <Loader text="Creating your account..." />}
      <main className="w-full max-w-sm flex flex-col items-center justify-center flex-1">
        <h1 className="text-2xl font-bold text-center mb-2 text-black">Create your account</h1>
        <p className="text-sm text-center text-[#6e6e6e] mb-5">
          Already have an account? <a href="/login" className="text-black font-semibold underline hover:opacity-80">Login</a>
        </p>
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
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-black text-white font-bold text-base hover:bg-[#222] focus:ring-2 focus:ring-black focus:outline-none transition disabled:opacity-60 flex items-center justify-center"
            disabled={loading}
            style={{ letterSpacing: 0.5 }}
          >
            {loading ? (
              <svg className="animate-spin mr-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity=".2"/><path d="M22 12a10 10 0 0 1-10 10"/></svg>
            ) : null}
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </main>
      <footer className="w-full text-center text-xs text-[#bbb] mt-12 mb-2">
        © 2025 BrandName. All rights reserved.
      </footer>
    </div>
  );
}

export default RegisterPage; 