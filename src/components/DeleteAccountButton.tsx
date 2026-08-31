"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteAccountButton() {
  const router = useRouter();

  const [confirming, setConfirming] =
    useState(false);
  const [loading, setLoading] =
    useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/account/delete",
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to delete your account."
        );
      }

      router.replace("/");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete your account."
      );

      setLoading(false);
    }
  }

  if (confirming) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <p className="text-sm font-medium text-red-900">
          Are you sure you want to permanently
          delete your account?
        </p>

        <p className="mt-1 text-sm leading-6 text-red-700">
          This action cannot be undone. All of
          your businesses and their links will
          also be permanently deleted.
        </p>

        {error && (
          <p className="mt-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Deleting Account..."
              : "Yes, Delete My Account"}
          </button>

          <button
            type="button"
            onClick={() => {
              setConfirming(false);
              setError("");
            }}
            disabled={loading}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
    >
      Delete Account
    </button>
  );
}