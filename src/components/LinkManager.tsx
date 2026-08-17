"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type LinkType =
  | "whatsapp"
  | "call"
  | "instagram"
  | "facebook"
  | "tiktok"
  | "youtube"
  | "linkedin"
  | "website"
  | "location"
  | "email"
  | "booking"
  | "menu"
  | "shop"
  | "portfolio"
  | "custom";

type Link = {
  id: string;
  business_id: string;
  title: string;
  url: string;
  icon: string | null;
  position: number;
  active: boolean;
  type: string;
  value: string | null;
};

type Props = {
  businessId: string;
  initialLinks: Link[];
};

const ACTIONS: {
  type: LinkType;
  label: string;
  fieldLabel: string;
  placeholder: string;
}[] = [
  {
    type: "whatsapp",
    label: "WhatsApp",
    fieldLabel: "WhatsApp number",
    placeholder: "+2348012345678",
  },
  {
    type: "call",
    label: "Call",
    fieldLabel: "Phone number",
    placeholder: "+2348012345678",
  },
  {
    type: "instagram",
    label: "Instagram",
    fieldLabel: "Instagram username",
    placeholder: "yourusername",
  },
  {
    type: "facebook",
    label: "Facebook",
    fieldLabel: "Facebook profile or page URL",
    placeholder: "https://facebook.com/yourpage",
  },
  {
    type: "tiktok",
    label: "TikTok",
    fieldLabel: "TikTok username",
    placeholder: "yourusername",
  },
  {
    type: "youtube",
    label: "YouTube",
    fieldLabel: "YouTube channel URL",
    placeholder: "https://youtube.com/@yourchannel",
  },
  {
    type: "linkedin",
    label: "LinkedIn",
    fieldLabel: "LinkedIn profile URL",
    placeholder: "https://linkedin.com/in/yourname",
  },
  {
    type: "website",
    label: "Website",
    fieldLabel: "Website URL",
    placeholder: "https://yourwebsite.com",
  },
  {
    type: "location",
    label: "Location",
    fieldLabel: "Google Maps URL",
    placeholder: "https://maps.google.com/...",
  },
  {
    type: "email",
    label: "Email",
    fieldLabel: "Email address",
    placeholder: "hello@example.com",
  },
  {
    type: "booking",
    label: "Book Now",
    fieldLabel: "Booking URL",
    placeholder: "https://...",
  },
  {
    type: "menu",
    label: "View Menu",
    fieldLabel: "Menu URL",
    placeholder: "https://...",
  },
  {
    type: "shop",
    label: "Shop",
    fieldLabel: "Store URL",
    placeholder: "https://...",
  },
  {
    type: "portfolio",
    label: "Portfolio",
    fieldLabel: "Portfolio URL",
    placeholder: "https://...",
  },
  {
    type: "custom",
    label: "Custom Link",
    fieldLabel: "URL",
    placeholder: "https://...",
  },
];

function cleanPhoneNumber(value: string) {
  return value.replace(/[^\d+]/g, "");
}

function generateUrl(type: LinkType, value: string) {
  const trimmed = value.trim();

  switch (type) {
    case "whatsapp":
      return `https://wa.me/${cleanPhoneNumber(trimmed).replace(
        /^\+/,
        ""
      )}`;

    case "call":
      return `tel:${cleanPhoneNumber(trimmed)}`;

    case "email":
      return `mailto:${trimmed}`;

    case "instagram":
      return `https://instagram.com/${trimmed.replace(/^@/, "")}`;

    case "tiktok":
      return `https://tiktok.com/@${trimmed.replace(/^@/, "")}`;

    case "facebook":
    case "youtube":
    case "linkedin":
    case "website":
    case "location":
    case "booking":
    case "menu":
    case "shop":
    case "portfolio":
    case "custom":
      return trimmed;

    default:
      return trimmed;
  }
}

function getAction(type: string) {
  return (
    ACTIONS.find((action) => action.type === type) ??
    ACTIONS.find((action) => action.type === "custom")!
  );
}

export default function LinkManager({
  businessId,
  initialLinks,
}: Props) {
  const supabase = createClient();

  const [links, setLinks] = useState(initialLinks);

  const [type, setType] = useState<LinkType>("whatsapp");
  const [title, setTitle] = useState("WhatsApp");
  const [value, setValue] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleTypeChange(newType: LinkType) {
    setType(newType);

    const action = getAction(newType);

    setTitle(action.label);
    setValue("");
    setError("");
  }

  function startEditing(link: Link) {
    const validType = ACTIONS.some(
      (action) => action.type === link.type
    );

    const linkType: LinkType = validType
      ? (link.type as LinkType)
      : "custom";

    setEditingId(link.id);
    setType(linkType);
    setTitle(link.title);

    // New links use value.
    // Older links fall back to their existing URL.
    setValue(link.value ?? link.url);

    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEditing() {
    setEditingId(null);
    setType("whatsapp");
    setTitle("WhatsApp");
    setValue("");
    setError("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");

    if (!value.trim()) {
      setError("Please enter a value.");
      setSaving(false);
      return;
    }

    const generatedUrl = generateUrl(type, value);

    if (editingId) {
      const { data, error } = await supabase
        .from("links")
        .update({
          title,
          url: generatedUrl,
          type,
          value: value.trim(),
          icon: type,
        })
        .eq("id", editingId)
        .select()
        .single();

      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }

      setLinks(
        links.map((link) =>
          link.id === editingId ? data : link
        )
      );

      cancelEditing();
      setSaving(false);
      return;
    }

    const nextPosition =
      links.length > 0
        ? Math.max(
            ...links.map((link) => link.position)
          ) + 1
        : 1;

    const { data, error } = await supabase
      .from("links")
      .insert({
        business_id: businessId,
        title,
        url: generatedUrl,
        icon: type,
        position: nextPosition,
        active: true,
        type,
        value: value.trim(),
      })
      .select()
      .single();

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    setLinks([...links, data]);

    setType("whatsapp");
    setTitle("WhatsApp");
    setValue("");
    setSaving(false);
  }

  async function toggleLink(link: Link) {
    setError("");

    const { error } = await supabase
      .from("links")
      .update({
        active: !link.active,
      })
      .eq("id", link.id);

    if (error) {
      setError(error.message);
      return;
    }

    setLinks(
      links.map((item) =>
        item.id === link.id
          ? {
              ...item,
              active: !item.active,
            }
          : item
      )
    );
  }

  async function deleteLink(id: string) {
    setError("");

    const { error } = await supabase
      .from("links")
      .delete()
      .eq("id", id);

    if (error) {
      setError(error.message);
      return;
    }

    setLinks(
      links.filter((link) => link.id !== id)
    );
  }

  async function moveLink(
    linkId: string,
    direction: "up" | "down"
  ) {
    setError("");

    const sortedLinks = [...links].sort(
      (a, b) => a.position - b.position
    );

    const currentIndex = sortedLinks.findIndex(
      (link) => link.id === linkId
    );

    if (currentIndex === -1) {
      return;
    }

    const targetIndex =
      direction === "up"
        ? currentIndex - 1
        : currentIndex + 1;

    if (
      targetIndex < 0 ||
      targetIndex >= sortedLinks.length
    ) {
      return;
    }

    const currentLink = sortedLinks[currentIndex];
    const targetLink = sortedLinks[targetIndex];

    const currentPosition = currentLink.position;
    const targetPosition = targetLink.position;

    const { error: firstError } = await supabase
      .from("links")
      .update({
        position: targetPosition,
      })
      .eq("id", currentLink.id);

    if (firstError) {
      setError(firstError.message);
      return;
    }

    const { error: secondError } = await supabase
      .from("links")
      .update({
        position: currentPosition,
      })
      .eq("id", targetLink.id);

    if (secondError) {
      setError(secondError.message);
      return;
    }

    setLinks(
      sortedLinks.map((link) => {
        if (link.id === currentLink.id) {
          return {
            ...link,
            position: targetPosition,
          };
        }

        if (link.id === targetLink.id) {
          return {
            ...link,
            position: currentPosition,
          };
        }

        return link;
      })
    );
  }

  const sortedLinks = [...links].sort(
    (a, b) => a.position - b.position
  );

  const selectedAction = getAction(type);

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white p-6 shadow-sm"
      >
        <div>
          <h2 className="text-lg font-semibold">
            {editingId
              ? "Edit action"
              : "Add an action"}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {editingId
              ? "Update this action and how customers reach you."
              : "Give customers an easy way to interact with your business."}
          </p>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="type"
              className="mb-2 block text-sm font-medium"
            >
              Action
            </label>

            <select
              id="type"
              value={type}
              onChange={(event) =>
                handleTypeChange(
                  event.target.value as LinkType
                )
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-gray-900"
            >
              {ACTIONS.map((action) => (
                <option
                  key={action.type}
                  value={action.type}
                >
                  {action.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="value"
              className="mb-2 block text-sm font-medium"
            >
              {selectedAction.fieldLabel}
            </label>

            <input
              id="value"
              type={
                type === "email"
                  ? "email"
                  : type === "website" ||
                      type === "facebook" ||
                      type === "youtube" ||
                      type === "linkedin" ||
                      type === "location" ||
                      type === "booking" ||
                      type === "menu" ||
                      type === "shop" ||
                      type === "portfolio" ||
                      type === "custom"
                    ? "url"
                    : "text"
              }
              value={value}
              onChange={(event) =>
                setValue(event.target.value)
              }
              required
              placeholder={selectedAction.placeholder}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium"
            >
              Button title
            </label>

            <input
              id="title"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-gray-900 px-4 py-3 font-medium text-white disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Save changes"
                  : "Add action"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={cancelEditing}
                className="rounded-lg border border-gray-300 px-5 py-3 font-medium"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Your actions
          </h2>

          <span className="text-sm text-gray-500">
            {links.length}{" "}
            {links.length === 1
              ? "action"
              : "actions"}
          </span>
        </div>

        {sortedLinks.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-center text-gray-500 shadow-sm">
            No actions yet.
          </div>
        ) : (
          sortedLinks.map((link, index) => (
            <div
              key={link.id}
              className="flex items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm"
            >
              <div className="min-w-0">
                <p className="font-medium text-gray-900">
                  {link.title}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {getAction(link.type).label}
                </p>

                <p className="mt-1 truncate text-xs text-gray-400">
                  {link.value ?? link.url}
                </p>

                <p className="mt-2 text-xs text-gray-400">
                  {link.active
                    ? "Active"
                    : "Hidden"}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      moveLink(link.id, "up")
                    }
                    disabled={index === 0}
                    className="rounded border border-gray-300 px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-30"
                    title="Move up"
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      moveLink(link.id, "down")
                    }
                    disabled={
                      index ===
                      sortedLinks.length - 1
                    }
                    className="rounded border border-gray-300 px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-30"
                    title="Move down"
                  >
                    ↓
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    startEditing(link)
                  }
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    toggleLink(link)
                  }
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  {link.active
                    ? "Hide"
                    : "Show"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    deleteLink(link.id)
                  }
                  className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}