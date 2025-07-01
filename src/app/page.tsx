"use client";
import { useAuth } from "@/components/providers/auth-provider";
import { useState } from "react";
import QueryForm from "@/components/forms/query-form";
import ResponsesPanel from "../components/ui/responses-panel";
import { toast } from "react-hot-toast";

export interface ResponseData {
  text: string;
  time: number;
}

export default function Home() {
  const { loading: authLoading } = useAuth();
  // Centralized state
  const [query, setQuery] = useState("");
  const [selectedModels, setSelectedModels] = useState<string[]>(["gemini"]);
  const [geminiResponse, setGeminiResponse] = useState<ResponseData | null>(null);
  const [chatgptResponse, setChatgptResponse] = useState<ResponseData | null>(null);
  const [comparisonVerdict, setComparisonVerdict] = useState<{ verdict: string; analysis: string; error?: string } | null>(null);
  const [loadingModels, setLoadingModels] = useState<string[]>([]);

  // Show buttons only after first query
  const showActionButtons = !!geminiResponse || !!chatgptResponse;

  const handleClearAll = () => {
    setQuery("");
    setGeminiResponse(null);
    setChatgptResponse(null);
    setComparisonVerdict(null);
    toast.success("Cleared all responses.");
  };

  const handleCompare = async () => {
    if (!geminiResponse || !chatgptResponse) return;
    setComparisonVerdict({ verdict: 'loading', analysis: '' });
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
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <span className="text-lg text-gray-700">Loading your workspace...</span>
      </div>
    );
  }

  return (
    <main
      className="w-full min-h-screen flex flex-col items-center justify-start px-4 sm:px-6 lg:px-8 pt-8 pb-12 bg-gray-50"
      style={{ fontFamily: 'Inter, Open Sans, ui-sans-serif, sans-serif' }}
    >
      <section className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight" style={{ letterSpacing: '-0.02em' }}>
          Compare AI Models Instantly
        </h1>
        <p className="mt-3 text-lg text-gray-600 max-w-2xl">
            Enter one prompt, get two responses. Make better decisions, faster.
        </p>
      </section>

       <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-10">
        
        <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
          <QueryForm
            query={query}
            setQuery={setQuery}
            selectedModels={selectedModels}
            setSelectedModels={setSelectedModels}
            setGeminiResponse={setGeminiResponse}
            setChatgptResponse={setChatgptResponse}
            setComparisonVerdict={setComparisonVerdict}
            setLoadingModels={setLoadingModels}
            loadingModels={loadingModels}
          />
        </div>
        
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <ResponsesPanel 
                modelKey="gemini" 
                response={geminiResponse} 
                isLoading={loadingModels.includes('gemini')} 
            />
            <ResponsesPanel 
                modelKey="chatgpt" 
                response={chatgptResponse} 
                isLoading={loadingModels.includes('chatgpt')}
            />
        </div>
      </div>

       {showActionButtons && (
        <div className="w-full flex justify-center items-center gap-4 mt-10">
          <button
            className="px-6 py-3 rounded-lg bg-gray-800 text-white font-semibold shadow-sm hover:bg-gray-900 transition-all active:scale-95 disabled:opacity-60"
            onClick={handleCompare}
            disabled={comparisonVerdict?.verdict === 'loading' || !geminiResponse || !chatgptResponse}
          >
            {comparisonVerdict?.verdict === 'loading' ? 'Comparing...' : 'Compare Results'}
          </button>
          <button
            className="px-6 py-3 rounded-lg bg-white text-gray-700 font-semibold border border-gray-300 shadow-sm hover:bg-gray-100 transition-all active:scale-95"
            onClick={handleClearAll}
          >
            Clear All
          </button>
        </div>
      )}

      {comparisonVerdict && comparisonVerdict.verdict !== 'loading' && (
        <div className="w-full max-w-4xl mx-auto mt-12 p-6 rounded-xl border border-gray-200 bg-white shadow-sm">
          {comparisonVerdict.error ? (
            <div className="text-red-500 font-semibold">{comparisonVerdict.error}</div>
          ) : (
            <>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Comparison Analysis</h3>
              <p className="text-gray-800"><span className="font-semibold">Verdict:</span> {comparisonVerdict.verdict}</p>
              <div className="mt-2 pt-2 border-t border-gray-200 text-gray-700 whitespace-pre-line"><span className="font-semibold">Reasoning:</span> {comparisonVerdict.analysis}</div>
            </>
          )}
        </div>
      )}
    </main>
  );
}

