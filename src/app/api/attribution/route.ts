import { NextResponse } from "next/server";

import { adminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const SOURCE_MAX = 50;
const MEDIUM_MAX = 50;
const CAMPAIGN_MAX = 150;
const CONTENT_MAX = 150;
const PATH_MAX = 500;
const REFERRER_MAX = 300;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const EVENT_TYPES = [
  "signup",
  "business_created",
  "identified",
] as const;

type EventType =
  (typeof EVENT_TYPES)[number];

type AttributionBody = {
  mode?: unknown;
  visitor_id?: unknown;
  source?: unknown;
  medium?: unknown;
  campaign?: unknown;
  content?: unknown;
  landing_path?: unknown;
  referrer_origin?: unknown;
  event_type?: unknown;
  business_id?: unknown;
};

function cleanText(
  value: unknown,
  maxLength: number
) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  return trimmed.slice(0, maxLength);
}

function cleanSource(value: unknown) {
  const source = cleanText(
    value,
    SOURCE_MAX
  );

  if (!source) {
    return "direct";
  }

  return source.toLowerCase();
}

function validVisitorId(value: unknown) {
  return (
    typeof value === "string" &&
    UUID_PATTERN.test(value.trim())
  );
}

async function getAuthenticatedUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

async function captureAttribution(
  body: AttributionBody
) {
  const visitorId =
    typeof body.visitor_id === "string"
      ? body.visitor_id.trim()
      : "";

  if (!validVisitorId(visitorId)) {
    return NextResponse.json(
      {
        error:
          "A valid visitor ID is required.",
      },
      { status: 400 }
    );
  }

  const source = cleanSource(body.source);

  const medium = cleanText(
    body.medium,
    MEDIUM_MAX
  );

  const campaign = cleanText(
    body.campaign,
    CAMPAIGN_MAX
  );

  const content = cleanText(
    body.content,
    CONTENT_MAX
  );

  const landingPath = cleanText(
    body.landing_path,
    PATH_MAX
  );

  const referrerOrigin = cleanText(
    body.referrer_origin,
    REFERRER_MAX
  );

  const now = new Date().toISOString();

  const {
    data: existing,
    error: lookupError,
  } = await adminClient
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
      {
        error:
          "Unable to load attribution.",
      },
      { status: 500 }
    );
  }

  /*
   * First-touch attribution:
   *
   * Once a visitor has been recorded,
   * subsequent visits do not replace
   * their original source/campaign.
   */
  if (existing) {
    const {
      error: updateError,
    } = await adminClient
      .from("marketing_attributions")
      .update({
        last_seen_at: now,
      })
      .eq("id", existing.id);

    if (updateError) {
      console.error(
        "Attribution update error:",
        updateError
      );

      return NextResponse.json(
        {
          error:
            "Unable to update attribution.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      attribution_id: existing.id,
      first_touch: false,
    });
  }

  const {
    data,
    error,
  } = await adminClient
    .from("marketing_attributions")
    .insert({
      visitor_id: visitorId,
      source,
      medium,
      campaign,
      content,
      landing_path: landingPath,
      referrer_origin: referrerOrigin,
      first_seen_at: now,
      last_seen_at: now,
    })
    .select("id")
    .single();

  if (error) {
    console.error(
      "Attribution insert error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to record attribution.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    attribution_id: data.id,
    first_touch: true,
  });
}

async function recordEvent(
  body: AttributionBody
) {
  const visitorId =
    typeof body.visitor_id === "string"
      ? body.visitor_id.trim()
      : "";

  if (!validVisitorId(visitorId)) {
    return NextResponse.json(
      {
        error:
          "A valid visitor ID is required.",
      },
      { status: 400 }
    );
  }

  const eventType =
    cleanText(
      body.event_type,
      50
    ) as EventType | null;

  if (
    !eventType ||
    !EVENT_TYPES.includes(eventType)
  ) {
    return NextResponse.json(
      {
        error:
          "Invalid attribution event type.",
      },
      { status: 400 }
    );
  }

  const user =
    await getAuthenticatedUser();

  /*
   * Signup is allowed without an
   * authenticated session because
   * email confirmation may be enabled.
   */
  if (
    eventType !== "signup" &&
    !user
  ) {
    return NextResponse.json(
      {
        error:
          "Authentication is required for this event.",
      },
      { status: 401 }
    );
  }

  const {
    data: attribution,
    error: attributionError,
  } = await adminClient
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
      {
        error:
          "Unable to find attribution.",
      },
      { status: 500 }
    );
  }

  if (!attribution) {
    return NextResponse.json(
      {
        error:
          "Attribution not found.",
      },
      { status: 404 }
    );
  }

  const businessId =
    cleanText(
      body.business_id,
      100
    );

  /*
   * BUSINESS CREATED
   */
  if (
    eventType === "business_created"
  ) {
    if (!businessId || !user) {
      return NextResponse.json(
        {
          error:
            "Business information is required.",
        },
        { status: 400 }
      );
    }

    const {
      data: business,
      error: businessError,
    } = await adminClient
      .from("businesses")
      .select("id, owner_id")
      .eq("id", businessId)
      .maybeSingle();

    if (businessError) {
      console.error(
        "Attribution business lookup error:",
        businessError
      );

      return NextResponse.json(
        {
          error:
            "Unable to verify business.",
        },
        { status: 500 }
      );
    }

    if (
      !business ||
      business.owner_id !== user.id
    ) {
      return NextResponse.json(
        {
          error:
            "Business not found.",
        },
        { status: 404 }
      );
    }

    const {
      error: attributionUpdateError,
    } = await adminClient
      .from("marketing_attributions")
      .update({
        user_id: user.id,
        last_seen_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        attribution.id
      );

    if (attributionUpdateError) {
      console.error(
        "Attribution user association error:",
        attributionUpdateError
      );

      return NextResponse.json(
        {
          error:
            "Unable to associate attribution.",
        },
        { status: 500 }
      );
    }

    const {
      data: existingEvent,
    } = await adminClient
      .from(
        "marketing_attribution_events"
      )
      .select("id")
      .eq(
        "attribution_id",
        attribution.id
      )
      .eq(
        "event_type",
        "business_created"
      )
      .eq(
        "business_id",
        businessId
      )
      .maybeSingle();

    if (!existingEvent) {
      const {
        error: eventError,
      } = await adminClient
        .from(
          "marketing_attribution_events"
        )
        .insert({
          attribution_id:
            attribution.id,
          event_type: eventType,
          user_id: user.id,
          business_id: businessId,
        });

      if (eventError) {
        console.error(
          "Business attribution event error:",
          eventError
        );

        return NextResponse.json(
          {
            error:
              "Unable to record business creation.",
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
    });
  }

  /*
   * IDENTIFIED
   */
  if (
    eventType === "identified"
  ) {
    if (!user) {
      return NextResponse.json(
        {
          error:
            "Authentication is required.",
        },
        { status: 401 }
      );
    }

    const {
      error: updateError,
    } = await adminClient
      .from("marketing_attributions")
      .update({
        user_id: user.id,
        last_seen_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        attribution.id
      );

    if (updateError) {
      console.error(
        "Attribution identification error:",
        updateError
      );

      return NextResponse.json(
        {
          error:
            "Unable to identify attribution.",
        },
        { status: 500 }
      );
    }

    const {
      data: existingEvent,
    } = await adminClient
      .from(
        "marketing_attribution_events"
      )
      .select("id")
      .eq(
        "attribution_id",
        attribution.id
      )
      .eq(
        "event_type",
        "identified"
      )
      .maybeSingle();

    if (!existingEvent) {
      const {
        error: eventError,
      } = await adminClient
        .from(
          "marketing_attribution_events"
        )
        .insert({
          attribution_id:
            attribution.id,
          event_type:
            "identified",
          user_id: user.id,
        });

      if (eventError) {
        console.error(
          "Attribution identified event error:",
          eventError
        );

        return NextResponse.json(
          {
            error:
              "Unable to record identification.",
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
    });
  }

  /*
   * SIGNUP
   *
   * We intentionally don't trust a
   * client-supplied user ID here.
   */
  const {
    data: existingEvent,
  } = await adminClient
    .from(
      "marketing_attribution_events"
    )
    .select("id")
    .eq(
      "attribution_id",
      attribution.id
    )
    .eq(
      "event_type",
      "signup"
    )
    .maybeSingle();

  if (!existingEvent) {
    const {
      error: eventError,
    } = await adminClient
      .from(
        "marketing_attribution_events"
      )
      .insert({
        attribution_id:
          attribution.id,
        event_type: "signup",
        user_id:
          user?.id ?? null,
      });

    if (eventError) {
      console.error(
        "Signup attribution event error:",
        eventError
      );

      return NextResponse.json(
        {
          error:
            "Unable to record signup.",
        },
        { status: 500 }
      );
    }
  }

  if (user) {
    await adminClient
      .from("marketing_attributions")
      .update({
        user_id: user.id,
        last_seen_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        attribution.id
      );
  }

  return NextResponse.json({
    success: true,
  });
}

export async function POST(
  request: Request
) {
  try {
    const body =
      (await request.json()) as AttributionBody;

    const mode =
      cleanText(
        body.mode,
        30
      ) || "capture";

    if (mode === "capture") {
      return captureAttribution(body);
    }

    if (mode === "event") {
      return recordEvent(body);
    }

    return NextResponse.json(
      {
        error:
          "Invalid attribution mode.",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error(
      "Attribution API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to process attribution request.",
      },
      { status: 500 }
    );
  }
}