import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const MAX_SOURCE_LENGTH = 50;
const MAX_MEDIUM_LENGTH = 50;
const MAX_CAMPAIGN_LENGTH = 150;
const MAX_CONTENT_LENGTH = 150;
const MAX_LANDING_PATH_LENGTH = 500;
const MAX_REFERRER_LENGTH = 300;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const EVENT_TYPES = [
  "signup",
  "business_created",
  "identified",
] as const;

type AttributionEventType = (typeof EVENT_TYPES)[number];

function cleanString(
  value: unknown,
  maxLength: number
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const cleaned = value.trim();

  if (!cleaned) {
    return null;
  }

  return cleaned.slice(0, maxLength);
}

function isValidUuid(value: unknown): value is string {
  return (
    typeof value === "string" &&
    UUID_PATTERN.test(value)
  );
}

function isEventType(
  value: unknown
): value is AttributionEventType {
  return (
    typeof value === "string" &&
    EVENT_TYPES.includes(
      value as AttributionEventType
    )
  );
}

async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

async function captureAttribution(body: Record<string, unknown>) {
  const visitorId = body.visitor_id;

  if (!isValidUuid(visitorId)) {
    return NextResponse.json(
      { error: "Invalid visitor_id." },
      { status: 400 }
    );
  }

  const source =
    cleanString(body.source, MAX_SOURCE_LENGTH) ||
    "direct";

  const medium = cleanString(
    body.medium,
    MAX_MEDIUM_LENGTH
  );

  const campaign = cleanString(
    body.campaign,
    MAX_CAMPAIGN_LENGTH
  );

  const content = cleanString(
    body.content,
    MAX_CONTENT_LENGTH
  );

  const landingPath = cleanString(
    body.landing_path,
    MAX_LANDING_PATH_LENGTH
  );

  const referrerOrigin = cleanString(
    body.referrer_origin,
    MAX_REFERRER_LENGTH
  );

  /*
   * First, see whether this visitor already has
   * an attribution record.
   *
   * This preserves first-touch attribution.
   */
  const { data: existing, error: lookupError } =
    await adminClient
      .from("marketing_attributions")
      .select("id")
      .eq("visitor_id", visitorId)
      .maybeSingle();

  if (lookupError) {
    console.error(
      "Attribution lookup error:",
      lookupError
    );

    return NextResponse.json(
      { error: "Unable to check attribution." },
      { status: 500 }
    );
  }

  /*
   * Existing visitor:
   * update only last_seen_at.
   *
   * We deliberately do NOT overwrite source,
   * campaign, content, etc. because this is
   * first-touch attribution.
   */
  if (existing) {
    const { error: updateError } = await adminClient
      .from("marketing_attributions")
      .update({
        last_seen_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (updateError) {
      console.error(
        "Attribution update error:",
        updateError
      );

      return NextResponse.json(
        { error: "Unable to update attribution." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      attribution_id: existing.id,
      existing: true,
    });
  }

  /*
   * No record exists yet.
   *
   * There can still be a race condition here if
   * another request inserts the same visitor between
   * our lookup and this insert.
   *
   * The unique constraint protects the database.
   * If that happens, we recover gracefully below.
   */
  const { data: inserted, error: insertError } =
    await adminClient
      .from("marketing_attributions")
      .insert({
        visitor_id: visitorId,
        source,
        medium,
        campaign,
        content,
        landing_path: landingPath,
        referrer_origin: referrerOrigin,
      })
      .select("id")
      .single();

  if (insertError) {
    /*
     * PostgreSQL error 23505 = unique violation.
     *
     * This is expected if two capture requests
     * arrive at nearly the same time.
     *
     * Instead of returning 500, retrieve the
     * record that won the race and continue normally.
     */
    if (insertError.code === "23505") {
      const { data: raceWinner, error: raceLookupError } =
        await adminClient
          .from("marketing_attributions")
          .select("id")
          .eq("visitor_id", visitorId)
          .maybeSingle();

      if (raceLookupError) {
        console.error(
          "Attribution duplicate recovery lookup error:",
          raceLookupError
        );

        return NextResponse.json(
          { error: "Unable to recover attribution." },
          { status: 500 }
        );
      }

      if (raceWinner) {
        return NextResponse.json({
          success: true,
          attribution_id: raceWinner.id,
          existing: true,
        });
      }
    }

    console.error(
      "Attribution insert error:",
      insertError
    );

    return NextResponse.json(
      { error: "Unable to save attribution." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    attribution_id: inserted.id,
    existing: false,
  });
}

async function recordEvent(body: Record<string, unknown>) {
  const visitorId = body.visitor_id;
  const eventType = body.event_type;

  if (!isValidUuid(visitorId)) {
    return NextResponse.json(
      { error: "Invalid visitor_id." },
      { status: 400 }
    );
  }

  if (!isEventType(eventType)) {
    return NextResponse.json(
      { error: "Invalid event_type." },
      { status: 400 }
    );
  }

  const user = await getCurrentUser();

  /*
   * Find the visitor's original attribution.
   */
  const { data: attribution, error: attributionError } =
    await adminClient
      .from("marketing_attributions")
      .select("id")
      .eq("visitor_id", visitorId)
      .maybeSingle();

  if (attributionError) {
    console.error(
      "Attribution event lookup error:",
      attributionError
    );

    return NextResponse.json(
      { error: "Unable to find attribution." },
      { status: 500 }
    );
  }

  /*
   * If the event happens before attribution capture,
   * there is nothing meaningful to attach it to.
   */
  if (!attribution) {
    return NextResponse.json({
      success: true,
      skipped: true,
      reason: "No attribution record found.",
    });
  }

  /*
   * business_created requires an authenticated
   * user and a valid business belonging to that user.
   */
  if (eventType === "business_created") {
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const businessId = body.business_id;

    if (!isValidUuid(businessId)) {
      return NextResponse.json(
        { error: "Invalid business_id." },
        { status: 400 }
      );
    }

    const { data: business, error: businessError } =
      await adminClient
        .from("businesses")
        .select("id, owner_id")
        .eq("id", businessId)
        .maybeSingle();

    if (businessError) {
      console.error(
        "Business lookup error:",
        businessError
      );

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

    if (business.owner_id !== user.id) {
      return NextResponse.json(
        { error: "You do not own this business." },
        { status: 403 }
      );
    }

    /*
     * Associate the attribution with the authenticated
     * user once we know who they are.
     */
    const { error: attributionUpdateError } =
      await adminClient
        .from("marketing_attributions")
        .update({
          user_id: user.id,
          last_seen_at: new Date().toISOString(),
        })
        .eq("id", attribution.id);

    if (attributionUpdateError) {
      console.error(
        "Attribution user update error:",
        attributionUpdateError
      );

      return NextResponse.json(
        { error: "Unable to associate attribution." },
        { status: 500 }
      );
    }

    /*
     * Check whether this business-created event
     * has already been recorded.
     */
    const { data: existingEvent, error: eventLookupError } =
      await adminClient
        .from("marketing_attribution_events")
        .select("id")
        .eq("attribution_id", attribution.id)
        .eq("event_type", "business_created")
        .eq("business_id", businessId)
        .maybeSingle();

    if (eventLookupError) {
      console.error(
        "Business event lookup error:",
        eventLookupError
      );

      return NextResponse.json(
        { error: "Unable to check business event." },
        { status: 500 }
      );
    }

    if (existingEvent) {
      return NextResponse.json({
        success: true,
        existing: true,
      });
    }

    const { error: insertError } =
      await adminClient
        .from("marketing_attribution_events")
        .insert({
          attribution_id: attribution.id,
          event_type: "business_created",
          user_id: user.id,
          business_id: businessId,
        });

    if (insertError) {
      /*
       * If the unique index is already installed and
       * another request won the race, treat it as success.
       */
      if (insertError.code === "23505") {
        return NextResponse.json({
          success: true,
          existing: true,
        });
      }

      console.error(
        "Business attribution event insert error:",
        insertError
      );

      return NextResponse.json(
        { error: "Unable to record business event." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      existing: false,
    });
  }

  /*
   * For signup and identified events:
   * associate the attribution with the user when
   * authentication is available.
   *
   * Signup is intentionally allowed without a session
   * because email confirmation may happen later.
   */
  if (eventType === "signup") {
    if (user) {
      const { error: updateError } =
        await adminClient
          .from("marketing_attributions")
          .update({
            user_id: user.id,
            last_seen_at: new Date().toISOString(),
          })
          .eq("id", attribution.id);

      if (updateError) {
        console.error(
          "Signup attribution update error:",
          updateError
        );

        return NextResponse.json(
          { error: "Unable to associate signup." },
          { status: 500 }
        );
      }
    }

    const { data: existingEvent, error: eventLookupError } =
      await adminClient
        .from("marketing_attribution_events")
        .select("id")
        .eq("attribution_id", attribution.id)
        .eq("event_type", "signup")
        .maybeSingle();

    if (eventLookupError) {
      console.error(
        "Signup event lookup error:",
        eventLookupError
      );

      return NextResponse.json(
        { error: "Unable to check signup event." },
        { status: 500 }
      );
    }

    if (existingEvent) {
      return NextResponse.json({
        success: true,
        existing: true,
      });
    }

    const { error: insertError } =
      await adminClient
        .from("marketing_attribution_events")
        .insert({
          attribution_id: attribution.id,
          event_type: "signup",
          user_id: user?.id ?? null,
        });

    if (insertError) {
      if (insertError.code === "23505") {
        return NextResponse.json({
          success: true,
          existing: true,
        });
      }

      console.error(
        "Signup attribution event insert error:",
        insertError
      );

      return NextResponse.json(
        { error: "Unable to record signup." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      existing: false,
    });
  }

  /*
   * identified
   */
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 }
    );
  }

  const { error: attributionUpdateError } =
    await adminClient
      .from("marketing_attributions")
      .update({
        user_id: user.id,
        last_seen_at: new Date().toISOString(),
      })
      .eq("id", attribution.id);

  if (attributionUpdateError) {
    console.error(
      "Identification attribution update error:",
      attributionUpdateError
    );

    return NextResponse.json(
      { error: "Unable to identify attribution." },
      { status: 500 }
    );
  }

  const { data: existingEvent, error: eventLookupError } =
    await adminClient
      .from("marketing_attribution_events")
      .select("id")
      .eq("attribution_id", attribution.id)
      .eq("event_type", "identified")
      .maybeSingle();

  if (eventLookupError) {
    console.error(
      "Identification event lookup error:",
      eventLookupError
    );

    return NextResponse.json(
      { error: "Unable to check identification event." },
      { status: 500 }
    );
  }

  if (existingEvent) {
    return NextResponse.json({
      success: true,
      existing: true,
    });
  }

  const { error: insertError } =
    await adminClient
      .from("marketing_attribution_events")
      .insert({
        attribution_id: attribution.id,
        event_type: "identified",
        user_id: user.id,
      });

  if (insertError) {
    if (insertError.code === "23505") {
      return NextResponse.json({
        success: true,
        existing: true,
      });
    }

    console.error(
      "Identification attribution event insert error:",
      insertError
    );

    return NextResponse.json(
      { error: "Unable to record identification." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    existing: false,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const mode = body.mode;

    if (mode === "capture") {
      return await captureAttribution(body);
    }

    if (mode === "event") {
      return await recordEvent(body);
    }

    return NextResponse.json(
      { error: "Invalid attribution mode." },
      { status: 400 }
    );
  } catch (error) {
    console.error(
      "Attribution route error:",
      error
    );

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}