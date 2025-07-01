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
    if (!response.ok) {
      const errorBody = await response.json();
      const errorMessage = errorBody.error?.message || "An unknown error occurred with OpenAI";
      console.error("OpenAI API Error:", errorMessage);
      
      if (errorMessage.includes("overloaded") || response.status === 429) {
        return NextResponse.json({ error: "Model is currently overloaded. Please wait and try again." }, { status: 503 });
      }

      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }
    const data = await response.json();
    let answer = data.choices?.[0]?.message?.content?.trim() || "";
    if (!answer) {
      console.warn("[ChatGPT] No usable answer in response:", data);
    }
    if (answer.length > 500) {
      answer = answer.slice(0, 500);
    }
    console.log(`[ChatGPT] Response length: ${answer.length} characters`);
    return NextResponse.json({ answer: answer || "ChatGPT did not return a response.", time: t1 - t0 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("ChatGPT Route Error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 