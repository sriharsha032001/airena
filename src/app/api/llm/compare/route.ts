import { NextRequest, NextResponse } from "next/server";

function noStore(res: NextResponse) {
  res.headers.set('Cache-Control', 'no-store');
  return res;
}

export async function POST(req: NextRequest) {
  try {
    const { responses, prompt } = await req.json();
    if (!responses || !Array.isArray(responses) || responses.length < 2) {
      return noStore(NextResponse.json({ error: "At least two responses required for comparison." }, { status: 400 }));
    }
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return noStore(NextResponse.json({ error: "OpenAI API key not set." }, { status: 500 }));
    }
    // Build the comparison prompt
    let comparePrompt = `Compare the following AI responses to the same user query. Highlight which one is more helpful, accurate, and well-structured. Then explain why.`;
    responses.forEach((r, i) => {
      comparePrompt += `\nResponse ${String.fromCharCode(65 + i)}: ${r.text}`;
    });
    // Optionally include the original prompt
    if (prompt) {
      comparePrompt = `User Query: ${prompt}\n\n` + comparePrompt;
    }
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: "You are an expert AI evaluator." },
          { role: "user", content: comparePrompt },
        ],
        max_tokens: 512,
        temperature: 0.3,
      }),
    });
    const data = await openaiRes.json();
    if (!openaiRes.ok) {
      return noStore(NextResponse.json({ error: data.error?.message || "OpenAI error" }, { status: 500 }));
    }
    // Try to extract a structured verdict/analysis from the response
    let verdict = "";
    let analysis = "";
    const text = data.choices?.[0]?.message?.content || "";
    // Try to parse as JSON, fallback to plain text
    try {
      const parsed = JSON.parse(text);
      verdict = parsed.verdict || "";
      analysis = parsed.analysis || "";
    } catch {
      // Fallback: try to split by lines
      const lines = text.split("\n");
      verdict = lines[0] || "";
      analysis = lines.slice(1).join("\n");
    }
    return noStore(NextResponse.json({ verdict, analysis, raw: text }));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return noStore(NextResponse.json({ error: message }, { status: 500 }));
  }
} 