import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/supabase/client";

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      creditsToAdd,
    } = await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Find the user's credits record
      const { data: creditsData, error: creditsError } = await supabase
        .from("user_credits")
        .select("credits")
        .eq("id", userId)
        .single();

      if (creditsError && creditsError.code !== 'PGRST116') { // Ignore error for no rows found
        throw creditsError;
      }

      if (creditsData) {
        // Update existing credits
        const { error: updateError } = await supabase
          .from("user_credits")
          .update({ credits: creditsData.credits + creditsToAdd })
          .eq("id", userId);
          
        if (updateError) throw updateError;
        
      } else {
        // This case should ideally not happen for a logged-in user, but as a fallback:
        const { error: insertError } = await supabase
          .from("user_credits")
          .insert([{ id: userId, credits: creditsToAdd }]);
          
        if (insertError) throw insertError;
      }

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
} 