import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

type AnalyticsBody = {
  business_id?: unknown;
  link_id?: unknown;
  event_type?: unknown;
  action_name?: unknown;
};

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Analytics API: missing Supabase server credentials.");

      return NextResponse.json(
        { error: "Analytics server configuration is missing." },
        { status: 500 }
      );
    }

    const body = (await request.json()) as AnalyticsBody;

    const businessId = cleanText(body.business_id);
    const linkId = cleanText(body.link_id) || null;
    const eventType = cleanText(body.event_type);
    const actionName = cleanText(body.action_name);

    if (!businessId) {
      return NextResponse.json(
        { error: "Business ID is required." },
        { status: 400 }
      );
    }

    if (
      eventType !== "profile_view" &&
      eventType !== "action_click"
    ) {
      return NextResponse.json(
        { error: "Invalid analytics event type." },
        { status: 400 }
      );
    }

    const supabase = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Make sure the business exists.
    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .select("id")
      .eq("id", businessId)
      .maybeSingle();

    if (businessError) {
      console.error("Analytics business lookup error:", businessError);

      return NextResponse.json(
        { error: "Unable to verify business." },
        { status: 500 }
      );
    }

    if (!business) {
      return NextResponse.json(
        { error: "Business not found." },
        { status: 404 }
      );
    }

    if (eventType === "profile_view") {
      const { error } = await supabase
        .from("analytics_events")
        .insert({
          business_id: businessId,
          link_id: null,
          event_type: "profile_view",
          action_name: null,
        });

      if (error) {
        console.error("Analytics profile view insert error:", error);

        return NextResponse.json(
          { error: "Unable to record profile view." },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    }

    if (!actionName) {
      return NextResponse.json(
        { error: "Action name is required." },
        { status: 400 }
      );
    }

    if (actionName.length > 150) {
      return NextResponse.json(
        { error: "Action name is too long." },
        { status: 400 }
      );
    }

    if (linkId) {
      const { data: link, error: linkError } = await supabase
        .from("links")
        .select("id")
        .eq("id", linkId)
        .eq("business_id", businessId)
        .eq("active", true)
        .maybeSingle();

      if (linkError) {
        console.error("Analytics link lookup error:", linkError);

        return NextResponse.json(
          { error: "Unable to verify action." },
          { status: 500 }
        );
      }

      if (!link) {
        return NextResponse.json(
          { error: "Action not found." },
          { status: 404 }
        );
      }
    } else {
      const automaticActions = [
        "call",
        "whatsapp",
        "email",
        "location",
      ];

      if (!automaticActions.includes(actionName.toLowerCase())) {
        return NextResponse.json(
          { error: "Invalid automatic action." },
          { status: 400 }
        );
      }
    }

    const { error } = await supabase
      .from("analytics_events")
      .insert({
        business_id: businessId,
        link_id: linkId,
        event_type: "action_click",
        action_name: actionName,
      });

    if (error) {
      console.error("Analytics action click insert error:", error);

      return NextResponse.json(
        { error: "Unable to record action click." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics API error:", error);

    return NextResponse.json(
      { error: "Unable to record analytics event." },
      { status: 500 }
    );
  }
}