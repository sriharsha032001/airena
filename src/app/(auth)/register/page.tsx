"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";

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
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "/login",
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
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
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: 'var(--color-bg-subtle)' }}
    >
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
            Create your account
          </h1>
          <p
            className="text-sm text-center mb-6"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Get started with AIrena for free
          </p>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="name"
                className="text-sm font-medium"
                style={{ color: 'var(--color-text)' }}
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
                className="input"
                required
                autoComplete="name"
              />
            </div>

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
                className="input"
                required
                autoComplete="email"
              />
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
                placeholder="Min. 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input"
                required
                autoComplete="new-password"
                minLength={8}
              />
              {password && !isStrongPassword(password) && (
                <div className="flex items-center gap-1.5">
                  <div
                    className="h-1 flex-1 rounded-full"
                    style={{ background: 'var(--color-error)' }}
                  />
                  <div
                    className="h-1 flex-1 rounded-full"
                    style={{ background: 'var(--color-border)' }}
                  />
                  <div
                    className="h-1 flex-1 rounded-full"
                    style={{ background: 'var(--color-border)' }}
                  />
                  <span className="text-xs ml-1" style={{ color: 'var(--color-error)' }}>
                    Too short
                  </span>
                </div>
              )}
              {password && isStrongPassword(password) && (
                <div className="flex items-center gap-1.5">
                  <div
                    className="h-1 flex-1 rounded-full"
                    style={{ background: 'var(--color-success)' }}
                  />
                  <div
                    className="h-1 flex-1 rounded-full"
                    style={{ background: 'var(--color-success)' }}
                  />
                  <div
                    className="h-1 flex-1 rounded-full"
                    style={{ background: password.length >= 12 ? 'var(--color-success)' : 'var(--color-border)' }}
                  />
                  <span className="text-xs ml-1" style={{ color: 'var(--color-success)' }}>
                    {password.length >= 12 ? 'Strong' : 'Good'}
                  </span>
                </div>
              )}
            </div>

            {error && (
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
              disabled={loading || !name || !isValidEmail(email) || !isStrongPassword(password)}
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
                    <path d="M22 12a10 10 0 01-10 10" />
                  </svg>
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>
        </div>

        <p
          className="mt-6 text-center text-sm"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold no-underline transition-opacity hover:opacity-80"
            style={{ color: 'var(--color-accent)' }}
          >
            Sign in
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
