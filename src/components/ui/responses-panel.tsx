import React from "react";

interface ResponsesPanelProps {
  modelKey: string;
  response: { text: string; time: number } | null;
}

export default function ResponsesPanel({ modelKey, response }: ResponsesPanelProps) {
  const MODEL_META: Record<string, { label: string }> = {
    chatgpt: { label: "ChatGPT" },
    gemini: { label: "Gemini" },
  };
  const meta = MODEL_META[modelKey] || { label: modelKey };

  return (
    <div className="flex flex-col gap-6 w-full h-full overflow-y-auto">
      <div className="rounded-xl border border-[#e0e0e0] bg-white p-6 flex flex-col shadow-md min-h-[180px]">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-black text-base">{meta.label}</span>
          {response && (
            <button
              onClick={() => navigator.clipboard.writeText(response.text)}
              className="ml-2 p-1 rounded hover:bg-[#f0f0f0] focus:ring-2 focus:ring-black focus:outline-none transition"
              title="Copy"
              type="button"
              tabIndex={0}
              aria-label={`Copy ${meta.label} response`}
            >
              <svg width="18" height="18" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
            </button>
          )}
        </div>
        {response ? (
          <>
            <div className="whitespace-pre-line text-black text-base mb-2">{response.text}</div>
            <div className="text-xs text-[#888]">{response.time} ms</div>
          </>
        ) : (
          <div className="text-[#888] text-base">No response yet.</div>
        )}
      </div>
    </div>
  );
} 