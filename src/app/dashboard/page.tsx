import Link from "next/link";
import {
  ArrowUpRight,
  Link2,
  QrCode,
} from "lucide-react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getBusinessInitials } from "@/lib/color";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: businesses, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    return (
      <div className="px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-xl font-bold text-gray-950">
            Something went wrong
          </h1>

          <p className="mt-2 text-gray-600">
            {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F7F5]">
      <div className="px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-5xl">
          <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                Dashboard
              </p>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                Your Businesses
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600">
                Manage your digital business profiles,
                customer actions, and QR codes.
              </p>
            </div>
          </header>

          <div className="mt-10">
            {businesses?.length === 0 ? (
              <section className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-12">
                <h2 className="text-xl font-semibold text-gray-950">
                  No businesses yet
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
                  Create your first digital business
                  profile to start sharing your business
                  with customers.
                </p>

                <Link
                  href="/dashboard/business/new"
                  className="mt-6 inline-flex rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Create Business
                </Link>
              </section>
            ) : (
              <div className="grid gap-5">
                {businesses?.map((business) => (
                  <article
                    key={business.id}
                    className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
                  >
                    <div className="p-5 sm:p-7">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-start gap-4">
                          {business.logo_url ? (
                            <img
                              src={business.logo_url}
                              alt={`${business.name} logo`}
                              className="h-14 w-14 shrink-0 rounded-2xl border border-gray-200 bg-white object-cover"
                            />
                          ) : (
                            <div
                              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 text-base font-bold"
                              style={{
                                color:
                                  business.theme_color ||
                                  "#111827",
                              }}
                            >
                              {getBusinessInitials(
                                business.name
                              )}
                            </div>
                          )}

                          <div className="min-w-0">
                            <h2 className="truncate text-xl font-bold tracking-tight text-gray-950">
                              {business.name}
                            </h2>

                            {business.description ? (
                              <p className="mt-1 line-clamp-2 text-sm leading-6 text-gray-600">
                                {business.description}
                              </p>
                            ) : (
                              <p className="mt-1 text-sm text-gray-400">
                                Digital business profile
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="inline-flex shrink-0 items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Active
                        </div>
                      </div>

                      <div className="mt-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                          Public profile
                        </p>

                        <p className="mt-2 font-mono text-sm text-gray-700">
                          /q/{business.slug}
                        </p>
                      </div>

                      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Link
                          href={`/dashboard/business/${business.slug}`}
                          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-gray-950 px-5 text-sm font-semibold text-white transition hover:bg-gray-800"
                        >
                          Manage Profile
                        </Link>

                        <Link
                          href={`/q/${business.slug}`}
                          target="_blank"
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
                        >
                          View Profile
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>

                    <div className="flex border-t border-gray-100">
                      <Link
                        href={`/dashboard/business/${business.slug}/links`}
                        className="flex flex-1 items-center justify-center gap-2 px-4 py-4 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-950"
                      >
                        <Link2 className="h-4 w-4" />
                        Actions
                      </Link>

                      <div className="w-px bg-gray-100" />

                      <Link
                        href={`/dashboard/business/${business.slug}/qr`}
                        className="flex flex-1 items-center justify-center gap-2 px-4 py-4 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-950"
                      >
                        <QrCode className="h-4 w-4" />
                        QR Code
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}