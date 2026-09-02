"use client";

import { FormEvent, useState } from "react";
import { Check, Send, Star } from "lucide-react";

type Props = {
  initialName?: string;
  initialBusinessName?: string;
};

const categories = [
  {
    value: "general",
    label: "General feedback",
  },
  {
    value: "experience",
    label: "My experience with QR",
  },
  {
    value: "bug",
    label: "Report a bug",
  },
  {
    value: "feature_request",
    label: "Feature request",
  },
  {
    value: "other",
    label: "Other",
  },
];

export default function FeedbackForm({
  initialName = "",
  initialBusinessName = "",
}: Props) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("general");

  const [isPublic, setIsPublic] = useState(false);
  const [displayName, setDisplayName] = useState(initialName);
  const [businessName, setBusinessName] =
    useState(initialBusinessName);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess(false);

    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    if (!message.trim()) {
      setError("Please enter your feedback.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          message,
          category,
          display_name: displayName,
          business_name: businessName,
          is_public: isPublic,
          website: "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to submit your feedback."
        );
      }

      setRating(0);
      setHoverRating(0);
      setMessage("");
      setCategory("general");
      setIsPublic(false);
      setSuccess(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to submit your feedback."
      );
    } finally {
      setLoading(false);
    }
  }

  const visibleRating = hoverRating || rating;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="feedback-website">
          Website
        </label>
        <input
          id="feedback-website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Rating */}
      <div>
        <label className="mb-3 block text-sm font-medium text-gray-900">
          How would you rate your experience?
        </label>

        <div
          className="flex items-center gap-1"
          onMouseLeave={() => setHoverRating(0)}
          role="radiogroup"
          aria-label="Rating"
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={`${value} ${
                value === 1 ? "star" : "stars"
              }`}
              onMouseEnter={() => setHoverRating(value)}
              onFocus={() => setHoverRating(value)}
              onBlur={() => setHoverRating(0)}
              onClick={() => setRating(value)}
              className="rounded-md p-1 outline-none transition hover:scale-105 focus:ring-2 focus:ring-gray-300"
            >
              <Star
                className={`h-8 w-8 ${
                  value <= visibleRating
                    ? "fill-current text-gray-950"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>

        {rating > 0 && (
          <p className="mt-2 text-xs text-gray-500">
            {rating === 1 && "Very poor"}
            {rating === 2 && "Needs improvement"}
            {rating === 3 && "It was okay"}
            {rating === 4 && "Good experience"}
            {rating === 5 && "Excellent experience"}
          </p>
        )}
      </div>

      {/* Category */}
      <div>
        <label
          htmlFor="feedback-category"
          className="mb-2 block text-sm font-medium text-gray-900"
        >
          Category
        </label>

        <select
          id="feedback-category"
          value={category}
          onChange={(event) =>
            setCategory(event.target.value)
          }
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-950"
        >
          {categories.map((item) => (
            <option
              key={item.value}
              value={item.value}
            >
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {/* Feedback */}
      <div>
        <label
          htmlFor="feedback-message"
          className="mb-2 block text-sm font-medium text-gray-900"
        >
          Your feedback
        </label>

        <textarea
          id="feedback-message"
          required
          maxLength={5000}
          rows={7}
          value={message}
          onChange={(event) =>
            setMessage(event.target.value)
          }
          className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-950"
          placeholder="Tell us what you think about QR..."
        />

        <p className="mt-2 text-xs text-gray-500">
          {message.length}/5000
        </p>
      </div>

      {/* Public testimonial permission */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(event) =>
              setIsPublic(event.target.checked)
            }
            className="mt-1 h-4 w-4 rounded border-gray-300"
          />

          <span>
            <span className="block text-sm font-medium text-gray-900">
              I’m happy for QR to use my feedback publicly
            </span>

            <span className="mt-1 block text-xs leading-5 text-gray-600">
              If selected, your feedback may be used as a
              testimonial on the QR website. Your feedback
              will still need to be reviewed and approved
              before it becomes public.
            </span>
          </span>
        </label>

        {isPublic && (
          <div className="mt-5 space-y-4 border-t border-gray-200 pt-5">
            <div>
              <label
                htmlFor="feedback-display-name"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Name to display
              </label>

              <input
                id="feedback-display-name"
                type="text"
                maxLength={100}
                value={displayName}
                onChange={(event) =>
                  setDisplayName(event.target.value)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-950"
                placeholder="Your name"
              />
            </div>

            <div>
              <label
                htmlFor="feedback-business-name"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Business name
                <span className="ml-1 font-normal text-gray-500">
                  (optional)
                </span>
              </label>

              <input
                id="feedback-business-name"
                type="text"
                maxLength={150}
                value={businessName}
                onChange={(event) =>
                  setBusinessName(event.target.value)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-950"
                placeholder="Your business"
              />
            </div>
          </div>
        )}
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {success && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-lg bg-green-50 p-4 text-sm text-green-700"
        >
          <Check className="mt-0.5 h-4 w-4 shrink-0" />

          <div>
            <p className="font-medium">
              Thank you for your feedback.
            </p>

            <p className="mt-1 text-green-700/90">
              Your feedback has been submitted successfully.
              If you allowed public use, it will be reviewed
              before appearing on the QR website.
            </p>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Send className="h-4 w-4" />

        {loading
          ? "Submitting..."
          : "Submit feedback"}
      </button>
    </form>
  );
}