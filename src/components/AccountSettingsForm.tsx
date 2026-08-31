"use client";

import { FormEvent, useState } from "react";
import { Check, LockKeyhole, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  userId: string;
  email: string;
  initialName: string;
  initialLanguage: string;
};

export default function AccountSettingsForm({
  userId,
  email,
  initialName,
  initialLanguage,
}: Props) {
  const supabase = createClient();

  const [name, setName] = useState(initialName);
  const [language, setLanguage] = useState(
    initialLanguage || "en"
  );

  const [currentPassword, setCurrentPassword] =
    useState("");
  const [newPassword, setNewPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [profileMessage, setProfileMessage] =
    useState("");
  const [profileError, setProfileError] =
    useState("");

  const [passwordMessage, setPasswordMessage] =
    useState("");
  const [passwordError, setPasswordError] =
    useState("");

  const [savingProfile, setSavingProfile] =
    useState(false);
  const [changingPassword, setChangingPassword] =
    useState(false);

  async function handleProfileSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSavingProfile(true);
    setProfileError("");
    setProfileMessage("");

    const cleanName = name.trim();

    if (cleanName.length > 100) {
      setProfileError(
        "Name must be 100 characters or less."
      );
      setSavingProfile(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: userId,
          name: cleanName || null,
          language,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "id",
        }
      );

    if (error) {
      setProfileError(error.message);
      setSavingProfile(false);
      return;
    }

    setProfileMessage("Your preferences have been saved.");
    setSavingProfile(false);
  }

  async function handlePasswordSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setChangingPassword(true);
    setPasswordError("");
    setPasswordMessage("");

    if (newPassword.length < 6) {
      setPasswordError(
        "New password must be at least 6 characters."
      );
      setChangingPassword(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        "New passwords do not match."
      );
      setChangingPassword(false);
      return;
    }

    if (!currentPassword) {
      setPasswordError(
        "Enter your current password."
      );
      setChangingPassword(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      setPasswordError(
        "Unable to verify your account."
      );
      setChangingPassword(false);
      return;
    }

    const { error: signInError } =
      await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

    if (signInError) {
      setPasswordError(
        "Your current password is incorrect."
      );
      setChangingPassword(false);
      return;
    }

    const { error: updateError } =
      await supabase.auth.updateUser({
        password: newPassword,
      });

    if (updateError) {
      setPasswordError(updateError.message);
      setChangingPassword(false);
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setPasswordMessage(
      "Your password has been updated."
    );

    setChangingPassword(false);
  }

  return (
    <div className="space-y-6">
      {/* Personal information + preferences */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
              <UserRound className="h-5 w-5 text-gray-700" />
            </div>

            <div>
              <h2 className="font-semibold text-gray-950">
                Personal information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage the information associated with your account.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleProfileSubmit}
          className="space-y-5 p-5 sm:p-6"
        >
          <div>
            <label
              htmlFor="account-name"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              Name
            </label>

            <input
              id="account-name"
              type="text"
              maxLength={100}
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Your name"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-950 outline-none transition focus:border-gray-950"
            />
          </div>

          <div>
            <label
              htmlFor="account-email"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              Email
            </label>

            <input
              id="account-email"
              type="email"
              value={email}
              readOnly
              className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500 outline-none"
            />

            <p className="mt-2 text-xs text-gray-500">
              Email changes are not available yet.
            </p>
          </div>

          <div>
            <label
              htmlFor="account-language"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              Language
            </label>

            <select
              id="account-language"
              value={language}
              onChange={(event) =>
                setLanguage(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-950 outline-none focus:border-gray-950"
            >
              <option value="en">English</option>
            </select>

            <p className="mt-2 text-xs text-gray-500">
              More languages can be added later.
            </p>
          </div>

          {profileError && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {profileError}
            </p>
          )}

          {profileMessage && (
            <p
              role="status"
              className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700"
            >
              <Check className="h-4 w-4" />
              {profileMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={savingProfile}
            className="rounded-lg bg-gray-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {savingProfile
              ? "Saving..."
              : "Save changes"}
          </button>
        </form>
      </section>

      {/* Security */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
              <LockKeyhole className="h-5 w-5 text-gray-700" />
            </div>

            <div>
              <h2 className="font-semibold text-gray-950">
                Security
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Change your account password.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handlePasswordSubmit}
          className="space-y-5 p-5 sm:p-6"
        >
          <div>
            <label
              htmlFor="current-password"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              Current password
            </label>

            <input
              id="current-password"
              type="password"
              required
              autoComplete="current-password"
              value={currentPassword}
              onChange={(event) =>
                setCurrentPassword(
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-950"
            />
          </div>

          <div>
            <label
              htmlFor="new-password"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              New password
            </label>

            <input
              id="new-password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={newPassword}
              onChange={(event) =>
                setNewPassword(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-950"
            />
          </div>

          <div>
            <label
              htmlFor="confirm-new-password"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              Confirm new password
            </label>

            <input
              id="confirm-new-password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-950"
            />
          </div>

          {passwordError && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {passwordError}
            </p>
          )}

          {passwordMessage && (
            <p
              role="status"
              className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700"
            >
              <Check className="h-4 w-4" />
              {passwordMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={changingPassword}
            className="rounded-lg bg-gray-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {changingPassword
              ? "Updating..."
              : "Update password"}
          </button>
        </form>
      </section>
    </div>
  );
}