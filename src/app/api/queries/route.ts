// SQL to create the correct 'queries' table:
/*
CREATE TABLE queries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  query_text TEXT NOT NULL,
  user_id UUID,
  selected_models TEXT[] NOT NULL,
  responses JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
*/

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface QueryRequestBody {
  query: string;
  user_id?: string | null;
  selectedModels: string[];
  responses: Record<string, unknown>;
}

export async function POST(req: NextRequest) {
  try {
    let body: QueryRequestBody;
    try {
      body = await req.json();
    } catch (err) {
      console.error("[/api/queries] Failed to parse JSON body:", err);
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { query, user_id, selectedModels, responses } = body || {};
    console.log("[/api/queries] Request body:", body);

    // Validate required fields and types
    if (!query || typeof query !== "string" || !query.trim()) {
      console.error("[/api/queries] Missing or invalid 'query' field");
      return NextResponse.json({ error: "Missing or invalid 'query' field" }, { status: 400 });
    }
    if (!selectedModels || !Array.isArray(selectedModels) || selectedModels.length === 0) {
      console.error("[/api/queries] Missing or invalid 'selectedModels' field");
      return NextResponse.json({ error: "Missing or invalid 'selectedModels' field" }, { status: 400 });
    }
    if (!responses || typeof responses !== "object" || Array.isArray(responses)) {
      console.error("[/api/queries] Missing or invalid 'responses' field");
      return NextResponse.json({ error: "Missing or invalid 'responses' field" }, { status: 400 });
    }

    // Prepare insert object to match the schema
    const insertObj: {
      query_text: string;
      user_id?: string | null;
      selected_models: string[];
      responses: Record<string, unknown>;
    } = {
      query_text: query,
      selected_models: selectedModels,
      responses: responses,
    };
    // user_id can be string or null (for anonymous)
    if (typeof user_id === "string" && user_id.length > 0) {
      insertObj.user_id = user_id;
    } else {
      insertObj.user_id = null;
    }

    let data, error;
    try {
      const result = await supabaseAdmin
        .from("queries")
        .insert(insertObj)
        .select()
        .single();
      data = result.data;
      error = result.error;
    } catch (err) {
      console.error("[/api/queries] Supabase insert exception:", err);
      return NextResponse.json({ error: "Supabase insert exception: " + (err instanceof Error ? err.message : String(err)) }, { status: 500 });
    }

    if (error) {
      // Fallback error message if error is undefined
      const fallbackMsg = "Unknown Supabase error. Check your table schema and types.";
      console.error("[/api/queries] Supabase insert error:", error.message || fallbackMsg);
      return NextResponse.json({ error: error.message || fallbackMsg }, { status: 500 });
    }

    console.log("[/api/queries] Insert success:", data);
    return NextResponse.json({ success: true, query: data }, { status: 200 });
  } catch (err: unknown) {
    console.error("[/api/queries] Exception:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 