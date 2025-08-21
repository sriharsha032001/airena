import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Google AI API key not set", source: "gemini" }, { status: 500 });
    }
    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required", source: "gemini" }, { status: 400 });
    }
    // Prepend system prompt to user query
    const systemPrompt = "You are a helpful assistant. Keep your response clear, structured, and strictly under 500 characters.";
    const fullPrompt = `${systemPrompt}\n${query}`;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-002:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { parts: [{ text: fullPrompt }] },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 600,
        },
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || "Gemini error", source: "gemini" }, { status: 500 });
    }
    let answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    if (answer.length > 500) {
      answer = answer.slice(0, 500);
    }
    console.log(`[Gemini] Response length: ${answer.length} characters`);
    return NextResponse.json({ answer, source: "gemini" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message, source: "gemini" }, { status: 500 });
  }
} 