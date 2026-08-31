import { redirect } from "next/navigation";
import {
  AlertTriangle,
  HelpCircle,
  Mail,
  MessageCircle,
  ShieldAlert,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import DeleteAccountButton from "@/components/DeleteAccountButton";
import AccountSettingsForm from "@/components/AccountSettingsForm";
import Link from "next/link";

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, language")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <main className="min-h-screen bg-[#F7F7F5]">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
            Account
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            Account settings
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600">
            Manage your account, security, and application preferences.
          </p>
        </div>

        <div className="mt-8">
          <AccountSettingsForm
            userId={user.id}
            email={user.email ?? ""}
            initialName={profile?.name ?? ""}
            initialLanguage={profile?.language ?? "en"}
          />
        </div>

        {/* Support */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                <MessageCircle className="h-5 w-5 text-gray-700" />
              </div>

              <div>
                <h2 className="font-semibold text-gray-950">
                  Need help?
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Contact support or find answers to common questions.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 p-5 sm:flex-row sm:p-6">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              <Mail className="h-4 w-4" />
              Contact support
            </Link>

            <Link
              href="/faq"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
            >
              <HelpCircle className="h-4 w-4" />
              View FAQ
            </Link>
          </div>
        </section>

        {/* Danger zone */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-red-200 bg-white">
          <div className="border-b border-red-100 bg-red-50 px-5 py-5 sm:px-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100">
                <ShieldAlert className="h-5 w-5 text-red-700" />
              </div>

              <div>
                <p className="text-sm font-semibold text-red-700">
                  Danger zone
                </p>

                <h2 className="mt-1 font-semibold text-gray-950">
                  Delete your account
                </h2>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

              <p className="max-w-xl text-sm leading-6 text-gray-600">
                This permanently deletes your account,
                businesses, and all links associated with
                those businesses.
              </p>
            </div>

            <div className="mt-6">
              <DeleteAccountButton />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}