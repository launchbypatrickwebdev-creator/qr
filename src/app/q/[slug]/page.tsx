import { notFound } from "next/navigation";

import { ExternalLink } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import ActionIcon from "@/components/ActionIcon";

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

  const supabase =
    await createClient();

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

  const { data: links } =
    await supabase
      .from("links")
      .select(`
        id,
        title,
        url,
        type,
        position
      `)
      .eq(
        "business_id",
        business.id
      )
      .eq("active", true)
      .order("position", {
        ascending: true,
      });

  const themeColor =
    business.theme_color ||
    "#111827";

  const backgroundColor =
    business.background_color ||
    "#F9FAFB";

  const buttonStyle =
      business.button_style ||
      "rounded";

    const buttonStyles = {
      rounded: "1rem",
      square: "0.25rem",
      pill: "9999px",
    };

    const buttonRadius =
      buttonStyles[buttonStyle as keyof typeof buttonStyles] || "1rem";

  const textColor =
    getContrastTextColor(
      backgroundColor
    );

  const mutedTextColor =
    getMutedTextColor(
      backgroundColor
    );

  const automaticActions: Action[] =
    [];

  const customActions: Action[] =
    [];

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

  function ActionButton({
    action,
  }: {
    action: Action;
  }) {
    return (
      <a
        href={action.url}
        target={
          action.external
            ? "_blank"
            : undefined
        }
        rel={
          action.external
            ? "noopener noreferrer"
            : undefined
        }
        className="group flex min-h-[68px] items-center gap-4 border bg-white/95 px-4 py-3 text-gray-900 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
        style={{
          borderRadius: buttonRadius,
          borderColor:
            "rgba(0,0,0,0.08)",
        }}
      >
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center text-white shadow-sm"
          style={{
            backgroundColor:
              themeColor,
            borderRadius:
              buttonRadius,
          }}
        >
          <ActionIcon
            type={action.type}
          />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-left text-sm font-semibold">
            {action.title}
          </span>
        </span>

        {action.external && (
          <ExternalLink
            className="h-4 w-4 shrink-0 text-gray-400 transition group-hover:text-gray-700"
            strokeWidth={2}
          />
        )}
      </a>
    );
  }

  return (
    <main
      className="min-h-screen px-4 py-10 sm:px-5 sm:py-14"
      style={{
        backgroundColor,
        color: textColor,
      }}
    >
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
                color:
                  mutedTextColor,
              }}
            >
              {business.description}
            </p>
          ) : (
            <p
              className="mx-auto mt-3 max-w-sm text-sm"
              style={{
                color:
                  mutedTextColor,
              }}
            >
              Connect with{" "}
              {business.name}.
            </p>
          )}
        </section>

        {automaticActions.length >
          0 && (
          <section className="mt-10">
            {customActions.length >
              0 && (
              <p
                className="mb-3 text-xs font-semibold uppercase tracking-[0.16em]"
                style={{
                  color:
                    mutedTextColor,
                }}
              >
                Contact
              </p>
            )}

            <div className="space-y-3">
              {automaticActions.map(
                (action) => (
                  <ActionButton
                    key={action.id}
                    action={action}
                  />
                )
              )}
            </div>
          </section>
        )}

        {customActions.length >
          0 && (
          <section className="mt-8">
            {automaticActions.length >
              0 && (
              <p
                className="mb-3 text-xs font-semibold uppercase tracking-[0.16em]"
                style={{
                  color:
                    mutedTextColor,
                }}
              >
                More
              </p>
            )}

            <div className="space-y-3">
              {customActions.map(
                (action) => (
                  <ActionButton
                    key={action.id}
                    action={action}
                  />
                )
              )}
            </div>
          </section>
        )}

        {allActions.length ===
          0 && (
          <section
            className="mt-10 rounded-2xl border border-dashed border-gray-300 bg-white/70 p-7 text-center shadow-sm"
          >
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
            color:
              mutedTextColor,
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