"use client";

import { ExternalLink } from "lucide-react";

import ActionIcon from "@/components/ActionIcon";
import { trackActionClick } from "@/components/AnalyticsTracker";

type Props = {
  businessId: string;
  linkId?: string | null;
  title: string;
  type: string;
  url: string;
  external: boolean;
  buttonRadius: string;
  themeColor: string;
};

export default function TrackedActionButton({
  businessId,
  linkId = null,
  title,
  type,
  url,
  external,
  buttonRadius,
  themeColor,
}: Props) {
  function handleClick() {
    trackActionClick({
      businessId,
      linkId,
      actionName: title,
    });
  }

  return (
    <a
      href={url}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onClick={handleClick}
      className="group flex min-h-[68px] items-center gap-4 border bg-white/95 px-4 py-3 text-gray-900 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
      style={{
        borderRadius: buttonRadius,
        borderColor: "rgba(0,0,0,0.08)",
      }}
    >
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center text-white shadow-sm"
        style={{
          backgroundColor: themeColor,
          borderRadius: buttonRadius,
        }}
      >
        <ActionIcon type={type} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-left text-sm font-semibold">
          {title}
        </span>
      </span>

      {external && (
        <ExternalLink
          className="h-4 w-4 shrink-0 text-gray-400 transition group-hover:text-gray-700"
          strokeWidth={2}
        />
      )}
    </a>
  );
}