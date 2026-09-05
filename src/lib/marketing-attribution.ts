"use client";

const VISITOR_STORAGE_KEY = "qr_marketing_visitor_id";

const VISITOR_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function getVisitorId() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const existing = window.localStorage.getItem(
      VISITOR_STORAGE_KEY
    );

    if (
      existing &&
      VISITOR_ID_PATTERN.test(existing)
    ) {
      return existing;
    }

    const visitorId = crypto.randomUUID();

    window.localStorage.setItem(
      VISITOR_STORAGE_KEY,
      visitorId
    );

    return visitorId;
  } catch {
    try {
      return crypto.randomUUID();
    } catch {
      return null;
    }
  }
}

function getParameter(
  params: URLSearchParams,
  primary: string,
  fallback: string
) {
  return (
    params.get(primary)?.trim() ||
    params.get(fallback)?.trim() ||
    null
  );
}

export async function captureMarketingAttribution() {
  if (typeof window === "undefined") {
    return;
  }

  const visitorId = getVisitorId();

  if (!visitorId) {
    return;
  }

  const params = new URLSearchParams(
    window.location.search
  );

  const source = getParameter(
    params,
    "source",
    "utm_source"
  );

  const medium = getParameter(
    params,
    "medium",
    "utm_medium"
  );

  const campaign = getParameter(
    params,
    "campaign",
    "utm_campaign"
  );

  const content = getParameter(
    params,
    "content",
    "utm_content"
  );

  let referrerOrigin: string | null = null;

  if (document.referrer) {
    try {
      referrerOrigin = new URL(
        document.referrer
      ).origin;
    } catch {
      referrerOrigin = null;
    }
  }

  try {
    await fetch("/api/attribution", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: "capture",
        visitor_id: visitorId,
        source: source || "direct",
        medium,
        campaign,
        content,
        landing_path:
          `${window.location.pathname}${window.location.search}`,
        referrer_origin: referrerOrigin,
      }),
      keepalive: true,
    });
  } catch (error) {
    console.error(
      "Marketing attribution capture failed:",
      error
    );
  }
}

export async function recordMarketingEvent(
  eventType:
    | "signup"
    | "business_created"
    | "identified",
  businessId?: string
) {
  if (typeof window === "undefined") {
    return;
  }

  const visitorId = getVisitorId();

  if (!visitorId) {
    return;
  }

  try {
    await fetch("/api/attribution", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: "event",
        visitor_id: visitorId,
        event_type: eventType,
        business_id: businessId || undefined,
      }),
      keepalive: true,
    });
  } catch (error) {
    console.error(
      `Marketing attribution event failed (${eventType}):`,
      error
    );
  }
}

export function getMarketingVisitorId() {
  return getVisitorId();
}