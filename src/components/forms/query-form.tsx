"use client";
import { Dispatch, SetStateAction } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "react-hot-toast";
import { ResponseData } from "@/app/query/page";

// 1️⃣ Define the type
interface ComparisonVerdict {
  verdict: string;
  analysis: string;
  error?: string;
}

// 2️⃣ Use the type in props
interface QueryFormProps {
  query: string;
  setQuery: (q: string) => void;
  selectedModels: string[];
  setSelectedModels: (models: string[]) => void;
  setGeminiResponse: (resp: ResponseData | null) => void;
  setChatgptResponse: (resp: ResponseData | null) => void;
  setComparisonVerdict: (v: ComparisonVerdict | null) => void;
  setLoadingModels: Dispatch<SetStateAction<string[]>>;
  loadingModels: string[];
}

export default function QueryForm({
  query,
  setQuery,
  selectedModels,
  setSelectedModels,
  setGeminiResponse,
  setChatgptResponse,
  setComparisonVerdict,
  setLoadingModels,
  loadingModels,
}: QueryFormProps) {
  const { user, credits, refetchCredits } = useAuth();
  const hasNoCredits = credits ? credits.credits <= 0 : false;

  const MODELS = [
    { key: "gemini", label: "Gemini 2.5 Flash", cost: 1 },
    { key: "chatgpt", label: "GPT-4.1 mini", cost: 2 },
  ];

  const toggleModel = (key: string) => {
    setSelectedModels(
      selectedModels.includes(key)
        ? selectedModels.filter((k) => k !== key)
        : [...selectedModels, key]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingModels(selectedModels);
    setComparisonVerdict(null);

    if (!query.trim()) {
      toast.error("Please enter a query.");
      setLoadingModels([]);
      return;
    }
    if (!user) {
      toast.error("You must be logged in to run a query.");
      setLoadingModels([]);
      return;
    }
    if (selectedModels.length === 0) {
      toast.error("Please select at least one model.");
      setLoadingModels([]);
      return;
    }
    if (!credits) {
      toast.error("Could not verify your credit balance. Please try again.");
      setLoadingModels([]);
      return;
    }

    const cost = selectedModels.reduce((acc, modelKey) => {
      const model = MODELS.find(m => m.key === modelKey);
      return acc + (model?.cost || 0);
    }, 0);

    const isLongQuery = query.length > 1500 || query.split(" ").filter(Boolean).length > 250;
    const finalCost = isLongQuery ? cost * 2 : cost;
    
    if (credits.credits < finalCost) {
      toast.error("You don't have enough credits for this query. Please top up.");
      setLoadingModels([]);
      return;
    }
    
    const executeQuery = async (model: string) => {
      const api = model === "chatgpt" ? "/api/llm/chatgpt" : "/api/llm/gemini";
      const tStart = Date.now();
      let lastError: Error | null = null;

      for (let i = 0; i < 3; i++) { 
        try {
          const res = await fetch(api, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query }),
          });

          if (res.status === 503) { 
            lastError = new Error("Model is currently overloaded.");
            if(i === 0) toast.error(`Model is overloaded. Retrying...`);
            await new Promise(resolve => setTimeout(resolve, (i + 1) * 1000));
            continue; 
          }

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || `API request failed with status ${res.status}`);
          }

          const data = await res.json();
          const tEnd = Date.now();
          return { key: model, answer: data.answer || data.error || "No response", time: tEnd - tStart, success: true };

        } catch (err) {
          lastError = err instanceof Error ? err : new Error("An unknown error occurred");
        }
      }
      
      toast.error(`${model.charAt(0).toUpperCase() + model.slice(1)} is busy. Please try again later.`);
      const tEnd = Date.now();
      return { key: model, answer: lastError?.message || "Error", time: tEnd - tStart, success: false };
    };

    try {
      const results = await Promise.all(selectedModels.map(executeQuery));
      
      const successfulQueries = results.filter(r => r.success);
      if (successfulQueries.length > 0) {
        const deductResponse = await fetch('/api/credits/deduct', {
          method: 'POST',
          headers: { 'Content-Type': "application/json" },
          body: JSON.stringify({ userId: user.id, cost: finalCost })
        });

        if (deductResponse.ok) {
          toast.success(`${finalCost} credit(s) deducted.`);
          refetchCredits();
        } else {
          const { error } = await deductResponse.json();
          toast.error(error || "An error occurred during credit deduction.");
        }
      }

      results.forEach((r) => {
        if (r.key === "gemini") setGeminiResponse({ text: r.answer, time: r.time });
        if (r.key === "chatgpt") setChatgptResponse({ text: r.answer, time: r.time });
      });

    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong during the query.");
    } finally {
      setLoadingModels([]);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white border border-gray-200 rounded-2xl shadow-lg flex flex-col gap-4 p-6 transition-shadow hover:shadow-xl"
    >
      <label className="block text-lg font-semibold mb-1 text-gray-800" htmlFor="query">
        Enter your query
      </label>
      <div className="relative flex flex-col">
        <textarea
          id="query"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full h-40 min-h-[10rem] px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 overflow-y-auto resize-none transition-all duration-200 placeholder:text-gray-400"
          placeholder={hasNoCredits ? "You are out of credits. Please top up to continue." : "e.g., Explain the theory of relativity in simple terms"}
          disabled={loadingModels.length > 0 || hasNoCredits}
        />
        <button
          type="submit"
          className="absolute bottom-3 right-3 flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 text-white text-2xl font-bold shadow-lg hover:bg-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 group disabled:bg-gray-400 disabled:cursor-not-allowed"
          aria-label="Send query"
          disabled={loadingModels.length > 0 || selectedModels.length === 0 || !query.trim() || hasNoCredits}
        >
          <span className="transform group-hover:translate-x-0.5 transition-transform duration-150">→</span>
        </button>
      </div>
      <div className="mb-1 font-semibold text-gray-800">Select models to compare:</div>
      <div className="flex gap-4 flex-wrap mb-2">
        {MODELS.map((model) => (
          <label key={model.key} className={`flex items-center gap-2 select-none text-gray-700 font-medium group ${hasNoCredits ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
            <input
              type="checkbox"
              checked={selectedModels.includes(model.key)}
              onChange={() => toggleModel(model.key)}
              className="accent-blue-600 w-5 h-5 rounded-md border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 transition-all"
              disabled={hasNoCredits}
            />
            <span className="group-hover:text-black transition-colors">{model.label}</span>
          </label>
        ))}
      </div>
    </form>
  );
}
