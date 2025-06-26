"use client";
import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useTimeline } from "@/components/providers/timeline-provider";

export default function QueryForm() {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>(["chatgpt"]);
  const { user } = useAuth();
  const { addEntry } = useTimeline();

  const MODELS = [
    { key: "chatgpt", label: "ChatGPT" },
    { key: "gemini", label: "Gemini" },
  ];

  const toggleModel = (key: string) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!query.trim()) {
      setError("Please enter a query.");
      return;
    }
    if (!user) {
      setError("You must be logged in.");
      return;
    }
    if (selected.length === 0) {
      setError("Select at least one model.");
      return;
    }
    setLoading(true);
    try {
      const t0 = Date.now();
      const results = await Promise.all(
        selected.map(async (key) => {
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
      const responses: Record<string, { text: string; time: number }> = {};
      results.forEach((r) => {
        responses[r.key] = { text: r.answer, time: r.time };
      });
      // Store query and response in Supabase
      const storeRes = await fetch("/api/queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          query,
          selectedModels: selected,
          responses,
        }),
      });
      if (!storeRes.ok) {
        const errData = await storeRes.json();
        throw new Error(errData.error || "Failed to store query");
      }
      addEntry({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        prompt: query,
        models: selected,
        responses,
        createdAt: t0,
      });
      setQuery("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white border border-[#e0e0e0] rounded-2xl shadow-md flex flex-col gap-6 p-6"
      style={{ fontFamily: 'Open Sans, ui-sans-serif, sans-serif' }}
    >
      <label className="block text-xl font-bold mb-2 text-black" htmlFor="query">
        Enter your query
      </label>
      <div className="flex flex-col gap-2">
        <textarea
          id="query"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full h-32 min-h-[8rem] px-4 py-2 rounded-lg border border-[#e0e0e0] text-black bg-white focus:outline-none focus:ring-2 focus:ring-black overflow-y-auto resize-none transition placeholder:text-[#bbb]"
          placeholder="Ask anything..."
          disabled={loading}
        />
        {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
      </div>
      <div className="mb-1 font-medium text-black">Select models:</div>
      <div className="flex gap-4 flex-wrap mb-2">
        {MODELS.map((model) => (
          <label key={model.key} className="flex items-center gap-2 cursor-pointer select-none text-black font-medium">
            <input
              type="checkbox"
              checked={selected.includes(model.key)}
              onChange={() => toggleModel(model.key)}
              className="accent-black w-5 h-5 rounded border border-[#e0e0e0] focus:ring-2 focus:ring-black transition"
            />
            <span>{model.label}</span>
          </label>
        ))}
      </div>
      <button
        type="submit"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-black text-white text-2xl font-bold shadow-md hover:bg-[#222] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-black group self-end"
        aria-label="Send query"
        disabled={loading}
      >
        <span className="transform group-hover:translate-x-1 transition-transform duration-150">→</span>
      </button>
    </form>
  );
} 