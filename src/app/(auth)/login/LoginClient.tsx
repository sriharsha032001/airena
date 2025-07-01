"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("verified") === "1") {
      toast.success("Your email has been verified. You can now log in.");
    }
  }, [searchParams]);

  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailTouched(true);

    if (!isValidEmail(email)) {
        toast.error("Please enter a valid email address.");
        return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      if (error.message.toLowerCase().includes("invalid login credentials")) {
        toast.error("Invalid email or password.");
      } else if (error.message.toLowerCase().includes("email not confirmed")) {
        toast.error("Please verify your email before logging in.");
      } else {
        toast.error(error.message);
      }
      return;
    }
    if (data?.user && !data.user.email_confirmed_at) {
      toast.error("Please verify your email before logging in.");
      return;
    }
    toast.success("Login successful! Redirecting...");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center px-2" style={{ fontFamily: "Open Sans, ui-sans-serif, sans-serif" }}>
      <div className="w-full max-w-5xl flex flex-col md:flex-row shadow-none md:shadow-xl rounded-3xl bg-white md:bg-white/90 overflow-hidden">
        {/* Left Hero Side */}
        <div className="flex-1 flex flex-col justify-center px-8 py-10 bg-white md:bg-gradient-to-b md:from-[#f8fafc] md:to-[#f3f6fa]">
          <div className="max-w-md mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-black leading-tight mb-4">
              AIrena
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold text-black/80 mb-6">
              The Professional Workspace for Multi-Model AI Comparison
            </h2>
            <ul className="list-none space-y-2 text-[#444] text-base md:text-lg font-medium">
              <li>
                • Get instant, side-by-side answers from <b>ChatGPT</b> and <b>Gemini</b>.
              </li>
              <li>
                • Make data-driven decisions, automate research, and stay ahead.
              </li>
            </ul>
            <div className="mt-6 text-xs text-[#8b8b8b]">
              Secure. Fast. Designed for productivity.<br />
              <span className="font-semibold">Ready to experience smarter research?</span>
            </div>
          </div>
        </div>

        {/* Right Login Side */}
        <div className="flex-1 flex flex-col justify-center items-center px-8 py-12 bg-white">
          <div className="w-full max-w-sm mx-auto rounded-2xl shadow-md border border-[#e0e0e0] bg-white p-8">
            <h2 className="text-2xl font-bold text-center mb-1 text-black">Sign in to AIrena</h2>
            <p className="text-center text-[#6e6e6e] text-sm mb-5">
              Secure access to your AI dashboard
            </p>

            <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-semibold text-black">
                  Email
                </label>
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
                  style={{ fontFamily: "inherit", fontSize: "1rem" }}
                />
                {emailTouched && !isValidEmail(email) && (
                  <span id="email-error" className="text-red-500 text-xs mt-1">
                    Please enter a valid email address.
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm font-semibold text-black">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#e0e0e0] text-black bg-white focus:outline-none focus:ring-2 focus:ring-black transition placeholder:text-[#bbb]"
                  required
                  autoComplete="current-password"
                  style={{ fontFamily: "inherit", fontSize: "1rem" }}
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-black text-white font-bold text-base hover:bg-[#222] focus:ring-2 focus:ring-black focus:outline-none transition disabled:opacity-60 flex items-center justify-center mt-2"
                disabled={loading || !isValidEmail(email) || !password}
                style={{ letterSpacing: 0.5 }}
              >
                {loading ? (
                  <svg className="animate-spin mr-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" strokeOpacity=".2" />
                    <path d="M22 12a10 10 0 0 1-10 10" />
                  </svg>
                ) : null}
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-[#666]">
              Don&apos;t have an account?{" "}
              <a href="/register" className="text-black font-semibold underline hover:opacity-80">
                Register
              </a>
            </p>
          </div>
          <footer className="w-full text-center text-xs text-[#bbb] mt-8 mb-2">
            © 2025 AIrena. All rights reserved.
          </footer>
        </div>
      </div>
    </div>
  );
}
