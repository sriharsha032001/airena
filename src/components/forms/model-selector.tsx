import { useState } from "react";

const MODELS = [
  { key: "chatgpt", label: "ChatGPT", tooltip: "Fast, balanced" },
  { key: "gemini", label: "Gemini", tooltip: "Creative, Google AI" },
  { key: "claude", label: "Claude", tooltip: "Long context, Anthropic" },
];

export default function ModelSelector() {
  const [selected, setSelected] = useState<string[]>(["chatgpt"]);
  const toggleModel = (key: string) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="font-bold text-black text-base mb-1">Select Models</div>
      <div className="flex flex-col gap-2">
        {MODELS.map((model) => (
          <label key={model.key} className="flex items-center gap-2 cursor-pointer select-none text-black font-medium group">
            <input
              type="checkbox"
              checked={selected.includes(model.key)}
              onChange={() => toggleModel(model.key)}
              className="accent-black w-5 h-5 rounded border border-[#e0e0e0] focus:ring-2 focus:ring-black transition"
            />
            <span>{model.label}</span>
            <span className="ml-2 text-xs text-[#888] opacity-0 group-hover:opacity-100 transition-opacity">{model.tooltip}</span>
          </label>
        ))}
      </div>
    </div>
  );
} 