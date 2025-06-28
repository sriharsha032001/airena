"use client";
import ProtectedRoute from "@/components/providers/protected-route";
import { useAuth } from "@/components/providers/auth-provider";
import { useState } from "react";
import QueryForm from "@/components/forms/query-form";
import ResponsesPanel from "../components/ui/responses-panel";

export default function Home() {
  const { loading } = useAuth();
  // Centralized state
  const [query, setQuery] = useState("");
  const [selectedModels, setSelectedModels] = useState<string[]>(["chatgpt"]);
  const [geminiResponse, setGeminiResponse] = useState<{ text: string; time: number } | null>(null);
  const [chatgptResponse, setChatgptResponse] = useState<{ text: string; time: number } | null>(null);
  const [comparisonVerdict, setComparisonVerdict] = useState<{ verdict: string; analysis: string; error?: string } | null>(null);
  const [loadingCompare, setLoadingCompare] = useState(false);

  // Show buttons only after first query
  const showActionButtons = !!geminiResponse || !!chatgptResponse;

  // Clear all state
  const handleClearAll = () => {
    setQuery("");
    setSelectedModels(["chatgpt"]);
    setGeminiResponse(null);
    setChatgptResponse(null);
    setComparisonVerdict(null);
  };

  // Compare logic
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
    } catch (err: any) {
      setComparisonVerdict({ verdict: '', analysis: '', error: err?.message || 'Unknown error' });
    } finally {
      setLoadingCompare(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <span className="text-lg text-black">Loading...</span>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <main
        className="w-full min-h-screen flex flex-col items-center justify-start px-2 md:px-8 pt-8 pb-4 bg-white"
        style={{ fontFamily: 'Open Sans, ui-sans-serif, sans-serif' }}
      >
        {/* Hero Section */}
        <section className="w-full flex flex-col items-center justify-center mb-8 mt-2">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-black text-center mb-2 tracking-tight px-2 md:px-0" style={{ letterSpacing: '-0.01em' }}>
            Ask AI Anything
          </h1>
        </section>
        {/* Buttons Row */}
        {showActionButtons && (
          <div className="w-full flex justify-center gap-4 mb-6">
            <button
              className="px-6 py-3 rounded-lg bg-black text-white font-semibold shadow hover:bg-[#222] transition disabled:opacity-60"
              onClick={handleCompare}
              disabled={loadingCompare || !geminiResponse || !chatgptResponse}
            >
              {loadingCompare ? 'Comparing...' : 'Compare'}
            </button>
            <button
              className="px-6 py-3 rounded-lg bg-black text-white font-semibold shadow hover:bg-black/80 transition"
              onClick={handleClearAll}
            >
              Clear All
            </button>
          </div>
        )}
        {/* 3-Column Responsive Layout */}
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8 flex-1">
          {/* Left: Sticky Query Input */}
          <div className="md:col-span-1 flex flex-col gap-8 md:sticky md:top-24 h-fit">
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
          {/* Right: 2-Column Responses (Gemini & GPT) */}
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Gemini Response */}
            <div className="flex flex-col gap-8">
              <ResponsesPanel modelKey="gemini" response={geminiResponse} />
            </div>
            {/* GPT Response */}
            <div className="flex flex-col gap-8">
              <ResponsesPanel modelKey="chatgpt" response={chatgptResponse} />
            </div>
          </div>
        </div>
        {/* Verdict/Comparison Output */}
        {comparisonVerdict && (
          <div className="w-full max-w-3xl mx-auto mt-8 p-6 rounded-xl border border-[#e0e0e0] bg-[#f9f9f9] shadow-md">
            {comparisonVerdict.error ? (
              <div className="text-red-500 font-semibold">{comparisonVerdict.error}</div>
            ) : (
              <>
                <div className="font-bold text-black mb-1">GPT-4 Turbo Comparison</div>
                <div className="text-black mb-2"><span className="font-semibold">Verdict:</span> {comparisonVerdict.verdict}</div>
                <div className="text-[#444] whitespace-pre-line"><span className="font-semibold">Analysis:</span> {comparisonVerdict.analysis}</div>
              </>
            )}
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}

