"use client";

import { useEffect, useRef } from "react";

type ProfileViewTrackerProps = {
  businessId: string;
};

type ActionClickTrackerProps = {
  businessId: string;
  linkId?: string | null;
  actionName: string;
};

async function recordAnalyticsEvent({
  businessId,
  linkId = null,
  eventType,
  actionName = null,
}: {
  businessId: string;
  linkId?: string | null;
  eventType: "profile_view" | "action_click";
  actionName?: string | null;
}) {
  try {
    const response = await fetch("/api/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        business_id: businessId,
        link_id: linkId,
        event_type: eventType,
        action_name: actionName,
      }),
      keepalive: true,
      cache: "no-store",
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);

      console.error(
        "Analytics tracking failed:",
        data?.error || `HTTP ${response.status}`
      );
    }
  } catch (error) {
    console.error("Analytics tracking request failed:", error);
  }
}

export function ProfileViewTracker({
  businessId,
}: ProfileViewTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;

    tracked.current = true;

    void recordAnalyticsEvent({
      businessId,
      eventType: "profile_view",
    });
  }, [businessId]);

  return null;
}

export function trackActionClick({
  businessId,
  linkId = null,
  actionName,
}: ActionClickTrackerProps) {
  void recordAnalyticsEvent({
    businessId,
    linkId,
    eventType: "action_click",
    actionName,
  });
}