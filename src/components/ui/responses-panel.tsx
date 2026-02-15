import React, { useState } from "react";

interface ResponsesPanelProps {
  modelKey: string;
  response: { text: string; time: number } | null;
}

const MODEL_META: Record<string, { label: string; color: string; bgColor: string; icon: string }> = {
  chatgpt: {
    label: "ChatGPT",
    color: "var(--color-chatgpt)",
    bgColor: "var(--color-chatgpt-bg)",
    icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z",
  },
  gemini: {
    label: "Gemini",
    color: "var(--color-gemini)",
    bgColor: "var(--color-gemini-bg)",
    icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  },
};

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
        style={{ background: 'var(--color-bg-muted)' }}
      >
        <svg className="w-6 h-6" style={{ color: 'var(--color-text-muted)' }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
      </div>
      <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
        Waiting for {label} response
      </p>
      <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
        Send a query to see results here
      </p>
    </div>
  );
}

export default function ResponsesPanel({ modelKey, response }: ResponsesPanelProps) {
  const meta = MODEL_META[modelKey] || { label: modelKey, color: 'var(--color-accent)', bgColor: 'var(--color-accent-light)', icon: '' };
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="card flex flex-col w-full overflow-hidden"
      style={{ minHeight: '200px' }}
    >
      {/* Header with model accent */}
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{
          borderBottom: '1px solid var(--color-border)',
          background: meta.bgColor,
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: meta.color }}
          />
          <span className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
            {meta.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {response && (
            <>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{
                  background: 'var(--color-bg)',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border)',
                }}
              >
                {response.time}ms
              </span>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-md transition-all duration-150"
                style={{
                  background: copied ? 'var(--color-success-bg)' : 'transparent',
                  color: copied ? 'var(--color-success)' : 'var(--color-text-muted)',
                }}
                onMouseEnter={(e) => { if (!copied) e.currentTarget.style.background = 'var(--color-bg)'; }}
                onMouseLeave={(e) => { if (!copied) e.currentTarget.style.background = 'transparent'; }}
                title={copied ? "Copied!" : "Copy response"}
                type="button"
                aria-label={`Copy ${meta.label} response`}
              >
                {copied ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15V5a2 2 0 012-2h10" />
                  </svg>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      {response ? (
        <div className="px-5 py-4 animate-fade-in">
          <div
            className="whitespace-pre-line text-sm leading-relaxed"
            style={{ color: 'var(--color-text)' }}
          >
            {response.text}
          </div>
        </div>
      ) : (
        <EmptyState label={meta.label} />
      )}
    </div>
  );
}
