"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";

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
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: 'var(--color-bg-subtle)' }}
    >
      {/* Verified Toast */}
      {showVerifiedToast && (
        <div className="toast toast-success" role="alert" aria-live="polite">
          Your email has been verified. You can now log in.
        </div>
      )}

      <main className="w-full max-w-sm flex flex-col items-center justify-center flex-1">
        {/* Logo */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base text-white mb-8"
          style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)' }}
        >
          Ai
        </div>

        {/* Card */}
        <div className="card w-full p-8 animate-fade-in">
          <h1
            className="text-xl font-bold text-center mb-1"
            style={{ color: 'var(--color-text)' }}
          >
            Welcome back
          </h1>
          <p
            className="text-sm text-center mb-6"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Sign in to your AIrena account
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium"
                style={{ color: 'var(--color-text)' }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                className="input"
                required
                aria-invalid={emailTouched && !isValidEmail(email)}
                aria-describedby="email-error"
                autoComplete="email"
              />
              {emailTouched && !isValidEmail(email) && (
                <span
                  id="email-error"
                  className="text-xs"
                  style={{ color: 'var(--color-error)' }}
                  role="alert"
                >
                  Please enter a valid email address.
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium"
                style={{ color: 'var(--color-text)' }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input"
                required
                autoComplete="current-password"
              />
            </div>

            {error && error === "Email not found, please register." ? (
              <div
                className="text-sm text-center flex flex-col gap-2 px-3 py-2.5 rounded-lg"
                style={{
                  color: 'var(--color-error)',
                  background: 'var(--color-error-bg)',
                  border: '1px solid var(--color-error-border)',
                }}
                role="alert"
              >
                {error}
                <button
                  type="button"
                  className="font-semibold underline transition-opacity hover:opacity-80"
                  style={{ color: 'var(--color-text)' }}
                  onClick={() => router.push("/register")}
                >
                  Go to Register
                </button>
              </div>
            ) : error && (
              <div
                className="text-sm text-center px-3 py-2.5 rounded-lg"
                style={{
                  color: 'var(--color-error)',
                  background: 'var(--color-error-bg)',
                  border: '1px solid var(--color-error-border)',
                }}
                role="alert"
              >
                {error}
              </div>
            )}

            {success && (
              <div
                className="text-sm text-center px-3 py-2.5 rounded-lg"
                style={{
                  color: '#15803d',
                  background: 'var(--color-success-bg)',
                  border: '1px solid var(--color-success-border)',
                }}
                role="status"
              >
                {success}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full py-3 text-sm mt-1"
              disabled={loading || !isValidEmail(email) || !password}
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
                    <path d="M22 12a10 10 0 01-10 10" />
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        <p
          className="mt-6 text-center text-sm"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="font-semibold no-underline transition-opacity hover:opacity-80"
            style={{ color: 'var(--color-accent)' }}
          >
            Create account
          </Link>
        </p>
      </main>

      <footer
        className="w-full text-center text-xs py-4"
        style={{ color: 'var(--color-text-muted)' }}
      >
        &copy; {new Date().getFullYear()} AIrena. All rights reserved.
      </footer>
    </div>
  );
}
