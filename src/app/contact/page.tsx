import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  MessageCircle,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import SupportForm from "@/components/SupportForm";

export default async function ContactPage() {
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

  return (
    <main className="min-h-screen bg-[#F7F7F5]">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
        <Link
          href="/dashboard/account"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to account
        </Link>

        <div className="mt-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-950 text-white">
            <MessageCircle className="h-5 w-5" />
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
            Support
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            Contact support
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600">
            Tell us what you need help with and we'll get back to you as soon as possible.
          </p>
        </div>

        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <SupportForm
            initialName={profile?.name ?? ""}
            initialEmail={user.email ?? ""}
          />
        </section>
      </div>
    </main>
  );
}