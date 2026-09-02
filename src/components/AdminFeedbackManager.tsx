"use client";

import { useState } from "react";
import {
  Check,
  Clock3,
  MessageSquare,
  Star,
  X,
} from "lucide-react";

type Feedback = {
  id: string;
  rating: number;
  message: string;
  category: string;
  display_name: string | null;
  business_name: string | null;
  is_public: boolean;
  is_approved: boolean;
  created_at: string;
};

type Props = {
  initialFeedback: Feedback[];
};

const categoryLabels: Record<string, string> = {
  general: "General feedback",
  experience: "My experience with QR",
  bug: "Bug report",
  feature_request: "Feature request",
  other: "Other",
};

export default function AdminFeedbackManager({
  initialFeedback,
}: Props) {
  const [feedback, setFeedback] = useState(initialFeedback);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function updateFeedback(
    id: string,
    action: "approve" | "reject"
  ) {
    setError("");
    setLoadingId(id);

    try {
      const response = await fetch("/api/admin/feedback", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          action,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to update feedback."
        );
      }

      setFeedback((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                is_approved:
                  data.feedback.is_approved,
              }
            : item
        )
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update feedback."
      );
    } finally {
      setLoadingId(null);
    }
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  }

  if (feedback.length === 0) {
    return (
      <section className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100">
          <MessageSquare className="h-5 w-5 text-gray-700" />
        </div>

        <h2 className="mt-5 text-lg font-semibold text-gray-950">
          No feedback yet
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
          Feedback submitted by QR users will appear here.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {feedback.map((item) => {
        const loading = loadingId === item.id;

        return (
          <article
            key={item.id}
            className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
          >
            <div className="p-5 sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= item.rating
                            ? "fill-current text-gray-950"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      {categoryLabels[item.category] ||
                        item.category}
                    </span>

                    {item.is_public ? (
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                        Public permission given
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                        Private
                      </span>
                    )}

                    {item.is_approved ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                        <Check className="h-3 w-3" />
                        Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                        <Clock3 className="h-3 w-3" />
                        Pending review
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-gray-400">
                  {formatDate(item.created_at)}
                </p>
              </div>

              <blockquote className="mt-6 text-base leading-7 text-gray-800">
                “{item.message}”
              </blockquote>

              <div className="mt-6 border-t border-gray-100 pt-5">
                <p className="text-sm font-semibold text-gray-950">
                  {item.display_name || "QR user"}
                </p>

                {item.business_name && (
                  <p className="mt-1 text-sm text-gray-500">
                    {item.business_name}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50 p-4 sm:flex-row sm:justify-end">
              {!item.is_approved && (
                <button
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    updateFeedback(item.id, "approve")
                  }
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  {loading ? "Updating..." : "Approve"}
                </button>
              )}

              {item.is_approved && (
                <button
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    updateFeedback(item.id, "reject")
                  }
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                  {loading ? "Updating..." : "Remove approval"}
                </button>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}