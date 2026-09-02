import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase admin environment variables are missing.");
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey);
}

async function isAdmin(request: Request) {
  const { createClient } = await import("@/lib/supabase/server");

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return false;
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  return (
    Boolean(adminEmail) &&
    user.email.trim().toLowerCase() === adminEmail
  );
}

export async function PATCH(request: Request) {
  try {
    const admin = await isAdmin(request);

    if (!admin) {
      return NextResponse.json(
        { error: "Forbidden." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const id =
      typeof body.id === "string" ? body.id.trim() : "";

    const action =
      typeof body.action === "string"
        ? body.action.trim()
        : "";

    if (!id) {
      return NextResponse.json(
        { error: "Feedback ID is required." },
        { status: 400 }
      );
    }

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("feedback")
      .update({
        is_approved: action === "approve",
      })
      .eq("id", id)
      .select(
        "id, rating, message, category, display_name, business_name, is_public, is_approved, created_at"
      )
      .single();

    if (error) {
      console.error("Admin feedback update error:", error);

      return NextResponse.json(
        { error: "Unable to update feedback." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      feedback: data,
    });
  } catch (error) {
    console.error("Admin feedback API error:", error);

    return NextResponse.json(
      { error: "Unable to update feedback." },
      { status: 500 }
    );
  }
}