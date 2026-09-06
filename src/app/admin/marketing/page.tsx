import { redirect } from "next/navigation";

import {
  BarChart3,
  BriefcaseBusiness,
  MousePointerClick,
  Users,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";

type Attribution = {
  id: string;
  visitor_id: string;
  source: string;
  medium: string | null;
  campaign: string | null;
  content: string | null;
  first_seen_at: string;
};

type AttributionEvent = {
  id: string;
  attribution_id: string;
  event_type:
    | "signup"
    | "business_created"
    | "identified";
  business_id: string | null;
  created_at: string;
};

type SourceStats = {
  visitors: number;
  signups: number;
  businesses: number;
};

export default async function AdminMarketingPage() {
  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/login");
  }

  const adminEmail =
    process.env.ADMIN_EMAIL
      ?.trim()
      .toLowerCase();

  if (
    !adminEmail ||
    user.email
      .trim()
      .toLowerCase() !==
      adminEmail
  ) {
    redirect("/dashboard");
  }

  const [
    {
      data: attributions,
      error: attributionError,
    },
    {
      data: events,
      error: eventError,
    },
  ] = await Promise.all([
    adminClient
      .from(
        "marketing_attributions"
      )
      .select(
        "id, visitor_id, source, medium, campaign, content, first_seen_at"
      )
      .order(
        "first_seen_at",
        {
          ascending: false,
        }
      ),

    adminClient
      .from(
        "marketing_attribution_events"
      )
      .select(
        "id, attribution_id, event_type, business_id, created_at"
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      ),
  ]);

  if (
    attributionError ||
    eventError
  ) {
    const message =
      attributionError?.message ||
      eventError?.message;

    return (
      <main className="min-h-screen bg-[#F7F7F5]">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14">
          <h1 className="text-2xl font-bold text-gray-950">
            Unable to load marketing attribution
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            {message}
          </p>
        </div>
      </main>
    );
  }

  const rows =
    (attributions || []) as Attribution[];

  const eventRows =
    (events || []) as AttributionEvent[];

  const eventByAttribution =
    new Map<
      string,
      AttributionEvent[]
    >();

  for (const event of eventRows) {
    const list =
      eventByAttribution.get(
        event.attribution_id
      ) || [];

    list.push(event);

    eventByAttribution.set(
      event.attribution_id,
      list
    );
  }

  const sourceMap =
    new Map<
      string,
      SourceStats
    >();

  for (const attribution of rows) {
    const current =
      sourceMap.get(
        attribution.source
      ) || {
        visitors: 0,
        signups: 0,
        businesses: 0,
      };

    current.visitors += 1;

    const attributionEvents =
      eventByAttribution.get(
        attribution.id
      ) || [];

    if (
      attributionEvents.some(
        (event) =>
          event.event_type ===
          "signup"
      )
    ) {
      current.signups += 1;
    }

    current.businesses +=
      attributionEvents.filter(
        (event) =>
          event.event_type ===
          "business_created"
      ).length;

    sourceMap.set(
      attribution.source,
      current
    );
  }

  const sourceRows =
    Array.from(
      sourceMap.entries()
    )
      .map(
        ([source, stats]) => ({
          source,
          ...stats,
        })
      )
      .sort(
        (a, b) =>
          b.visitors -
          a.visitors
      );

  const totalVisitors =
    rows.length;

  const totalSignups =
    eventRows.filter(
      (event) =>
        event.event_type ===
        "signup"
    ).length;

  const totalBusinesses =
    eventRows.filter(
      (event) =>
        event.event_type ===
        "business_created"
    ).length;

  const sourceCount =
    sourceRows.length;

  const campaignMap =
    new Map<
      string,
      {
        visitors: number;
        signups: number;
        businesses: number;
      }
    >();

  for (const attribution of rows) {
    const campaign =
      attribution.campaign ||
      "No campaign";

    const current =
      campaignMap.get(
        campaign
      ) || {
        visitors: 0,
        signups: 0,
        businesses: 0,
      };

    current.visitors += 1;

    const attributionEvents =
      eventByAttribution.get(
        attribution.id
      ) || [];

    if (
      attributionEvents.some(
        (event) =>
          event.event_type ===
          "signup"
      )
    ) {
      current.signups += 1;
    }

    current.businesses +=
      attributionEvents.filter(
        (event) =>
          event.event_type ===
          "business_created"
      ).length;

    campaignMap.set(
      campaign,
      current
    );
  }

  const campaignRows =
    Array.from(
      campaignMap.entries()
    )
      .map(
        ([campaign, stats]) => ({
          campaign,
          ...stats,
        })
      )
      .sort(
        (a, b) =>
          b.visitors -
          a.visitors
      )
      .slice(0, 20);

  return (
    <main className="min-h-screen bg-[#F7F7F5]">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-10">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
              Admin
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              Marketing Attribution
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
              See where QR visitors came from and how many became users and businesses.
            </p>
          </div>

          <a
            href="/dashboard"
            className="inline-flex min-h-10 items-center justify-center rounded-xl border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
          >
            Dashboard
          </a>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            icon={
              <Users className="h-5 w-5 text-gray-700" />
            }
            label="Attributed visitors"
            value={totalVisitors}
          />

          <SummaryCard
            icon={
              <MousePointerClick className="h-5 w-5 text-gray-700" />
            }
            label="Signups"
            value={totalSignups}
          />

          <SummaryCard
            icon={
              <BriefcaseBusiness className="h-5 w-5 text-gray-700" />
            }
            label="Businesses created"
            value={totalBusinesses}
          />

          <SummaryCard
            icon={
              <BarChart3 className="h-5 w-5 text-gray-700" />
            }
            label="Sources"
            value={sourceCount}
          />
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
            <h2 className="font-semibold text-gray-950">
              Performance by source
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              First-touch attribution for each anonymous visitor.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-semibold sm:px-6">
                    Source
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    Visitors
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    Signups
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    Businesses
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    Signup rate
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {sourceRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-10 text-center text-gray-500 sm:px-6"
                    >
                      No attribution data yet.
                    </td>
                  </tr>
                ) : (
                  sourceRows.map(
                    (row) => (
                      <tr
                        key={
                          row.source
                        }
                      >
                        <td className="px-5 py-4 font-semibold text-gray-950 sm:px-6">
                          {row.source}
                        </td>

                        <td className="px-5 py-4 text-gray-700">
                          {row.visitors}
                        </td>

                        <td className="px-5 py-4 text-gray-700">
                          {row.signups}
                        </td>

                        <td className="px-5 py-4 text-gray-700">
                          {row.businesses}
                        </td>

                        <td className="px-5 py-4 text-gray-700">
                          {row.visitors
                            ? `${Math.round(
                                (row.signups /
                                  row.visitors) *
                                  100
                              )}%`
                            : "0%"}
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
            <h2 className="font-semibold text-gray-950">
              Campaign performance
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Compare different campaign names without changing the database structure.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-semibold sm:px-6">
                    Campaign
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    Visitors
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    Signups
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    Businesses
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {campaignRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-10 text-center text-gray-500 sm:px-6"
                    >
                      No campaigns yet.
                    </td>
                  </tr>
                ) : (
                  campaignRows.map(
                    (row) => (
                      <tr
                        key={
                          row.campaign
                        }
                      >
                        <td className="px-5 py-4 font-semibold text-gray-950 sm:px-6">
                          {row.campaign}
                        </td>

                        <td className="px-5 py-4 text-gray-700">
                          {row.visitors}
                        </td>

                        <td className="px-5 py-4 text-gray-700">
                          {row.signups}
                        </td>

                        <td className="px-5 py-4 text-gray-700">
                          {row.businesses}
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-semibold text-gray-950">
            Promotion link examples
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Replace the domain with your real QR production domain.
          </p>

          <div className="mt-5 space-y-3 rounded-xl bg-gray-950 p-4 font-mono text-xs leading-6 text-gray-100 sm:text-sm">
            <p>
              /https://qrfor.vercel.app/?source=whatsapp&amp;campaign=free-launch&amp;content=status-01
            </p>

            <p>
              /https://qrfor.vercel.app/?source=facebook&amp;campaign=free-launch&amp;content=group-01
            </p>

            <p>
              /https://qrfor.vercel.app/?source=instagram&amp;campaign=free-launch&amp;content=comment-01
            </p>

            <p>
              /https://qrfor.vercel.app/?source=linkedin&amp;campaign=free-launch&amp;content=group-01
            </p>

            <p>
              /https://qrfor.vercel.app/?source=x&amp;campaign=free-launch&amp;content=post-01
            </p>

            <p>
              /https://qrfor.vercel.app/?source=reddit&campaign=free-launch&content=post-01
            </p>

            <p>
              /https://qrfor.vercel.app/?source=reddit&amp;campaign=free-launch&amp;content=post-01
            </p>

            <p>
              /https://qrfor.vercel.app/?source=launchads&campaign=campaign-123&content=ad-456
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
          {icon}
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500">
            {label}
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-950">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}