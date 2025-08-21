import { NextRequest, NextResponse } from "next/server";
import { getClaudeResponse } from "@/lib/supabase/claude";

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
