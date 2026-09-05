"use client";

import { useEffect } from "react";

import {
  captureMarketingAttribution,
} from "@/lib/marketing-attribution";

export default function MarketingAttributionTracker() {
  useEffect(() => {
    void captureMarketingAttribution();
  }, []);

  return null;
}