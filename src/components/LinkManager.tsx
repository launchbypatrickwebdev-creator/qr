"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  GripVertical,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import ActionIcon from "@/components/ActionIcon";
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
  business_id?: string;
  title: string;
  url: string;
  icon?: string | null;
  position: number;
  active: boolean;
  type: string;
  value?: string | null;
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

function generateUrl(
  type: LinkType,
  value: string
) {
  const trimmed = value.trim();

  switch (type) {
    case "whatsapp":
      return `https://wa.me/${cleanPhoneNumber(
        trimmed
      ).replace(/^\+/, "")}`;

    case "call":
      return `tel:${cleanPhoneNumber(trimmed)}`;

    case "email":
      return `mailto:${trimmed}`;

    case "instagram":
      return `https://instagram.com/${trimmed.replace(
        /^@/,
        ""
      )}`;

    case "tiktok":
      return `https://tiktok.com/@${trimmed.replace(
        /^@/,
        ""
      )}`;

    default:
      return trimmed;
  }
}

function getAction(type: string) {
  return (
    ACTIONS.find(
      (action) => action.type === type
    ) ??
    ACTIONS.find(
      (action) => action.type === "custom"
    )!
  );
}

function getDisplayValue(link: Link) {
  if (link.value) {
    return link.value;
  }

  return link.url
    .replace(/^https?:\/\//, "")
    .replace(/^mailto:/, "")
    .replace(/^tel:/, "");
}

export default function LinkManager({
  businessId,
  initialLinks,
}: Props) {
  const supabase = createClient();

  const [links, setLinks] =
    useState<Link[]>(initialLinks);

  const [type, setType] =
    useState<LinkType>("whatsapp");

  const [title, setTitle] =
    useState("WhatsApp");

  const [value, setValue] =
    useState("");

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [isEditorOpen, setIsEditorOpen] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [openMenuId, setOpenMenuId] =
    useState<string | null>(null);

  const editorRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent
    ) {
      const target = event.target as HTMLElement;

      if (
        !target.closest(
          "[data-action-menu]"
        )
      ) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener(
      "click",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "click",
        handleClickOutside
      );
    };
  }, []);

  function resetForm() {
    setEditingId(null);
    setType("whatsapp");
    setTitle("WhatsApp");
    setValue("");
    setError("");
  }

  function openNewAction() {
    resetForm();
    setIsEditorOpen(true);

    window.setTimeout(() => {
      editorRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  }

  function handleTypeChange(
    newType: LinkType
  ) {
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
    setValue(
      link.value ?? getDisplayValue(link)
    );

    setError("");
    setOpenMenuId(null);
    setIsEditorOpen(true);

    window.setTimeout(() => {
      editorRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  }

  function cancelEditing() {
    resetForm();
    setIsEditorOpen(false);
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

    const generatedUrl =
      generateUrl(type, value);

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

      setLinks((currentLinks) =>
        currentLinks.map((link) =>
          link.id === editingId
            ? data
            : link
        )
      );

      cancelEditing();
      setSaving(false);
      return;
    }

    const nextPosition =
      links.length > 0
        ? Math.max(
            ...links.map(
              (link) => link.position
            )
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

    setLinks((currentLinks) => [
      ...currentLinks,
      data,
    ]);

    cancelEditing();
    setSaving(false);
  }

  async function toggleLink(link: Link) {
    setError("");
    setOpenMenuId(null);

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

    setLinks((currentLinks) =>
      currentLinks.map((item) =>
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
    setOpenMenuId(null);

    const { error } = await supabase
      .from("links")
      .delete()
      .eq("id", id);

    if (error) {
      setError(error.message);
      return;
    }

    setLinks((currentLinks) =>
      currentLinks.filter(
        (link) => link.id !== id
      )
    );

    if (editingId === id) {
      cancelEditing();
    }
  }

  async function moveLink(
    linkId: string,
    direction: "up" | "down"
  ) {
    setError("");
    setOpenMenuId(null);

    const sortedLinks = [...links].sort(
      (a, b) =>
        a.position - b.position
    );

    const currentIndex =
      sortedLinks.findIndex(
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

    const currentLink =
      sortedLinks[currentIndex];

    const targetLink =
      sortedLinks[targetIndex];

    const { error } = await supabase.rpc(
      "swap_link_positions",
      {
        p_link_id: currentLink.id,
        p_target_link_id: targetLink.id,
      }
    );

    if (error) {
      setError(error.message);
      return;
    }

    setLinks((currentLinks) =>
      currentLinks.map((link) => {
        if (link.id === currentLink.id) {
          return {
            ...link,
            position: targetLink.position,
          };
        }

        if (link.id === targetLink.id) {
          return {
            ...link,
            position: currentLink.position,
          };
        }

        return link;
      })
    );
  }

  const sortedLinks = [...links].sort(
    (a, b) =>
      a.position - b.position
  );

  const selectedAction =
    getAction(type);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gray-950">
            Actions
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Help customers connect with your
            business.
          </p>
        </div>

        {!isEditorOpen && (
          <button
            type="button"
            onClick={openNewAction}
            className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            <Plus className="h-4 w-4" />
            Add Action
          </button>
        )}
      </div>

      {isEditorOpen && (
        <div
          ref={editorRef}
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-950">
                {editingId
                  ? "Edit action"
                  : "Add an action"}
              </h3>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                {editingId
                  ? "Update how customers interact with your business."
                  : "Choose how customers can connect with your business."}
              </p>
            </div>

            <button
              type="button"
              onClick={cancelEditing}
              className="text-sm font-medium text-gray-500 transition hover:text-gray-950"
            >
              Cancel
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5"
          >
            <div>
              <label
                htmlFor="type"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Action type
              </label>

              <select
                id="type"
                value={type}
                onChange={(event) =>
                  handleTypeChange(
                    event.target
                      .value as LinkType
                  )
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-950"
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
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                {selectedAction.fieldLabel}
              </label>

              <input
                id="value"
                type={
                  type === "email"
                    ? "email"
                    : [
                        "website",
                        "facebook",
                        "youtube",
                        "linkedin",
                        "location",
                        "booking",
                        "menu",
                        "shop",
                        "portfolio",
                        "custom",
                      ].includes(type)
                      ? "url"
                      : "text"
                }
                value={value}
                onChange={(event) =>
                  setValue(
                    event.target.value
                  )
                }
                required
                placeholder={
                  selectedAction.placeholder
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-950"
              />
            </div>

            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Button title
              </label>

              <input
                id="title"
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-950"
              />
            </div>

            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={cancelEditing}
                className="min-h-11 rounded-xl border border-gray-300 px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="min-h-11 rounded-xl bg-gray-950 px-5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save changes"
                    : "Add action"}
              </button>
            </div>
          </form>
        </div>
      )}

      {error && !isEditorOpen && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {sortedLinks.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center sm:p-10">
          <h3 className="font-semibold text-gray-950">
            No actions yet
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            Add a way for customers to call,
            message, visit, book, shop, or connect
            with your business.
          </p>

          {!isEditorOpen && (
            <button
              type="button"
              onClick={openNewAction}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gray-950"
            >
              <Plus className="h-4 w-4" />
              Add your first action
            </button>
          )}
        </section>
      ) : (
        <section className="overflow-visible rounded-2xl border border-gray-200 bg-white shadow-sm">
          {sortedLinks.map(
            (link, index) => (
              <div
                key={link.id}
                className={`flex items-center gap-3 p-4 sm:gap-4 sm:p-5 ${
                  index > 0
                    ? "border-t border-gray-100"
                    : ""
                }`}
              >
                <div className="hidden text-gray-300 sm:block">
                  <GripVertical className="h-5 w-5" />
                </div>

                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700"
                  aria-hidden="true"
                >
                  <ActionIcon
                    type={link.type}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-gray-950">
                      {link.title}
                    </p>

                    <span
                      className={`hidden rounded-full px-2 py-0.5 text-[11px] font-semibold sm:inline-flex ${
                        link.active
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {link.active
                        ? "Visible"
                        : "Hidden"}
                    </span>
                  </div>

                  <p className="mt-1 truncate text-sm text-gray-500">
                    {getDisplayValue(link)}
                  </p>
                </div>

                <div className="relative">
                  <button
                    type="button"
                    data-action-menu
                    onClick={(event) => {
                      event.stopPropagation();

                      setOpenMenuId(
                        openMenuId === link.id
                          ? null
                          : link.id
                      );
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-950"
                    aria-label={`Actions for ${link.title}`}
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </button>

                  {openMenuId ===
                    link.id && (
                    <div
                      data-action-menu
                      className="absolute right-0 top-12 z-20 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          startEditing(link)
                        }
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          toggleLink(link)
                        }
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                      >
                        {link.active ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}

                        {link.active
                          ? "Hide"
                          : "Show"}
                      </button>

                      <div className="my-1 border-t border-gray-100" />

                      <button
                        type="button"
                        disabled={
                          index === 0
                        }
                        onClick={() =>
                          moveLink(
                            link.id,
                            "up"
                          )
                        }
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronUp className="h-4 w-4" />
                        Move up
                      </button>

                      <button
                        type="button"
                        disabled={
                          index ===
                          sortedLinks.length -
                            1
                        }
                        onClick={() =>
                          moveLink(
                            link.id,
                            "down"
                          )
                        }
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronDown className="h-4 w-4" />
                        Move down
                      </button>

                      <div className="my-1 border-t border-gray-100" />

                      <button
                        type="button"
                        onClick={() =>
                          deleteLink(link.id)
                        }
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          )}
        </section>
      )}

      {sortedLinks.length > 1 && (
        <p className="text-xs text-gray-400">
          Use the action menu to change the order
          of your actions.
        </p>
      )}
    </div>
  );
}