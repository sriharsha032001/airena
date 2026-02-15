"use client";
import { Dispatch, SetStateAction } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "react-hot-toast";
import { ResponseData } from "@/app/query/page";
import { motion } from "framer-motion";
import Image from "next/image";

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
    { key: "gemini", label: "Gemini 2.5", cost: 1, icon: "/globe.svg" },
    { key: "chatgpt", label: "GPT-4.1", cost: 2, icon: "/window.svg" },
  ];

  const toggleModel = (key: string) => {
    if (hasNoCredits) return;
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
    <motion.form
      onSubmit={handleSubmit}
      className="w-full bg-white border border-gray-200/80 rounded-2xl shadow-lg flex flex-col p-6 transition-shadow hover:shadow-xl h-full"
      layout
    >
      <div className="relative group">
        <motion.div 
          className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-sm opacity-0 group-focus-within:opacity-50 transition-opacity duration-300"
          aria-hidden="true"
        />
        <textarea
          id="query"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="relative w-full h-48 min-h-[12rem] px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-800 bg-gray-50/80 focus:outline-none focus:ring-0 focus:border-blue-500 overflow-y-auto resize-none transition-all duration-200 placeholder:text-transparent peer"
          placeholder="e.g., Explain the theory of relativity in simple terms"
          disabled={loadingModels.length > 0 || hasNoCredits}
          required
        />
        <label
          htmlFor="query"
          className="absolute left-4 top-3.5 text-gray-500 transition-all duration-300 transform peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-5 peer-focus:text-blue-600 peer-focus:px-1 peer-focus:bg-white scale-75 -translate-y-5 bg-white px-1"
        >
          {hasNoCredits ? "You are out of credits" : "Enter your query"}
        </label>
      </div>
      
      <div className="my-5">
        <div className="mb-3 font-semibold text-gray-800 text-sm">Select models</div>
        <div className="flex gap-3 flex-wrap">
          {MODELS.map((model) => (
            <motion.div
              key={model.key}
              onClick={() => toggleModel(model.key)}
              className={`flex items-center gap-2 select-none rounded-full px-4 py-2 border text-sm font-medium transition-all ${
                selectedModels.includes(model.key)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              } ${hasNoCredits ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
              whileTap={{ scale: hasNoCredits ? 1 : 0.95 }}
            >
              <Image src={model.icon} alt={`${model.label} icon`} width={16} height={16} />
              <span>{model.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="mt-auto pt-4 border-t border-gray-200/80">
        <button
          type="submit"
          className="w-full flex items-center justify-center py-3 rounded-lg bg-gray-800 text-white text-base font-bold shadow-md hover:bg-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={loadingModels.length > 0 || selectedModels.length === 0 || !query.trim() || hasNoCredits}
        >
          {loadingModels.length > 0 ? "Generating..." : "Run Query"}
        </button>
      </div>
    </motion.form>
  );
}
