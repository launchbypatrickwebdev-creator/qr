"use client";

import {
  ChangeEvent,
  FormEvent,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  ImageIcon,
  MapPin,
  Palette,
  Phone,
  Save,
  Mail,
  MessageCircle,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import ActionIcon from "@/components/ActionIcon";

import {
  getBusinessInitials,
  getContrastTextColor,
  getMutedTextColor,
} from "@/lib/color";

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
  theme_color: string;
  background_color: string;
  button_style: string;
};

type Link = {
  id: string;
  title: string;
  type: string;
  position: number;
  active: boolean;
};

type Props = {
  business: Business;
  links: Link[];
};

const THEME_COLORS = [
  "#111827",
  "#2563EB",
  "#16A34A",
  "#9333EA",
  "#DC2626",
  "#EA580C",
  "#0891B2",
  "#CA8A04",
];

const BACKGROUND_COLORS = [
  "#F9FAFB",
  "#FFFFFF",
  "#EFF6FF",
  "#F0FDF4",
  "#FAF5FF",
  "#FFF7ED",
  "#FEF2F2",
  "#111827",
];

function getStoragePathFromUrl(url: string) {
  const marker =
    "/storage/v1/object/public/business-logos/";

  const index = url.indexOf(marker);

  if (index === -1) {
    return null;
  }

  return decodeURIComponent(
    url.slice(index + marker.length)
  );
}

export default function EditBusinessForm({
  business,
  links,
}: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState(business.name);

  const [description, setDescription] = useState(
    business.description ?? ""
  );

  const [phone, setPhone] = useState(
    business.phone ?? ""
  );

  const [whatsapp, setWhatsapp] = useState(
    business.whatsapp ?? ""
  );

  const [email, setEmail] = useState(
    business.email ?? ""
  );

  const [location, setLocation] = useState(
    business.location ?? ""
  );

  const [logoUrl, setLogoUrl] = useState(
    business.logo_url ?? ""
  );

  const [themeColor, setThemeColor] = useState(
    business.theme_color ?? "#111827"
  );

  const [backgroundColor, setBackgroundColor] =
    useState(
      business.background_color ?? "#F9FAFB"
    );

  const [buttonStyle, setButtonStyle] = useState(
    business.button_style ?? "rounded"
  );

  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] =
    useState(false);
  const [removingLogo, setRemovingLogo] =
    useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const buttonRadius = {
    rounded: "16px",
    square: "4px",
    pill: "9999px",
  }[buttonStyle] || "16px";

  const previewTextColor =
    getContrastTextColor(backgroundColor);

  const previewMutedTextColor =
    getMutedTextColor(backgroundColor);

  async function handleLogoUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    setError("");
    setMessage("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Please upload a JPG, PNG, or WebP image."
      );
      return;
    }

    if (file.size > maxSize) {
      setError(
        "Your image must be 5 MB or smaller."
      );
      return;
    }

    setUploadingLogo(true);

    try {
      const extensionMap: Record<string, string> = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
      };

      const extension = extensionMap[file.type];

      if (!extension) {
        setError("Unsupported image type.");
        return;
      }

      const filePath = `${business.id}/${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } =
        await supabase.storage
          .from("business-logos")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          });

      if (uploadError) {
        setError(uploadError.message);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("business-logos")
        .getPublicUrl(filePath);

      const oldLogoUrl = logoUrl;

      const { error: databaseError } =
        await supabase
          .from("businesses")
          .update({
            logo_url: publicUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("id", business.id);

      if (databaseError) {
        await supabase.storage
          .from("business-logos")
          .remove([filePath]);

        setError(databaseError.message);
        return;
      }

      setLogoUrl(publicUrl);
      setMessage("Profile image updated.");

      if (oldLogoUrl) {
        const oldPath =
          getStoragePathFromUrl(oldLogoUrl);

        if (oldPath) {
          await supabase.storage
            .from("business-logos")
            .remove([oldPath]);
        }
      }

      router.refresh();
    } catch {
      setError(
        "Something went wrong while uploading the image."
      );
    } finally {
      setUploadingLogo(false);
    }
  }

  async function handleRemoveLogo() {
    if (!logoUrl) {
      return;
    }

    setRemovingLogo(true);
    setError("");
    setMessage("");

    try {
      const storagePath =
        getStoragePathFromUrl(logoUrl);

      const { error: databaseError } =
        await supabase
          .from("businesses")
          .update({
            logo_url: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", business.id);

      if (databaseError) {
        setError(databaseError.message);
        return;
      }

      if (storagePath) {
        await supabase.storage
          .from("business-logos")
          .remove([storagePath]);
      }

      setLogoUrl("");
      setMessage("Profile image removed.");

      router.refresh();
    } catch {
      setError(
        "Something went wrong while removing the image."
      );
    } finally {
      setRemovingLogo(false);
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
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
        theme_color: themeColor,
        background_color: backgroundColor,
        button_style: buttonStyle,
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
      className="space-y-8"
    >
      <section className="rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
              <Building2 className="h-5 w-5 text-gray-700" />
            </div>

            <div>
              <h2 className="font-semibold text-gray-950">
                Business information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                The core information displayed on your
                public profile.
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
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-950 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
            />
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
              className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-950 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
              placeholder="Tell customers what your business does"
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
              <Phone className="h-5 w-5 text-gray-700" />
            </div>

            <div>
              <h2 className="font-semibold text-gray-950">
                Contact details
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                These automatically become customer actions
                on your public profile.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
          <div>
            <label
              htmlFor="phone"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-900"
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
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
              placeholder="08012345678"
            />
          </div>

          <div>
            <label
              htmlFor="whatsapp"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-900"
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
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
              placeholder="2348012345678"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-900"
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
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
              placeholder="business@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-900"
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
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
              placeholder="Lagos, Nigeria"
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
              <ImageIcon className="h-5 w-5 text-gray-700" />
            </div>

            <div>
              <h2 className="font-semibold text-gray-950">
                Profile image
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Add your business logo or another image
                customers will recognize.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="shrink-0">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={`${name || "Business"} logo`}
                  className="h-28 w-28 rounded-3xl border border-gray-200 bg-white object-cover shadow-sm"
                />
              ) : (
                <div
                  className="flex h-28 w-28 items-center justify-center rounded-3xl border border-gray-200 bg-gray-50 text-2xl font-bold"
                  style={{
                    color: themeColor,
                  }}
                >
                  {getBusinessInitials(name)}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap gap-3">
                <label
                  htmlFor="business-logo"
                  className={`inline-flex cursor-pointer items-center justify-center rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 ${
                    uploadingLogo
                      ? "pointer-events-none opacity-50"
                      : ""
                  }`}
                >
                  {uploadingLogo
                    ? "Uploading..."
                    : logoUrl
                      ? "Change image"
                      : "Upload image"}
                </label>

                <input
                  id="business-logo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleLogoUpload}
                  disabled={uploadingLogo}
                  className="sr-only"
                />

                {logoUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    disabled={
                      removingLogo || uploadingLogo
                    }
                    className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {removingLogo
                      ? "Removing..."
                      : "Remove"}
                  </button>
                )}
              </div>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                JPG, PNG or WebP. Maximum 5 MB.
                A square image works best.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
              <Palette className="h-5 w-5 text-gray-700" />
            </div>

            <div>
              <h2 className="font-semibold text-gray-950">
                Visual identity
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Control the appearance of your public
                business profile.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8 p-5 sm:p-6">
          <div>
            <label
              htmlFor="themeColor"
              className="mb-3 block text-sm font-medium text-gray-900"
            >
              Theme color
            </label>

            <div className="flex gap-3">
              <input
                id="themeColor"
                type="color"
                value={themeColor}
                onChange={(event) =>
                  setThemeColor(event.target.value)
                }
                className="h-12 w-16 cursor-pointer rounded-xl border border-gray-300 bg-white p-1"
              />

              <input
                type="text"
                value={themeColor}
                onChange={(event) =>
                  setThemeColor(event.target.value)
                }
                className="flex-1 rounded-xl border border-gray-300 px-4 py-3 uppercase outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {THEME_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() =>
                    setThemeColor(color)
                  }
                  className={`h-10 w-10 rounded-full border-2 transition ${
                    themeColor.toLowerCase() ===
                    color.toLowerCase()
                      ? "scale-110 border-gray-950"
                      : "border-transparent"
                  }`}
                  style={{
                    backgroundColor: color,
                  }}
                  aria-label={`Use ${color}`}
                />
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="backgroundColor"
              className="mb-3 block text-sm font-medium text-gray-900"
            >
              Background color
            </label>

            <div className="flex gap-3">
              <input
                id="backgroundColor"
                type="color"
                value={backgroundColor}
                onChange={(event) =>
                  setBackgroundColor(event.target.value)
                }
                className="h-12 w-16 cursor-pointer rounded-xl border border-gray-300 bg-white p-1"
              />

              <input
                type="text"
                value={backgroundColor}
                onChange={(event) =>
                  setBackgroundColor(event.target.value)
                }
                className="flex-1 rounded-xl border border-gray-300 px-4 py-3 uppercase outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {BACKGROUND_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() =>
                    setBackgroundColor(color)
                  }
                  className={`h-10 w-10 rounded-full border-2 transition ${
                    backgroundColor.toLowerCase() ===
                    color.toLowerCase()
                      ? "scale-110 border-gray-950"
                      : "border-gray-200"
                  }`}
                  style={{
                    backgroundColor: color,
                  }}
                  aria-label={`Use ${color}`}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-gray-900">
              Button style
            </p>

            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  value: "rounded",
                  label: "Rounded",
                  radius: "16px",
                },
                {
                  value: "square",
                  label: "Square",
                  radius: "4px",
                },
                {
                  value: "pill",
                  label: "Pill",
                  radius: "9999px",
                },
              ].map((style) => (
                <button
                  key={style.value}
                  type="button"
                  onClick={() =>
                    setButtonStyle(style.value)
                  }
                  className={`border p-3 text-center text-sm font-medium transition ${
                    buttonStyle === style.value
                      ? "border-gray-950 bg-gray-950 text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                  style={{
                    borderRadius: style.radius,
                  }}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-950">
            Live preview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            A preview of how customers will see your
            profile.
          </p>
        </div>

        <div
          className="overflow-hidden rounded-3xl border border-gray-200 p-6 shadow-sm"
          style={{
            backgroundColor,
            color: previewTextColor,
          }}
        >
          <div className="text-center">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${name || "Business"} logo`}
                className="mx-auto h-20 w-20 rounded-full border border-gray-200 bg-white object-cover shadow-sm"
              />
            ) : (
              <div
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-lg font-bold shadow-sm"
                style={{
                  color: themeColor,
                }}
              >
                {getBusinessInitials(name)}
              </div>
            )}

            <h3 className="mt-4 text-lg font-bold">
              {name || "Business Name"}
            </h3>

            <p
              className="mx-auto mt-2 max-w-sm text-sm leading-6"
              style={{
                color: previewMutedTextColor,
              }}
            >
              {description ||
                "Your business description"}
            </p>
          </div>

          <div className="mt-6 space-y-3">
            {links.length > 0 ? (
              links
                .filter((link) => link.active)
                .slice(0, 4)
                .map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center gap-3 bg-white px-4 py-3.5 text-sm font-medium text-gray-900 shadow-sm"
                    style={{
                      borderRadius: buttonRadius,
                    }}
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center text-white"
                      style={{
                        backgroundColor: themeColor,
                        borderRadius: buttonRadius,
                      }}
                    >
                      <ActionIcon type={link.type} />
                    </span>

                    <span className="truncate">
                      {link.title}
                    </span>
                  </div>
                ))
            ) : (
              <div
                className="bg-white px-4 py-5 text-center text-sm text-gray-500 shadow-sm"
                style={{
                  borderRadius: buttonRadius,
                }}
              >
                Your actions will appear here.
              </div>
            )}
          </div>
        </div>
      </section>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}

      {message && (
        <p className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {message}
        </p>
      )}

      <div className="sticky bottom-4 z-10">
        <button
          type="submit"
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-950 px-5 py-4 font-medium text-white shadow-lg transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-4 w-4" />

          {saving
            ? "Saving changes..."
            : "Save changes"}
        </button>
      </div>
    </form>
  );
}