"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  businessId: string;
  businessName: string;
};

export default function DeleteBusinessButton({
  businessId,
  businessName,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] =
    useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/business/delete",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            businessId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to delete this business."
        );
      }

      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete this business."
      );

      setLoading(false);
    }
  }

  if (confirming) {
    return (
      <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
        <p className="text-sm font-medium text-red-900">
          Delete {businessName} permanently?
        </p>

        <p className="mt-1 text-sm leading-6 text-red-700">
          This will permanently delete this
          business and all of its actions and
          links.
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
              ? "Deleting..."
              : "Yes, Delete Business"}
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
      Delete Business
    </button>
  );
}