import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import TrackedActionButton from "@/components/TrackedActionButton";
import { ProfileViewTracker } from "@/components/AnalyticsTracker";

import {
  getBusinessInitials,
  getContrastTextColor,
  getMutedTextColor,
} from "@/lib/color";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

type Action = {
  id: string;
  title: string;
  type: string;
  url: string;
  external: boolean;
};

export default async function BusinessPage({
  params,
}: Props) {
  const { slug } = await params;

  const supabase = await createClient();

  const {
    data: business,
    error,
  } = await supabase
    .from("businesses")
    .select(`
      id,
      name,
      slug,
      description,
      logo_url,
      phone,
      whatsapp,
      email,
      location,
      theme_color,
      background_color,
      button_style
    `)
    .eq("slug", slug)
    .single();

  if (error || !business) {
    notFound();
  }

  const { data: links } = await supabase
    .from("links")
    .select(`
      id,
      title,
      url,
      type,
      position
    `)
    .eq("business_id", business.id)
    .eq("active", true)
    .order("position", {
      ascending: true,
    });

  const themeColor =
    business.theme_color || "#111827";

  const backgroundColor =
    business.background_color || "#F9FAFB";

  const buttonStyle =
    business.button_style || "rounded";

  const buttonStyles = {
    rounded: "1rem",
    square: "0.25rem",
    pill: "9999px",
  };

  const buttonRadius =
    buttonStyles[
      buttonStyle as keyof typeof buttonStyles
    ] || "1rem";

  const textColor =
    getContrastTextColor(backgroundColor);

  const mutedTextColor =
    getMutedTextColor(backgroundColor);

  const automaticActions: Action[] = [];

  const customActions: Action[] = [];

  if (business.phone) {
    automaticActions.push({
      id: "phone",
      title: "Call",
      type: "call",
      url: `tel:${business.phone}`,
      external: false,
    });
  }

  if (business.whatsapp) {
    automaticActions.push({
      id: "whatsapp",
      title: "WhatsApp",
      type: "whatsapp",
      url: `https://wa.me/${business.whatsapp.replace(
        /\D/g,
        ""
      )}`,
      external: true,
    });
  }

  if (business.email) {
    automaticActions.push({
      id: "email",
      title: "Email",
      type: "email",
      url: `mailto:${business.email}`,
      external: false,
    });
  }

  if (business.location) {
    automaticActions.push({
      id: "location",
      title: "Location",
      type: "location",
      url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        business.location
      )}`,
      external: true,
    });
  }

  if (links) {
    links.forEach((link) => {
      customActions.push({
        id: link.id,
        title: link.title,
        type: link.type,
        url: link.url,
        external: ![
          "call",
          "whatsapp",
          "email",
        ].includes(link.type),
      });
    });
  }

  const allActions = [
    ...automaticActions,
    ...customActions,
  ];

  return (
    <main
      className="min-h-screen px-4 py-10 sm:px-5 sm:py-14"
      style={{
        backgroundColor,
        color: textColor,
      }}
    >
      <ProfileViewTracker
        businessId={business.id}
      />

      <div className="mx-auto max-w-md">
        <section className="text-center">
          {business.logo_url ? (
            <img
              src={business.logo_url}
              alt={`${business.name} logo`}
              className="mx-auto h-24 w-24 rounded-3xl border border-black/10 bg-white object-cover shadow-sm"
            />
          ) : (
            <div
              className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl border border-black/10 bg-white text-xl font-bold shadow-sm"
              style={{
                color: themeColor,
              }}
            >
              {getBusinessInitials(
                business.name
              )}
            </div>
          )}

          <h1 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
            {business.name}
          </h1>

          {business.description ? (
            <p
              className="mx-auto mt-3 max-w-sm text-sm leading-6"
              style={{
                color: mutedTextColor,
              }}
            >
              {business.description}
            </p>
          ) : (
            <p
              className="mx-auto mt-3 max-w-sm text-sm"
              style={{
                color: mutedTextColor,
              }}
            >
              Connect with {business.name}.
            </p>
          )}
        </section>

        {automaticActions.length > 0 && (
          <section className="mt-10">
            {customActions.length > 0 && (
              <p
                className="mb-3 text-xs font-semibold uppercase tracking-[0.16em]"
                style={{
                  color: mutedTextColor,
                }}
              >
                Contact
              </p>
            )}

            <div className="space-y-3">
              {automaticActions.map(
                (action) => (
                  <TrackedActionButton
                    key={action.id}
                    businessId={business.id}
                    linkId={null}
                    title={action.title}
                    type={action.type}
                    url={action.url}
                    external={action.external}
                    buttonRadius={buttonRadius}
                    themeColor={themeColor}
                  />
                )
              )}
            </div>
          </section>
        )}

        {customActions.length > 0 && (
          <section className="mt-8">
            {automaticActions.length > 0 && (
              <p
                className="mb-3 text-xs font-semibold uppercase tracking-[0.16em]"
                style={{
                  color: mutedTextColor,
                }}
              >
                More
              </p>
            )}

            <div className="space-y-3">
              {customActions.map(
                (action) => (
                  <TrackedActionButton
                    key={action.id}
                    businessId={business.id}
                    linkId={action.id}
                    title={action.title}
                    type={action.type}
                    url={action.url}
                    external={action.external}
                    buttonRadius={buttonRadius}
                    themeColor={themeColor}
                  />
                )
              )}
            </div>
          </section>
        )}

        {allActions.length === 0 && (
          <section className="mt-10 rounded-2xl border border-dashed border-gray-300 bg-white/70 p-7 text-center shadow-sm">
            <h2 className="font-semibold text-gray-900">
              No actions available yet
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              This business has not added any
              contact details or links yet.
            </p>
          </section>
        )}

        <footer
          className="mt-14 pb-4 text-center"
          style={{
            color: mutedTextColor,
          }}
        >
          <p className="text-xs">
            Digital business profile
          </p>
        </footer>
      </div>
    </main>
  );
}