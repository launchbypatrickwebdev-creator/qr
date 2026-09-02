import { redirect } from "next/navigation";
import {
  CheckCircle2,
  Clock3,
  MessageSquare,
  Star,
} from "lucide-react";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";
import AdminFeedbackManager from "@/components/AdminFeedbackManager";

function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase admin environment variables are missing.");
  }

  return createSupabaseClient(
    supabaseUrl,
    serviceRoleKey
  );
}

export default async function AdminFeedbackPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/login");
  }

  const adminEmail =
    process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (
    !adminEmail ||
    user.email.trim().toLowerCase() !== adminEmail
  ) {
    redirect("/dashboard");
  }

  const adminSupabase = createAdminClient();

  const { data: feedback, error } = await adminSupabase
    .from("feedback")
    .select(
      "id, rating, message, category, display_name, business_name, is_public, is_approved, created_at"
    )
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    return (
      <main className="min-h-screen bg-[#F7F7F5]">
        <div className="mx-auto max-w-5xl px-5 py-10 sm:px-6 sm:py-14">
          <h1 className="text-2xl font-bold text-gray-950">
            Unable to load feedback
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            {error.message}
          </p>
        </div>
      </main>
    );
  }

  const submissions = feedback || [];

  const pendingCount = submissions.filter(
    (item) => !item.is_approved
  ).length;

  const approvedCount = submissions.filter(
    (item) => item.is_approved
  ).length;

  const publicCount = submissions.filter(
    (item) => item.is_public && item.is_approved
  ).length;

  return (
    <main className="min-h-screen bg-[#F7F7F5]">
      <div className="px-5 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-5xl">
          <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                Admin
              </p>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                Feedback
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600">
                Review feedback from QR users and choose which
                approved testimonials can appear publicly.
              </p>
            </div>

            <a
              href="/dashboard"
              className="inline-flex min-h-10 items-center justify-center rounded-xl border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
            >
              Dashboard
            </a>
          </header>

          <section className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                  <Clock3 className="h-5 w-5 text-amber-700" />
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Pending
                  </p>

                  <p className="mt-1 text-2xl font-bold text-gray-950">
                    {pendingCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                  <CheckCircle2 className="h-5 w-5 text-green-700" />
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Approved
                  </p>

                  <p className="mt-1 text-2xl font-bold text-gray-950">
                    {approvedCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                  <MessageSquare className="h-5 w-5 text-gray-700" />
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Public testimonials
                  </p>

                  <p className="mt-1 text-2xl font-bold text-gray-950">
                    {publicCount}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-10">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-950">
                  Submissions
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {submissions.length} total{" "}
                  {submissions.length === 1
                    ? "submission"
                    : "submissions"}
                </p>
              </div>

              <div className="hidden items-center gap-1 sm:flex">
                <Star className="h-4 w-4 fill-current text-gray-950" />
                <span className="text-xs text-gray-500">
                  Review before publishing
                </span>
              </div>
            </div>

            <AdminFeedbackManager
              initialFeedback={submissions}
            />
          </div>
        </div>
      </div>
    </main>
  );
}