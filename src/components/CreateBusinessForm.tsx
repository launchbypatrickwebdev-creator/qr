"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Building2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

function createSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function CreateBusinessForm() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");

  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setCreating(true);
    setError("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError(
        "You must be signed in to create a business."
      );
      setCreating(false);
      return;
    }

    const baseSlug = createSlug(name);

    if (!baseSlug) {
      setError(
        "Please enter a valid business name."
      );
      setCreating(false);
      return;
    }

    let slug = baseSlug;

    const {
      data: existingBusinesses,
      error: slugError,
    } = await supabase
      .from("businesses")
      .select("slug")
      .like("slug", `${baseSlug}%`);

    if (slugError) {
      setError(slugError.message);
      setCreating(false);
      return;
    }

    const existingSlugs =
      existingBusinesses?.map(
        (business) => business.slug
      ) ?? [];

    if (existingSlugs.includes(slug)) {
      let number = 2;

      while (
        existingSlugs.includes(
          `${baseSlug}-${number}`
        )
      ) {
        number++;
      }

      slug = `${baseSlug}-${number}`;
    }

    const { error: insertError } = await supabase
      .from("businesses")
      .insert({
        owner_id: user.id,
        name,
        slug,
        description: description || null,
        phone: phone || null,
        whatsapp: whatsapp || null,
        email: email || null,
        location: location || null,
        theme_color: "#111827",
        background_color: "#F9FAFB",
        button_style: "rounded",
      });

    if (insertError) {
      setError(insertError.message);
      setCreating(false);
      return;
    }

    router.push(
      `/dashboard/business/${slug}`
    );

    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      <section className="rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
              <Building2 className="h-5 w-5 text-gray-700" />
            </div>

            <div>
              <h2 className="font-semibold text-gray-950">
                Create your business profile
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Start with the essentials. You can customize
                the profile later.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              Business name
            </label>

            <input
              id="name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              required
              autoFocus
              placeholder="Your business name"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
            />

            {name && createSlug(name) && (
              <div className="mt-3 rounded-xl bg-gray-50 px-4 py-3">
                <p className="text-xs font-medium text-gray-500">
                  Your public profile
                </p>

                <p className="mt-1 font-mono text-sm text-gray-900">
                  /q/{createSlug(name)}
                </p>
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              Description
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              rows={4}
              placeholder="Tell customers what your business does"
              className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
          <h2 className="font-semibold text-gray-950">
            Contact details
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Add any details customers should be able to use.
          </p>
        </div>

        <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
          <div>
            <label
              htmlFor="phone"
              className="mb-2 flex items-center gap-2 text-sm font-medium"
            >
              <Phone className="h-4 w-4" />
              Phone
            </label>

            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(event) =>
                setPhone(event.target.value)
              }
              placeholder="08012345678"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
            />
          </div>

          <div>
            <label
              htmlFor="whatsapp"
              className="mb-2 flex items-center gap-2 text-sm font-medium"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </label>

            <input
              id="whatsapp"
              type="tel"
              value={whatsapp}
              onChange={(event) =>
                setWhatsapp(event.target.value)
              }
              placeholder="2348012345678"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 flex items-center gap-2 text-sm font-medium"
            >
              <Mail className="h-4 w-4" />
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="business@example.com"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="mb-2 flex items-center gap-2 text-sm font-medium"
            >
              <MapPin className="h-4 w-4" />
              Location
            </label>

            <input
              id="location"
              value={location}
              onChange={(event) =>
                setLocation(event.target.value)
              }
              placeholder="Lagos, Nigeria"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
            />
          </div>
        </div>
      </section>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={creating}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-950 px-5 py-4 font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
      >
        {creating
          ? "Creating business..."
          : "Create business"}

        {!creating && (
          <ArrowRight className="h-4 w-4" />
        )}
      </button>
    </form>
  );
}