import Link from "next/link";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { redirect } from "next/navigation";

import FeedbackForm from "@/components/FeedbackForm";
import { createClient } from "@/lib/supabase/server";

export default async function FeedbackPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user.id)
    .maybeSingle();

  const initialName = profile?.name || "";

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-6">
          <Link
            href="/dashboard"
            className="text-lg font-semibold tracking-tight text-gray-950"
          >
            QR
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 transition hover:text-gray-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </header>

      <section className="px-5 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
              <MessageSquare className="h-5 w-5 text-gray-950" />
            </div>

            <p className="mb-2 text-sm font-medium text-gray-500">
              Share your experience
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
              What do you think about QR?
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600 sm:text-base">
              Your feedback helps us understand what is
              working, what needs improvement, and what we
              should build next.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
            <FeedbackForm
              initialName={initialName}
            />
          </div>

          <p className="mt-6 text-center text-xs leading-5 text-gray-500">
            Your feedback is private by default. Public
            testimonials are only displayed after you give
            permission and the feedback is approved.
          </p>
        </div>
      </section>
    </main>
  );
}