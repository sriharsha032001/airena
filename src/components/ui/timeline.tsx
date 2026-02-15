"use client";
import { useTimeline } from "@/components/providers/timeline-provider";
import type { TimelineEntry } from "@/components/providers/timeline-provider";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";

const MODEL_META: Record<string, { label: string; color: string; bgColor: string }> = {
  chatgpt: { label: "ChatGPT", color: "var(--color-chatgpt)", bgColor: "var(--color-chatgpt-bg)" },
  gemini: { label: "Gemini", color: "var(--color-gemini)", bgColor: "var(--color-gemini-bg)" },
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-md transition-all duration-150"
      style={{
        background: copied ? 'var(--color-success-bg)' : 'transparent',
        color: copied ? 'var(--color-success)' : 'var(--color-text-muted)',
      }}
      title={copied ? "Copied!" : "Copy"}
      type="button"
      aria-label="Copy response"
    >
      {copied ? (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15V5a2 2 0 012-2h10" />
        </svg>
      )}
    </button>
  );
}

function FullResultModal({ open, onClose, text, model }: { open: boolean; onClose: () => void; text: string; model: string }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${model} full result`}
    >
      <div
        className="card max-w-2xl w-full p-8 relative animate-fade-in mx-4"
        style={{ boxShadow: 'var(--shadow-xl)' }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-150"
          style={{ background: 'var(--color-bg-muted)', color: 'var(--color-text-secondary)' }}
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="mb-4 text-base font-bold" style={{ color: 'var(--color-text)' }}>
          {model} – Full Result
        </div>
        <div
          className="whitespace-pre-line text-sm leading-relaxed max-h-[60vh] overflow-y-auto"
          style={{ color: 'var(--color-text)' }}
        >
          {text}
        </div>
      </div>
    </div>
  );
}

export default function Timeline({ modelKey }: { modelKey?: string }) {
  const { timeline, clearTimeline } = useTimeline();
  const [modal, setModal] = useState<{ text: string; model: string } | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [compareResult, setCompareResult] = useState<Record<string, { verdict: string; analysis: string; error?: string }>>({});
  const [compareLoading, setCompareLoading] = useState<Record<string, boolean>>({});
  const [showToast, setShowToast] = useState(false);

  const handleClearAll = useCallback(() => {
    clearTimeline();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  }, [clearTimeline]);

  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [timeline]);

  const filteredTimeline = modelKey
    ? timeline.filter((entry: TimelineEntry) => entry.models.includes(modelKey))
    : timeline;

  if (filteredTimeline.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto p-8 text-center card">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: 'var(--color-bg-muted)' }}
        >
          <svg className="w-7 h-7" style={{ color: 'var(--color-text-muted)' }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
          No queries yet
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
          Your research timeline will appear here
        </p>
      </div>
    );
  }

  const handleCompare = async (entry: TimelineEntry) => {
    setCompareLoading((prev) => ({ ...prev, [entry.id]: true }));
    setCompareResult(prev => {
      const newResult = { ...prev };
      delete newResult[entry.id];
      return newResult;
    });

    try {
      const responses = entry.models.map((model: string) => ({
        model,
        text: entry.responses[model]?.text || "",
      }));
      const res = await fetch("/api/llm/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses, prompt: entry.prompt }),
      });
      const data = await res.json();
      if (data.error) {
        setCompareResult((prev) => ({ ...prev, [entry.id]: { verdict: '', analysis: '', error: data.error } }));
      } else {
        setCompareResult((prev) => ({ ...prev, [entry.id]: { verdict: data.verdict, analysis: data.analysis } }));
      }
    } catch (err: unknown) {
      setCompareResult((prev) => ({
        ...prev,
        [entry.id]: {
          verdict: '',
          analysis: '',
          error: err instanceof Error ? err.message : 'Unknown error',
        },
      }));
    } finally {
      setCompareLoading((prev) => ({ ...prev, [entry.id]: false }));
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 flex flex-col gap-6 relative" style={{ maxHeight: "70vh" }} ref={timelineRef}>
      {/* Clear All Button */}
      {filteredTimeline.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleClearAll}
            className="btn-secondary text-xs px-3 py-1.5"
            style={{ color: 'var(--color-error)' }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            Clear All
          </button>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <div className="toast toast-success" role="alert" aria-live="polite">
          All queries cleared!
        </div>
      )}

      <AnimatePresence>
        {filteredTimeline.map((entry) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="card p-6 flex flex-col gap-4"
          >
            {/* Timestamp */}
            <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {typeof entry.createdAt === "number"
                ? new Date(entry.createdAt).toLocaleString()
                : new Date(entry.createdAt as string).toLocaleString()}
            </div>

            {/* Prompt */}
            <div>
              <div
                className="text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Prompt
              </div>
              <div
                className="rounded-lg p-3 text-sm select-text"
                style={{
                  background: 'var(--color-bg-muted)',
                  color: 'var(--color-text)',
                  border: '1px solid var(--color-border)',
                }}
              >
                {entry.prompt}
              </div>
            </div>

            {/* Responses */}
            <div>
              <div
                className="text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Responses
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                {(modelKey ? [modelKey] : entry.models).map((model) => {
                  const meta = MODEL_META[model] || { label: model, color: 'var(--color-accent)', bgColor: 'var(--color-accent-light)' };
                  const resp = entry.responses[model];
                  const isLong = (resp?.text?.length || 0) > 400;
                  const cardKey = `${entry.id}-${model}`;
                  const expanded = expandedCards[cardKey] || false;
                  const preview = isLong && !expanded ? resp.text.slice(0, 400) + "..." : resp.text;

                  return (
                    <motion.div
                      key={model}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="flex-1 min-w-[220px] rounded-xl overflow-hidden"
                      style={{
                        border: '1px solid var(--color-border)',
                        background: 'var(--color-bg)',
                      }}
                    >
                      {/* Card header */}
                      <div
                        className="flex items-center justify-between px-4 py-2.5"
                        style={{ background: meta.bgColor, borderBottom: '1px solid var(--color-border)' }}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ background: meta.color }} />
                          <span className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{meta.label}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{resp?.time}ms</span>
                          <CopyButton text={resp?.text || ''} />
                        </div>
                      </div>

                      {/* Card body */}
                      <div className="px-4 py-3">
                        <div className="whitespace-pre-line text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>
                          {preview}
                          {isLong && (
                            <button
                              className="ml-2 text-xs font-semibold transition-opacity hover:opacity-80"
                              style={{ color: 'var(--color-accent)' }}
                              onClick={() => setExpandedCards((prev) => ({ ...prev, [cardKey]: !expanded }))}
                              aria-label={expanded ? "Show less" : "Show full response"}
                            >
                              {expanded ? 'Show less' : 'Read full response'}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Compare Button */}
            {entry.models.length >= 2 && (
              <div className="flex items-start">
                <button
                  className="btn-primary text-xs px-4 py-2"
                  onClick={() => handleCompare(entry)}
                  disabled={compareLoading[entry.id]}
                >
                  {compareLoading[entry.id] ? (
                    <>
                      <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
                        <path d="M22 12a10 10 0 01-10 10" />
                      </svg>
                      Comparing...
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                      </svg>
                      Compare
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Comparison Result */}
            <AnimatePresence>
              {compareResult[entry.id] && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="rounded-xl p-4"
                  style={{
                    background: 'var(--color-bg-subtle)',
                    border: '1px solid var(--color-border)',
                    borderTop: compareResult[entry.id].error ? '3px solid var(--color-error)' : '3px solid var(--color-accent)',
                  }}
                >
                  {compareResult[entry.id].error ? (
                    <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--color-error)' }} role="alert">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                      {compareResult[entry.id].error}
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'var(--color-accent-light)' }}>
                          <svg className="w-3.5 h-3.5" style={{ color: 'var(--color-accent)' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                          </svg>
                        </div>
                        <span className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>AI Comparison</span>
                      </div>
                      <div
                        className="px-3 py-2 rounded-lg mb-2"
                        style={{ background: 'var(--color-accent-light)', border: '1px solid rgba(99, 102, 241, 0.15)' }}
                      >
                        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-accent)' }}>Verdict</span>
                        <p className="text-sm font-medium mt-0.5" style={{ color: 'var(--color-text)' }}>{compareResult[entry.id].verdict}</p>
                      </div>
                      <div className="text-sm whitespace-pre-line leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                        {compareResult[entry.id].analysis}
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
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
