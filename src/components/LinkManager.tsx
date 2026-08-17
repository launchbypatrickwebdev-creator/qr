"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Link = {
  id: string;
  business_id: string;
  title: string;
  url: string;
  position: number;
  active: boolean;
};

type Props = {
  businessId: string;
  initialLinks: Link[];
};

export default function LinkManager({
  businessId,
  initialLinks,
}: Props) {
  const supabase = createClient();

  const [links, setLinks] = useState(initialLinks);

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function startEditing(link: Link) {
    setEditingId(link.id);
    setTitle(link.title);
    setUrl(link.url);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEditing() {
    setEditingId(null);
    setTitle("");
    setUrl("");
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");

    if (editingId) {
      const { data, error } = await supabase
        .from("links")
        .update({
          title,
          url,
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
        ? Math.max(...links.map((link) => link.position)) + 1
        : 1;

    const { data, error } = await supabase
      .from("links")
      .insert({
        business_id: businessId,
        title,
        url,
        position: nextPosition,
        active: true,
      })
      .select()
      .single();

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    setLinks([...links, data]);

    setTitle("");
    setUrl("");
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
          ? { ...item, active: !item.active }
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

    setLinks(links.filter((link) => link.id !== id));
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

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white p-6 shadow-sm"
      >
        <div>
          <h2 className="text-lg font-semibold">
            {editingId ? "Edit link" : "Add a link"}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {editingId
              ? "Update the title or destination."
              : "Add a website, social profile, contact link, or any other URL."}
          </p>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium"
            >
              Title
            </label>

            <input
              id="title"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              required
              placeholder="Instagram"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="url"
              className="mb-2 block text-sm font-medium"
            >
              URL
            </label>

            <input
              id="url"
              type="url"
              value={url}
              onChange={(event) =>
                setUrl(event.target.value)
              }
              required
              placeholder="https://instagram.com/..."
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
                  : "Add link"}
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
            Your links
          </h2>

          <span className="text-sm text-gray-500">
            {links.length}{" "}
            {links.length === 1 ? "link" : "links"}
          </span>
        </div>

        {sortedLinks.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-center text-gray-500 shadow-sm">
            No links yet.
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

                <p className="mt-1 truncate text-sm text-gray-500">
                  {link.url}
                </p>

                <p className="mt-2 text-xs text-gray-400">
                  {link.active ? "Active" : "Hidden"}
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
                      index === sortedLinks.length - 1
                    }
                    className="rounded border border-gray-300 px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-30"
                    title="Move down"
                  >
                    ↓
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => startEditing(link)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => toggleLink(link)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  {link.active ? "Hide" : "Show"}
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