"use client";

import { useEffect, useRef } from "react";

import { createClient } from "@/lib/supabase/client";

type ProfileViewTrackerProps = {
  businessId: string;
};

type ActionClickTrackerProps = {
  businessId: string;
  linkId?: string | null;
  actionName: string;
};

export function ProfileViewTracker({
  businessId,
}: ProfileViewTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) {
      return;
    }

    tracked.current = true;

    const supabase = createClient();

    void supabase.rpc("track_analytics_event", {
      p_business_id: businessId,
      p_link_id: null,
      p_event_type: "profile_view",
      p_action_name: null,
    });
  }, [businessId]);

  return null;
}

export function trackActionClick({
  businessId,
  linkId = null,
  actionName,
}: ActionClickTrackerProps) {
  const supabase = createClient();

  void supabase.rpc("track_analytics_event", {
    p_business_id: businessId,
    p_link_id: linkId,
    p_event_type: "action_click",
    p_action_name: actionName,
  });
}