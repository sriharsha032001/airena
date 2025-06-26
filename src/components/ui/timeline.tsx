"use client";
import { useTimeline } from "@/components/providers/timeline-provider";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

const MODEL_META: Record<string, { label: string }> = {
  chatgpt: { label: "ChatGPT" },
  gemini: { label: "Gemini" },
};

function CopyButton({ text }: { text: string }) {
  return (
    <button
      onClick={() => navigator.clipboard.writeText(text)}
      className="ml-2 p-1 rounded hover:bg-[#f0f0f0] focus:ring-2 focus:ring-black focus:outline-none transition"
      title="Copy"
      type="button"
      tabIndex={0}
      aria-label="Copy response"
    >
      <svg width="18" height="18" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
    </button>
  );
}

function SkeletonCard() {
  return (
    <div className="flex-1 min-w-[220px] rounded-xl border border-[#e0e0e0] bg-[#f9f9f9] p-4 flex flex-col animate-pulse">
      <div className="h-4 w-1/3 bg-[#e0e0e0] rounded mb-2" />
      <div className="h-3 w-1/4 bg-[#e0e0e0] rounded mb-4" />
      <div className="h-4 w-full bg-[#e0e0e0] rounded mb-2" />
      <div className="h-4 w-5/6 bg-[#e0e0e0] rounded mb-2" />
      <div className="h-4 w-2/3 bg-[#e0e0e0] rounded" />
    </div>
  );
}

function FullResultModal({ open, onClose, text, model }: { open: boolean; onClose: () => void; text: string; model: string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black text-xl font-bold hover:opacity-70 focus:outline-none"
          aria-label="Close full result"
        >
          ×
        </button>
        <div className="mb-2 text-lg font-bold text-black">{model} – Full Result</div>
        <div className="whitespace-pre-line text-black text-base max-h-[60vh] overflow-y-auto">
          {text}
        </div>
      </div>
    </div>
  );
}

export default function Timeline() {
  const { timeline } = useTimeline();
  const loading = false; // Replace with real loading state if available
  const [modal, setModal] = useState<{ text: string; model: string } | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  // Track expanded state for each response card
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [timeline]);

  if (timeline.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 text-center text-[#888] bg-white rounded-xl border border-[#e0e0e0]">
        No queries yet. Your research timeline will appear here.
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 flex flex-col gap-8" style={{ maxHeight: "70vh" }} ref={timelineRef}>
      <AnimatePresence>
        {timeline.map((entry) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="bg-white border border-[#e0e0e0] rounded-2xl p-6 flex flex-col gap-4 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="text-xs text-[#888] mb-1">{new Date(entry.createdAt).toLocaleString()}</div>
            <div className="font-bold text-lg mb-2 text-black">Prompt</div>
            <div className="bg-[#f9f9f9] rounded p-3 mb-2 text-base text-black border border-[#e0e0e0] select-text cursor-default">
              {entry.prompt}
            </div>
            <div className="font-semibold mb-1 text-black">Responses</div>
            <div className="flex flex-col md:flex-row gap-4">
              {entry.models.map((model) => {
                const meta = MODEL_META[model] || { label: model };
                const resp = entry.responses[model];
                const isLong = (resp?.text?.length || 0) > 400;
                const cardKey = `${entry.id}-${model}`;
                const expanded = expandedCards[cardKey] || false;
                const preview = isLong && !expanded ? resp.text.slice(0, 400) + "..." : resp.text;
                return loading ? (
                  <SkeletonCard key={model} />
                ) : (
                  <motion.div
                    key={model}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex-1 min-w-[220px] rounded-xl border border-[#e0e0e0] bg-white p-4 flex flex-col relative transition-transform hover:scale-[1.02] hover:shadow-lg shadow-md"
                    style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-black text-base">{meta.label}</span>
                      <span className="text-xs text-[#888]">{resp?.time} ms</span>
                      <CopyButton text={resp?.text || ''} />
                    </div>
                    <div className="whitespace-pre-line text-black text-base">
                      {preview}
                      {isLong && (
                        <button
                          className="ml-2 text-xs underline text-blue-700 hover:text-blue-900 font-semibold focus:outline-none"
                          onClick={() => setExpandedCards((prev) => ({ ...prev, [cardKey]: !expanded }))}
                          aria-label="Show full result"
                        >
                          {expanded ? 'Show less' : 'Read full response'}
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <FullResultModal
        open={!!modal}
        onClose={() => setModal(null)}
        text={modal?.text || ""}
        model={modal?.model || ""}
      />
    </div>
  );
} 