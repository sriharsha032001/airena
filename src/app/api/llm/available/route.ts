import { NextResponse } from "next/server";

const MODE = process.env.AIRENA_MODE || "free";

const ALL_MODELS = [
  {
    label: "Mistral 7B (Falcon 7B)",
    value: "mistral-7b",
    api: "/api/llm/mistral",
    badge: "🟢 Free",
    mode: "free",
    available: !!process.env.HF_API_KEY,
  },
  {
    label: "LLaMA 3",
    value: "llama-3",
    api: "/api/llm/llama3",
    badge: "🟢 Free",
    mode: "free",
    available: !!process.env.HF_API_KEY,
  },
  {
    label: "Phi-3",
    value: "phi-3",
    api: "/api/llm/phi3",
    badge: "🟢 Free",
    mode: "free",
    available: !!process.env.HF_API_KEY,
  },
  {
    label: "OpenChat",
    value: "openchat",
    api: "/api/llm/openchat",
    badge: "🟢 Free",
    mode: "free",
    available: !!process.env.HF_API_KEY,
  },
  // Premium models (hidden in free mode)
  {
    label: "Gemini Pro",
    value: "gemini-pro",
    api: "/api/llm/gemini",
    badge: "🔒 Premium",
    mode: "premium",
    available: !!process.env.GOOGLE_AI_API_KEY,
  },
  {
    label: "ChatGPT (3.5/4)",
    value: "gpt-3.5-turbo",
    api: "/api/llm/chatgpt",
    badge: "🔒 Premium",
    mode: "premium",
    available: !!process.env.OPENAI_API_KEY,
  },
];

export async function GET() {
  const models = ALL_MODELS.filter((m) => {
    if (MODE === "free") return m.mode === "free" && m.available;
    return m.available;
  });
  return NextResponse.json({ models });
} 