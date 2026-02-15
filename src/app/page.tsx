"use client";
import ProtectedRoute from "@/components/providers/protected-route";
import { useAuth } from "@/components/providers/auth-provider";
import { useState } from "react";
import QueryForm from "@/components/forms/query-form";
import ResponsesPanel from "../components/ui/responses-panel";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { loading } = useAuth();
  const [query, setQuery] = useState("");
  const [selectedModels, setSelectedModels] = useState<string[]>(["chatgpt"]);
  const [geminiResponse, setGeminiResponse] = useState<{ text: string; time: number } | null>(null);
  const [chatgptResponse, setChatgptResponse] = useState<{ text: string; time: number } | null>(null);
  const [comparisonVerdict, setComparisonVerdict] = useState<{ verdict: string; analysis: string; error?: string } | null>(null);
  const [loadingCompare, setLoadingCompare] = useState(false);

  const showActionButtons = !!geminiResponse || !!chatgptResponse;

  const handleClearAll = () => {
    setQuery("");
    setSelectedModels(["chatgpt"]);
    setGeminiResponse(null);
    setChatgptResponse(null);
    setComparisonVerdict(null);
  };

  const handleCompare = async () => {
    if (!geminiResponse || !chatgptResponse) return;
    setLoadingCompare(true);
    setComparisonVerdict(null);
    try {
      const responses = [
        { model: "gemini", text: geminiResponse.text },
        { model: "chatgpt", text: chatgptResponse.text },
      ];
      const res = await fetch("/api/llm/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses, prompt: query }),
      });
      const data = await res.json();
      if (data.error) {
        setComparisonVerdict({ verdict: '', analysis: '', error: data.error });
      } else {
        setComparisonVerdict({ verdict: data.verdict, analysis: data.analysis });
      }
    } catch (err: unknown) {
      setComparisonVerdict({
        verdict: '',
        analysis: '',
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    } finally {
      setLoadingCompare(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--color-bg)' }}>
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white"
            style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)' }}
          >
            Ai
          </div>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--color-accent)', animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--color-accent)', animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--color-accent)', animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div
        className="w-full min-h-screen flex flex-col items-center px-4 md:px-8 pb-8"
        style={{ background: 'var(--color-bg)' }}
      >
        {/* Hero Section */}
        <section className="w-full max-w-4xl flex flex-col items-center text-center pt-10 pb-8 animate-fade-in-up">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-5"
            style={{
              background: 'var(--color-accent-light)',
              color: 'var(--color-accent)',
              border: '1px solid var(--color-accent)',
              borderColor: 'rgba(99, 102, 241, 0.2)',
            }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            </svg>
            Multi-LLM Comparison
          </div>
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3"
            style={{ color: 'var(--color-text)', letterSpacing: '-0.025em', lineHeight: '1.15' }}
          >
            Ask AI <span className="gradient-text">Anything</span>
          </h1>
          <p
            className="text-base md:text-lg max-w-xl"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Compare responses from multiple AI models side by side. Faster research, better answers.
          </p>
        </section>

        {/* Action Buttons */}
        <AnimatePresence>
          {showActionButtons && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-3 mb-6"
            >
              <button
                className="btn-primary text-sm"
                onClick={handleCompare}
                disabled={loadingCompare || !geminiResponse || !chatgptResponse}
              >
                {loadingCompare ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
                      <path d="M22 12a10 10 0 01-10 10" />
                    </svg>
                    Comparing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                    Compare Responses
                  </>
                )}
              </button>
              <button
                className="btn-secondary text-sm"
                onClick={handleClearAll}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear All
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Grid Layout */}
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
          {/* Left: Sticky Query Input */}
          <div className="lg:col-span-1 flex flex-col gap-6 lg:sticky lg:top-[calc(var(--nav-height)+24px)] h-fit">
            <QueryForm
              query={query}
              setQuery={setQuery}
              selectedModels={selectedModels}
              setSelectedModels={setSelectedModels}
              setGeminiResponse={setGeminiResponse}
              setChatgptResponse={setChatgptResponse}
              setComparisonVerdict={setComparisonVerdict}
            />
          </div>

          {/* Right: Response Panels */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-6">
              <ResponsesPanel modelKey="gemini" response={geminiResponse} />
            </div>
            <div className="flex flex-col gap-6">
              <ResponsesPanel modelKey="chatgpt" response={chatgptResponse} />
            </div>
          </div>
        </div>

        {/* Comparison Verdict */}
        <AnimatePresence>
          {comparisonVerdict && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-3xl mx-auto mt-8"
            >
              <div
                className="card p-6 overflow-hidden"
                style={{
                  borderTop: comparisonVerdict.error ? '3px solid var(--color-error)' : '3px solid var(--color-accent)',
                }}
              >
                {comparisonVerdict.error ? (
                  <div
                    className="flex items-center gap-2 text-sm font-semibold"
                    style={{ color: 'var(--color-error)' }}
                    role="alert"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    {comparisonVerdict.error}
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-4">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: 'var(--color-accent-light)' }}
                      >
                        <svg className="w-4 h-4" style={{ color: 'var(--color-accent)' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>AI Comparison Analysis</h3>
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Powered by GPT-4 Turbo</p>
                      </div>
                    </div>
                    <div
                      className="px-4 py-3 rounded-lg mb-3"
                      style={{ background: 'var(--color-accent-light)', border: '1px solid rgba(99, 102, 241, 0.15)' }}
                    >
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-accent)' }}>
                        Verdict
                      </span>
                      <p className="text-sm font-medium mt-1" style={{ color: 'var(--color-text)' }}>
                        {comparisonVerdict.verdict}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>
                        Analysis
                      </span>
                      <p
                        className="whitespace-pre-line text-sm leading-relaxed mt-1"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {comparisonVerdict.analysis}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
}
