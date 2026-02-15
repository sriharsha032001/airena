"use client";
import { useState, useCallback } from "react";
import { useAuth } from "@/components/providers/auth-provider";

interface ComparisonVerdict {
  verdict: string;
  analysis: string;
  error?: string;
}

interface QueryFormProps {
  query: string;
  setQuery: (q: string) => void;
  selectedModels: string[];
  setSelectedModels: (models: string[]) => void;
  setGeminiResponse: (resp: { text: string; time: number } | null) => void;
  setChatgptResponse: (resp: { text: string; time: number } | null) => void;
  setComparisonVerdict: (v: ComparisonVerdict | null) => void;
}

const MODELS = [
  {
    key: "chatgpt",
    label: "ChatGPT",
    description: "GPT-4 Turbo",
    color: "var(--color-chatgpt)",
    bgColor: "var(--color-chatgpt-bg)",
  },
  {
    key: "gemini",
    label: "Gemini",
    description: "Gemini 1.5 Pro",
    color: "var(--color-gemini)",
    bgColor: "var(--color-gemini-bg)",
  },
];

export default function QueryForm({
  query,
  setQuery,
  selectedModels,
  setSelectedModels,
  setGeminiResponse,
  setChatgptResponse,
  setComparisonVerdict,
}: QueryFormProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const toggleModel = useCallback((key: string) => {
    setSelectedModels(
      selectedModels.includes(key)
        ? selectedModels.filter((k) => k !== key)
        : [...selectedModels, key]
    );
  }, [selectedModels, setSelectedModels]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setComparisonVerdict(null);
    setGeminiResponse(null);
    setChatgptResponse(null);
    if (!query.trim()) {
      setError("Please enter a query.");
      return;
    }
    if (!user) {
      setError("You must be logged in.");
      return;
    }
    if (selectedModels.length === 0) {
      setError("Select at least one model.");
      return;
    }
    setLoading(true);
    try {
      const results = await Promise.all(
        selectedModels.map(async (key) => {
          const api = key === "chatgpt" ? "/api/llm/chatgpt" : "/api/llm/gemini";
          const tStart = Date.now();
          try {
            const res = await fetch(api, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ query }),
            });
            const data = await res.json();
            const tEnd = Date.now();
            return {
              key,
              answer: data.answer || data.error || "No response",
              time: tEnd - tStart,
            };
          } catch (err) {
            const tEnd = Date.now();
            return {
              key,
              answer: err instanceof Error ? err.message : "Error",
              time: tEnd - tStart,
            };
          }
        })
      );
      results.forEach((r) => {
        if (r.key === "gemini") setGeminiResponse({ text: r.answer, time: r.time });
        if (r.key === "chatgpt") setChatgptResponse({ text: r.answer, time: r.time });
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card w-full flex flex-col gap-5 p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <svg className="w-5 h-5" style={{ color: 'var(--color-accent)' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
          Your Query
        </span>
      </div>

      {/* Textarea */}
      <div className="flex flex-col gap-1.5">
        <textarea
          id="query"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="input resize-none"
          style={{ minHeight: '120px', fontSize: '15px' }}
          placeholder="Ask anything... Compare AI responses instantly"
          disabled={loading}
          aria-label="Enter your query"
        />
        {error && (
          <div
            className="text-sm font-medium px-3 py-2 rounded-lg animate-fade-in"
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
      </div>

      {/* Model Selection */}
      <div className="flex flex-col gap-3">
        <span className="text-sm font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
          Select Models
        </span>
        <div className="flex flex-col gap-2">
          {MODELS.map((model) => {
            const isSelected = selectedModels.includes(model.key);
            return (
              <button
                key={model.key}
                type="button"
                onClick={() => toggleModel(model.key)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all duration-200 cursor-pointer text-left w-full"
                style={{
                  background: isSelected ? model.bgColor : 'transparent',
                  border: isSelected ? `1.5px solid ${model.color}` : '1.5px solid var(--color-border)',
                }}
                aria-pressed={isSelected}
                aria-label={`Select ${model.label}`}
              >
                {/* Custom checkbox */}
                <div
                  className="w-4.5 h-4.5 rounded flex items-center justify-center flex-shrink-0 transition-all duration-200"
                  style={{
                    width: '18px',
                    height: '18px',
                    background: isSelected ? model.color : 'transparent',
                    border: isSelected ? 'none' : '2px solid var(--color-border-hover)',
                    borderRadius: '5px',
                  }}
                >
                  {isSelected && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{model.label}</span>
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{model.description}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="btn-primary w-full py-3 text-sm"
        disabled={loading}
        aria-label={loading ? "Sending query" : "Send query"}
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
              <path d="M22 12a10 10 0 01-10 10" />
            </svg>
            Querying models...
          </>
        ) : (
          <>
            Send Query
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
