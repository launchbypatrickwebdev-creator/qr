"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

import {
  recordMarketingEvent,
} from "@/lib/marketing-attribution";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const {
      error: loginError,
    } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (loginError) {
      setError(
        loginError.message
      );
      setLoading(false);
      return;
    }

    /*
     * Associate this visitor's
     * first-touch attribution with
     * their authenticated account.
     */
    void recordMarketingEvent(
      "identified"
    );

    router.replace(
      "/dashboard"
    );

    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <Link
          href="/"
          className="text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          ← Back home
        </Link>

        <h1 className="mt-6 text-2xl font-bold text-gray-900">
          Sign in
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          Manage your business QR profiles.
        </p>

        <form
          onSubmit={handleLogin}
          className="mt-8 space-y-5"
        >
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
              required
              autoComplete="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
              placeholder="Enter your password"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gray-900 px-4 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Signing in..."
              : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-gray-900 underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}