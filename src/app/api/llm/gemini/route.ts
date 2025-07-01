import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();
    if (text.length > 500) {
      return NextResponse.json({ error: "Response length exceeds 500 characters", source: "gemini" }, { status: 400 });
    }
    console.log(`[Gemini] Response length: ${text.length} characters`);
    return NextResponse.json({ answer: text, source: "gemini" });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Gemini API Error:", errorMessage);
    
    if (errorMessage.includes("overloaded")) {
      return NextResponse.json({ error: "Model is currently overloaded. Please wait and try again.", source: "gemini" }, { status: 503 });
    }

    return NextResponse.json({ error: errorMessage, source: "gemini" }, { status: 500 });
  }
} 