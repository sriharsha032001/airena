import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Admin client for elevated privileges
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function noStore(res: NextResponse) {
  res.headers.set('Cache-Control', 'no-store');
  return res;
}

export async function POST(req: NextRequest) {
  try {
    const { userId, cost } = await req.json();

    if (!userId || !cost) {
      return noStore(NextResponse.json({ error: "Missing required parameters" }, { status: 400 }));
    }

    // Use RPC to call a Postgres function for atomic deduction
    const { data, error } = await supabaseAdmin.rpc('deduct_credits', {
      p_cost: cost,
      p_user_id: userId,
    });

    if (error) {
      console.error("RPC Error:", error.message);
      return noStore(NextResponse.json({ error: "Failed to process credits." }, { status: 500 }));
    }

    if (!data) {
      // This means the user did not have enough credits
      return noStore(NextResponse.json({ error: "Not enough credits. Please purchase more from Pricing." }, { status: 402 })); // 402 Payment Required
    }

    // Success
    return noStore(NextResponse.json({ success: true }));

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("Deduct API Error:", errorMessage);
    return noStore(NextResponse.json({ error: "Internal Server Error" }, { status: 500 }));
  }
} 