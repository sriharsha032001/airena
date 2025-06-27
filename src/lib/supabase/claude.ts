// src/lib/claude.ts
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function getClaudeResponse(prompt: string) {
  try {
    const finalPrompt = `${prompt}\n\nRespond only in English, even if the question is in another language.`;
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
    }

    return { text: responseText, time: elapsed };
  } catch (error: unknown) {
    console.error("Claude API error:", error);
    return { text: "Error calling Claude.", time: 0 };
  }
}
