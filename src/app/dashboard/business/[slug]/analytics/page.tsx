import { BarChart3, MousePointerClick, Eye } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import BusinessNavigation from "@/components/BusinessNavigation";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

type AnalyticsEvent = {
  id: string;
  business_id: string;
  link_id: string | null;
  event_type: "profile_view" | "action_click";
  action_name: string | null;
  created_at: string;
};

type DayPoint = {
  label: string;
  dateKey: string;
  count: number;
};

function startOfDay(date: Date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function startOfWeek(date: Date) {
  const value = startOfDay(date);
  const day = value.getDay();

  const difference =
    day === 0 ? 6 : day - 1;

  value.setDate(
    value.getDate() - difference
  );

  return value;
}

function startOfMonth(date: Date) {
  const value = startOfDay(date);

  value.setDate(1);

  return value;
}

function formatDayLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
  }).format(date);
}

function getDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function buildSevenDayChart(
  events: AnalyticsEvent[],
  now: Date
): DayPoint[] {
  const today = startOfDay(now);

  const days: DayPoint[] = [];

  for (let index = 6; index >= 0; index--) {
    const date = new Date(today);

    date.setDate(
      today.getDate() - index
    );

    const dateKey = getDateKey(date);

    const count = events.filter((event) => {
      if (event.event_type !== "profile_view") {
        return false;
      }

      const eventDate =
        new Date(event.created_at);

      return (
        getDateKey(eventDate) === dateKey
      );
    }).length;

    days.push({
      label: formatDayLabel(date),
      dateKey,
      count,
    });
  }

  return days;
}

export default async function AnalyticsPage({
  params,
}: Props) {
  const { slug } = await params;

  const supabase = await createClient();

  const {
    data: {
      user,
    },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("id, name, slug")
    .eq("slug", slug)
    .eq("owner_id", user.id)
    .single();

  if (!business) {
    notFound();
  }

  /*
   * We only need recent events for Phase 1:
   *
   * - today
   * - this week
   * - this month
   * - seven-day chart
   * - top actions
   *
   * 31 days gives us enough room for the
   * current calendar month.
   */

  const now = new Date();

  const monthStart =
    startOfMonth(now);

  const { data: events, error } =
    await supabase
      .from("analytics_events")
      .select(`
        id,
        business_id,
        link_id,
        event_type,
        action_name,
        created_at
      `)
      .eq("business_id", business.id)
      .gte(
        "created_at",
        monthStart.toISOString()
      )
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    console.error(
      "Analytics query error:",
      error
    );
  }

  const analyticsEvents =
    (events || []) as AnalyticsEvent[];

  const todayStart =
    startOfDay(now);

  const weekStart =
    startOfWeek(now);

  const currentMonthStart =
    startOfMonth(now);

  const profileViews =
    analyticsEvents.filter(
      (event) =>
        event.event_type ===
        "profile_view"
    );

  const actionClicks =
    analyticsEvents.filter(
      (event) =>
        event.event_type ===
        "action_click"
    );

  const profileViewsToday =
    profileViews.filter(
      (event) =>
        new Date(event.created_at) >=
        todayStart
    ).length;

  const profileViewsThisWeek =
    profileViews.filter(
      (event) =>
        new Date(event.created_at) >=
        weekStart
    ).length;

  const profileViewsThisMonth =
    profileViews.filter(
      (event) =>
        new Date(event.created_at) >=
        currentMonthStart
    ).length;

  const actionClicksToday =
    actionClicks.filter(
      (event) =>
        new Date(event.created_at) >=
        todayStart
    ).length;

  const actionClicksThisWeek =
    actionClicks.filter(
      (event) =>
        new Date(event.created_at) >=
        weekStart
    ).length;

  const actionClicksThisMonth =
    actionClicks.filter(
      (event) =>
        new Date(event.created_at) >=
        currentMonthStart
    ).length;

  const chart =
    buildSevenDayChart(
      analyticsEvents,
      now
    );

  const actionCounts =
    new Map<string, number>();

  actionClicks.forEach((event) => {
    const name =
      event.action_name?.trim();

    if (!name) {
      return;
    }

    actionCounts.set(
      name,
      (actionCounts.get(name) || 0) + 1
    );
  });

  const topActions =
    Array.from(
      actionCounts.entries()
    )
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort(
        (a, b) =>
          b.count - a.count
      )
      .slice(0, 5);

  const maximumChartCount =
    Math.max(
      ...chart.map(
        (day) => day.count
      ),
      1
    );

  return (
    <main className="min-h-screen bg-[#F7F7F5]">
      <BusinessNavigation
        slug={business.slug}
        businessName={business.name}
      />

      <section>
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
              Analytics
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-950">
              Understand your profile activity.
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
              See how often people view your
              profile and which actions they
              use most.
            </p>
          </div>

          {/* Summary cards */}
          <div className="grid gap-5 md:grid-cols-3">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Profile views
                  </p>

                  <p className="mt-2 text-3xl font-bold tracking-tight text-gray-950">
                    {profileViewsThisMonth}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    This month
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                  <Eye className="h-5 w-5 text-gray-950" />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-gray-100 pt-5">
                <div>
                  <p className="text-xs text-gray-500">
                    Today
                  </p>

                  <p className="mt-1 text-lg font-semibold text-gray-950">
                    {profileViewsToday}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    This week
                  </p>

                  <p className="mt-1 text-lg font-semibold text-gray-950">
                    {profileViewsThisWeek}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Action clicks
                  </p>

                  <p className="mt-2 text-3xl font-bold tracking-tight text-gray-950">
                    {actionClicksThisMonth}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    This month
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                  <MousePointerClick className="h-5 w-5 text-gray-950" />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-gray-100 pt-5">
                <div>
                  <p className="text-xs text-gray-500">
                    Today
                  </p>

                  <p className="mt-1 text-lg font-semibold text-gray-950">
                    {actionClicksToday}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    This week
                  </p>

                  <p className="mt-1 text-lg font-semibold text-gray-950">
                    {actionClicksThisWeek}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Top action
                  </p>

                  {topActions.length > 0 ? (
                    <>
                      <p className="mt-2 truncate text-2xl font-bold tracking-tight text-gray-950">
                        {topActions[0].name}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {topActions[0].count}{" "}
                        {topActions[0].count ===
                        1
                          ? "click"
                          : "clicks"}{" "}
                        this month
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="mt-2 text-2xl font-bold tracking-tight text-gray-950">
                        —
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        No action clicks yet
                      </p>
                    </>
                  )}
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                  <BarChart3 className="h-5 w-5 text-gray-950" />
                </div>
              </div>

              <div className="mt-6 border-t border-gray-100 pt-5">
                <p className="text-xs leading-5 text-gray-500">
                  Based on activity recorded
                  this month.
                </p>
              </div>
            </section>
          </div>

          {/* Seven-day chart */}
          <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
            <div>
              <h3 className="text-base font-semibold text-gray-950">
                Profile views
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Last 7 days
              </p>
            </div>

            <div className="mt-8">
              <div className="flex h-56 items-end gap-3 sm:gap-5">
                {chart.map((day) => {
                  const height =
                    day.count === 0
                      ? 4
                      : Math.max(
                          8,
                          (day.count /
                            maximumChartCount) *
                            100
                        );

                  return (
                    <div
                      key={day.dateKey}
                      className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                    >
                      <div className="flex w-full flex-1 items-end">
                        <div
                          className="w-full rounded-t-lg bg-gray-950 transition-all"
                          style={{
                            height: `${height}%`,
                          }}
                          title={`${day.count} profile ${
                            day.count === 1
                              ? "view"
                              : "views"
                          }`}
                        />
                      </div>

                      <div className="text-center">
                        <p className="text-xs font-medium text-gray-500">
                          {day.label}
                        </p>

                        <p className="mt-1 text-xs font-semibold text-gray-950">
                          {day.count}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Top actions */}
          <section className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-5 sm:px-7">
              <h3 className="text-base font-semibold text-gray-950">
                Top actions
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Most clicked actions this month.
              </p>
            </div>

            {topActions.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {topActions.map(
                  (action, index) => {
                    const percentage =
                      actionClicksThisMonth >
                      0
                        ? Math.round(
                            (action.count /
                              actionClicksThisMonth) *
                              100
                          )
                        : 0;

                    return (
                      <div
                        key={action.name}
                        className="flex items-center gap-4 px-6 py-5 sm:px-7"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-700">
                          {index + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-4">
                            <p className="truncate text-sm font-semibold text-gray-950">
                              {action.name}
                            </p>

                            <p className="shrink-0 text-sm font-semibold text-gray-950">
                              {action.count}
                            </p>
                          </div>

                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="h-full rounded-full bg-gray-950"
                              style={{
                                width: `${percentage}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            ) : (
              <div className="px-6 py-12 text-center sm:px-7">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                  <MousePointerClick className="h-5 w-5 text-gray-500" />
                </div>

                <p className="mt-4 text-sm font-semibold text-gray-950">
                  No action clicks yet.
                </p>

                <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-gray-500">
                  When visitors interact with
                  your profile actions, their
                  activity will appear here.
                </p>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}