import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function getClaudeResponse(prompt: string) {
  try {
    const finalPrompt = `${prompt}\n\nRespond only in English, even if the question is in another language.`;
    console.log("[Claude] Final prompt:", finalPrompt);

    const start = Date.now();
    const completion = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: finalPrompt,
        },
      ],
    });

    const elapsed = Date.now() - start;
    console.log("[Claude] API response:", JSON.stringify(completion));

    const firstContent = completion?.content?.[0];
    let responseText = "Claude did not return a response.";

    if (
      firstContent &&
      typeof firstContent === "object" &&
      "type" in firstContent &&
      firstContent.type === "text" &&
      typeof firstContent.text === "string"
    ) {
      responseText = firstContent.text.trim();
    } else {
      console.warn("[Claude] Unexpected response format:", completion.content);
    }

    return {
      text: responseText,
      time: elapsed,
    };
  } catch (error: unknown) {
    console.error("Claude API error:", error);
    return {
      text: "Error calling Claude.",
      time: 0,
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "Anthropic API key not set", source: "claude" }, { status: 500 });
    }
    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required", source: "claude" }, { status: 400 });
    }
    const result = await getClaudeResponse(query);
    return NextResponse.json({ claude: { text: result.text, time: result.time } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message, source: "claude" }, { status: 500 });
  }
} 