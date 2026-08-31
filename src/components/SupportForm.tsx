"use client";

import { FormEvent, useState } from "react";
import { Check, Send } from "lucide-react";

type Props = {
  initialName: string;
  initialEmail: string;
};

export default function SupportForm({
  initialName,
  initialEmail,
}: Props) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch(
        "/api/support",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            subject,
            message,

            /*
             * Honeypot.
             * This field is intentionally hidden.
             */
            website: "",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to send your message."
        );
      }

      setSubject("");
      setMessage("");
      setSuccess(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to send your message."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <label
          htmlFor="support-name"
          className="mb-2 block text-sm font-medium text-gray-900"
        >
          Name
        </label>

        <input
          id="support-name"
          type="text"
          required
          maxLength={100}
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-950"
          placeholder="Your name"
        />
      </div>

      <div>
        <label
          htmlFor="support-email"
          className="mb-2 block text-sm font-medium text-gray-900"
        >
          Email
        </label>

        <input
          id="support-email"
          type="email"
          required
          maxLength={254}
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-950"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="support-subject"
          className="mb-2 block text-sm font-medium text-gray-900"
        >
          Subject
        </label>

        <input
          id="support-subject"
          type="text"
          required
          maxLength={200}
          value={subject}
          onChange={(event) =>
            setSubject(event.target.value)
          }
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-950"
          placeholder="What do you need help with?"
        />
      </div>

      <div>
        <label
          htmlFor="support-message"
          className="mb-2 block text-sm font-medium text-gray-900"
        >
          How can we help?
        </label>

        <textarea
          id="support-message"
          required
          maxLength={5000}
          rows={7}
          value={message}
          onChange={(event) =>
            setMessage(event.target.value)
          }
          className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-950"
          placeholder="Tell us what you need help with..."
        />
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
        <p
          role="status"
          className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700"
        >
          <Check className="h-4 w-4" />
          Your message has been sent. We'll get back to you as soon as possible.
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Send className="h-4 w-4" />

        {loading
          ? "Sending..."
          : "Send message"}
      </button>
    </form>
  );
}