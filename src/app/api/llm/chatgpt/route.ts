import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { query } = await req.json();
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OpenAI API key not set" }, { status: 500 });
  }
  if (!query || typeof query !== "string") {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }
  try {
    const finalPrompt = `${query}\n\nRespond only in English, even if the question is in another language.`;
    console.log("[ChatGPT] Final prompt:", finalPrompt);
    const t0 = Date.now();
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant. Keep your response clear, structured, and strictly under 500 characters." },
          { role: "user", content: finalPrompt },
        ],
        max_tokens: 600,
        temperature: 0.7,
      }),
    });
    const t1 = Date.now();
    const data = await response.json();
    console.log("[ChatGPT] API response:", JSON.stringify(data));
    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || "OpenAI error" }, { status: 500 });
    }
    let answer = data.choices?.[0]?.message?.content?.trim() || "";
    if (!answer) {
      console.warn("[ChatGPT] No usable answer in response:", data);
    }
    if (answer.length > 500) {
      answer = answer.slice(0, 500);
    }
    console.log(`[ChatGPT] Response length: ${answer.length} characters`);
    return NextResponse.json({ answer: answer || "ChatGPT did not return a response.", time: t1 - t0 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("ChatGPT API error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 