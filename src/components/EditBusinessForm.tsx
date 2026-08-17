"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Business = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  location: string | null;
  logo_url: string | null;
};

type Props = {
  business: Business;
};

export default function EditBusinessForm({ business }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState(business.name);
  const [description, setDescription] = useState(
    business.description ?? ""
  );
  const [phone, setPhone] = useState(business.phone ?? "");
  const [whatsapp, setWhatsapp] = useState(
    business.whatsapp ?? ""
  );
  const [email, setEmail] = useState(business.email ?? "");
  const [location, setLocation] = useState(
    business.location ?? ""
  );

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    const { error } = await supabase
      .from("businesses")
      .update({
        name,
        description: description || null,
        phone: phone || null,
        whatsapp: whatsapp || null,
        email: email || null,
        location: location || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", business.id);

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    setMessage("Business profile updated.");
    setSaving(false);

    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl bg-white p-6 shadow-sm"
    >
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium"
        >
          Business name
        </label>

        <input
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-medium"
        >
          Description
        </label>

        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="mb-2 block text-sm font-medium"
        >
          Phone
        </label>

        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
        />
      </div>

      <div>
        <label
          htmlFor="whatsapp"
          className="mb-2 block text-sm font-medium"
        >
          WhatsApp
        </label>

        <input
          id="whatsapp"
          type="tel"
          value={whatsapp}
          onChange={(event) => setWhatsapp(event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
          placeholder="2348012345678"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium"
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
        />
      </div>

      <div>
        <label
          htmlFor="location"
          className="mb-2 block text-sm font-medium"
        >
          Location
        </label>

        <input
          id="location"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {message && (
        <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-lg bg-gray-900 px-4 py-3 font-medium text-white disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}