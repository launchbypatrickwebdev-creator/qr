import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_CATEGORIES = [
  "general",
  "experience",
  "bug",
  "feature_request",
  "other",
] as const;

type FeedbackCategory = (typeof ALLOWED_CATEGORIES)[number];

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Honeypot for simple bot protection.
    const website = cleanText(body.website);

    if (website) {
      return NextResponse.json({ success: true });
    }

    const rating = Number(body.rating);
    const message = cleanText(body.message);
    const category = cleanText(body.category) as FeedbackCategory;
    const displayName = cleanText(body.display_name);
    const businessName = cleanText(body.business_name);
    const isPublic = body.is_public === true;

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Please select a rating from 1 to 5 stars." },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        { error: "Please enter your feedback." },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: "Feedback is too long." },
        { status: 400 }
      );
    }

    if (!ALLOWED_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { error: "Please select a valid feedback category." },
        { status: 400 }
      );
    }

    if (displayName.length > 100) {
      return NextResponse.json(
        { error: "Display name is too long." },
        { status: 400 }
      );
    }

    if (businessName.length > 150) {
      return NextResponse.json(
        { error: "Business name is too long." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("feedback")
      .insert({
        user_id: user.id,
        rating,
        message,
        category,
        display_name: isPublic ? displayName || null : null,
        business_name: isPublic ? businessName || null : null,
        is_public: isPublic,
        // is_approved is intentionally omitted.
        // The database default keeps it false.
      });

    if (error) {
      console.error("Feedback submission error:", error);

      return NextResponse.json(
        { error: "Unable to submit your feedback." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Feedback API error:", error);

    return NextResponse.json(
      { error: "Unable to submit your feedback." },
      { status: 500 }
    );
  }
}