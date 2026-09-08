import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Link2,
  MapPin,
  MessageCircle,
  Phone,
  QrCode,
  Share2,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

const capabilities = [
  {
    icon: Link2,
    title: "One place for your identity",
    description:
      "Bring the information people need to know about you or your organization into one clear digital profile.",
  },
  {
    icon: Share2,
    title: "Share it anywhere",
    description:
      "Give people one simple link to your profile, or let them reach it through a QR code.",
  },
  {
    icon: QrCode,
    title: "QR as your doorway",
    description:
      "Your QR code gives people a simple way to open your digital profile wherever you choose to place it.",
  },
];

const businessActions = [
  {
    icon: Phone,
    label: "Call",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
  },
  {
    icon: Link2,
    label: "Website",
  },
  {
    icon: MapPin,
    label: "Location",
  },
];

const identityExamples = [
  "Professional profile",
  "Business profile",
  "Experience",
  "Services",
  "Portfolio",
  "Contact",
];

export default async function HomePage() {
  const supabase = await createClient();

  const { data: approvedFeedback } = await supabase
    .from("feedback")
    .select(
      "id, rating, message, display_name, business_name, created_at"
    )
    .eq("is_public", true)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <main className="min-h-screen bg-[#F7F7F5] text-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-[#F7F7F5]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-gray-950"
          >
            QR
          </Link>

          <nav className="hidden items-center gap-7 sm:flex">
            <Link
              href="#why-qr"
              className="text-sm font-medium text-gray-600 transition hover:text-gray-950"
            >
              Why QR
            </Link>

            <Link
              href="#for-who"
              className="text-sm font-medium text-gray-600 transition hover:text-gray-950"
            >
              For people & organizations
            </Link>

            <Link
              href="#how-it-works"
              className="text-sm font-medium text-gray-600 transition hover:text-gray-950"
            >
              How it works
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/dashboard"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-white hover:text-gray-950 sm:inline-flex"
            >
              Dashboard
            </Link>

            <Link
              href="/signup"
              className="inline-flex items-center rounded-lg bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Early access banner */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-5 py-3 text-center text-xs font-medium text-gray-600 sm:text-sm">
          <Sparkles className="h-4 w-4 shrink-0 text-gray-950" />
          <span>
            QR is free for early users. Build your profile, share it, and help
            us improve the platform through real-world use.
          </span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-gray-600 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-gray-950" />
              Digital identity, made shareable
            </div>

            <h1 className="mt-7 text-5xl font-bold tracking-[-0.05em] text-gray-950 sm:text-6xl lg:text-7xl">
              Your identity.
              <br />
              One place to represent it.
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              QR gives people and organizations a simple digital place to
              represent who they are, what they do, and how others can connect
              with them.
            </p>

            <p className="mt-4 max-w-xl text-sm leading-6 text-gray-500">
              Today, you can create a digital business profile and share it
              with a link or QR code. QR is growing toward a broader identity
              platform for people, businesses, and organizations.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gray-950 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
              >
                Create your profile
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-gray-300 bg-white px-6 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
              >
                Open Dashboard
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
              <span className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-gray-900" />
                Free for early users
              </span>

              <span className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-gray-900" />
                Simple to create
              </span>

              <span className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-gray-900" />
                Easy to share
              </span>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="relative overflow-hidden rounded-[2rem] border border-gray-200 bg-white p-3 shadow-2xl shadow-gray-300/30">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem]">
                <Image
                  src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=85"
                  alt="Modern professional workspace"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-black/10" />

                {/* Identity card */}
                <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/70 bg-white/95 p-5 shadow-xl backdrop-blur sm:bottom-7 sm:left-7 sm:right-auto sm:w-[310px]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-950 text-sm font-bold text-white">
                      QR
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-950">
                        Your identity
                      </p>

                      <p className="mt-0.5 text-xs text-gray-500">
                        One place to represent it.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {identityExamples.map((item) => (
                      <span
                        key={item}
                        className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-[10px] font-medium text-gray-600"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* QR card */}
            <div className="absolute -bottom-7 -right-3 hidden w-32 rounded-2xl border border-gray-200 bg-white p-3 shadow-xl sm:block lg:-right-7">
              <div className="flex aspect-square items-center justify-center rounded-xl bg-gray-950 p-3">
                <div className="grid grid-cols-7 gap-0.5">
                  {Array.from({ length: 49 }).map((_, index) => (
                    <span
                      key={index}
                      className={`h-2 w-2 ${
                        [
                          0,
                          1,
                          2,
                          4,
                          5,
                          6,
                          7,
                          9,
                          10,
                          11,
                          13,
                          15,
                          16,
                          18,
                          19,
                          20,
                          22,
                          24,
                          25,
                          27,
                          28,
                          30,
                          31,
                          33,
                          34,
                          35,
                          37,
                          39,
                          40,
                          42,
                          43,
                          44,
                          46,
                          47,
                          48,
                        ].includes(index)
                          ? "bg-white"
                          : "bg-gray-950"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="mt-2 text-center text-[10px] font-semibold text-gray-600">
                Scan to connect
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For whom */}
      <section
        id="for-who"
        className="border-y border-gray-200 bg-white"
      >
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
              Built around identity
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              The same idea works for people and organizations.
            </h2>

            <p className="mt-4 text-base leading-7 text-gray-600">
              What people need to communicate about themselves is different
              from what a company or organization needs to communicate. QR is
              being built to represent both.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {/* Individual */}
            <article className="rounded-[1.75rem] border border-gray-200 bg-[#F7F7F5] p-7 sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-950 text-white">
                <BriefcaseBusiness className="h-5 w-5" />
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                Individuals
              </p>

              <h3 className="mt-2 text-2xl font-bold tracking-tight text-gray-950">
                Represent who you are.
              </h3>

              <p className="mt-3 max-w-lg text-sm leading-6 text-gray-600">
                Your professional identity can contain the information that
                helps people understand your experience, skills, work,
                portfolio, and how to connect with you.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "Professional identity",
                  "Experience",
                  "Skills",
                  "Portfolio",
                  "CV",
                  "Contact",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-7 border-t border-gray-200 pt-5">
                <p className="text-xs font-medium text-gray-500">
                  Professional identity features are part of the direction
                  QR is being built toward.
                </p>
              </div>
            </article>

            {/* Organization */}
            <article className="rounded-[1.75rem] border border-gray-200 bg-gray-950 p-7 text-white sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-gray-950">
                <Users className="h-5 w-5" />
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                Organizations
              </p>

              <h3 className="mt-2 text-2xl font-bold tracking-tight">
                Represent what you do.
              </h3>

              <p className="mt-3 max-w-lg text-sm leading-6 text-gray-400">
                A business or organization can bring its identity, services,
                projects, people, contact methods, and other important
                information into one place.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "Business profile",
                  "Services",
                  "Projects",
                  "Team",
                  "Capabilities",
                  "Contact",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-xs font-medium text-gray-300"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-7 border-t border-gray-800 pt-5">
                <p className="text-xs font-medium text-gray-400">
                  Business profiles are available today. More organizational
                  capabilities will be built around them.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Why QR */}
      <section
        id="why-qr"
        className="border-b border-gray-200 bg-[#F7F7F5]"
      >
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
              Why QR
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              Create once. Represent yourself clearly. Share anywhere.
            </h2>

            <p className="mt-4 text-base leading-7 text-gray-600">
              Instead of repeatedly rebuilding the same information for every
              place you need to present yourself or your organization, QR is
              designed around a living digital identity.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {capabilities.map((capability) => {
              const Icon = capability.icon;

              return (
                <article
                  key={capability.title}
                  className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-950 text-white">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-6 text-lg font-semibold text-gray-950">
                    {capability.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {capability.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="border-b border-gray-200 bg-white"
      >
        <div className="mx-auto grid max-w-7xl gap-14 px-5 py-20 sm:px-6 sm:py-24 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-gray-100">
            <div className="relative aspect-[4/5]">
              <Image
                src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1100&q=85"
                alt="Person using a smartphone"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>

            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/70 bg-white/95 p-5 shadow-xl backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                One identity
              </p>

              <p className="mt-1 text-lg font-bold text-gray-950">
                Many ways to connect.
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
              How it works
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              Put the important information together.
              <br />
              Then share it.
            </h2>

            <div className="mt-10 space-y-8">
              <div className="flex gap-5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-950 text-sm font-bold text-white">
                  1
                </div>

                <div>
                  <h3 className="font-semibold text-gray-950">
                    Create your profile
                  </h3>

                  <p className="mt-1.5 text-sm leading-6 text-gray-600">
                    Today, businesses can create a digital profile with their
                    name, description, branding, contact information, links,
                    location, and customer actions.
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-950 text-sm font-bold text-white">
                  2
                </div>

                <div>
                  <h3 className="font-semibold text-gray-950">
                    Connect what matters
                  </h3>

                  <p className="mt-1.5 text-sm leading-6 text-gray-600">
                    Bring the ways people can interact with you or your
                    organization into one clear destination.
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-950 text-sm font-bold text-white">
                  3
                </div>

                <div>
                  <h3 className="font-semibold text-gray-950">
                    Share your identity
                  </h3>

                  <p className="mt-1.5 text-sm leading-6 text-gray-600">
                    Use your profile link or QR code wherever people need a
                    simple way to find and connect with you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Current product */}
      <section className="overflow-hidden bg-gray-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 py-20 sm:px-6 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
              Available today
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              A digital business profile people can actually use.
            </h2>

            <p className="mt-5 max-w-lg text-base leading-7 text-gray-400">
              Customers can open your profile, find your information, and
              take action without needing an account or a special QR app.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {[
                "Phone",
                "WhatsApp",
                "Website",
                "Location",
                "Social links",
                "Custom links",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-xs font-medium text-gray-300"
                >
                  {item}
                </span>
              ))}
            </div>

            <Link
              href="/signup"
              className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-gray-950 transition hover:bg-gray-100"
            >
              Create your profile
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mx-auto w-full max-w-lg">
            <div className="rounded-[2rem] bg-white p-3 shadow-2xl">
              <div className="rounded-[1.5rem] bg-[#F7F7F5] p-6 text-gray-950 sm:p-8">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl">
                    <Image
                      src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=300&q=80"
                      alt="Business workspace"
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold">Your Business</h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Everything in one profile.
                    </p>
                  </div>
                </div>

                <div className="mt-7 space-y-3">
                  {businessActions.map((action) => {
                    const Icon = action.icon;

                    return (
                      <div
                        key={action.label}
                        className="flex min-h-14 items-center gap-3 rounded-xl border border-gray-200 bg-white px-4"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-950 text-white">
                          <Icon className="h-4 w-4" />
                        </div>

                        <span className="text-sm font-medium">
                          {action.label}
                        </span>

                        <ArrowRight className="ml-auto h-4 w-4 text-gray-400" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free early access */}
      <section className="border-b border-gray-200 bg-[#F7F7F5]">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-6 sm:py-24">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-950 text-white">
            <Sparkles className="h-6 w-6" />
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
            Early access
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            QR is free for early users.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600">
            We are making QR available free during the early stage so people
            and organizations can use the platform in the real world, build
            their digital presence, and help us improve it through actual use
            and feedback.
          </p>

          <Link
            href="/signup"
            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-gray-950 px-7 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
          >
            Get started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Feedback */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
              From QR users
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              What QR users are saying.
            </h2>

            <p className="mt-4 text-base leading-7 text-gray-600">
              QR is being shaped through real-world use and feedback from the
              people using it.
            </p>
          </div>

          {approvedFeedback && approvedFeedback.length > 0 ? (
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {approvedFeedback.map((feedback) => (
                <article
                  key={feedback.id}
                  className="rounded-2xl border border-gray-200 bg-[#F7F7F5] p-7"
                >
                  <div
                    className="flex gap-1"
                    aria-label={`${feedback.rating} out of 5 stars`}
                  >
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`h-4 w-4 ${
                          index < feedback.rating
                            ? "fill-current text-gray-950"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  <blockquote className="mt-5 text-sm leading-7 text-gray-700">
                    “{feedback.message}”
                  </blockquote>

                  <div className="mt-6 border-t border-gray-200 pt-5">
                    {feedback.display_name && (
                      <p className="text-sm font-semibold text-gray-950">
                        {feedback.display_name}
                      </p>
                    )}

                    {feedback.business_name && (
                      <p className="mt-1 text-xs text-gray-500">
                        {feedback.business_name}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-gray-200 bg-[#F7F7F5] p-8 text-center sm:p-10">
              <p className="text-base font-semibold text-gray-950">
                We’re building QR with our users.
              </p>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-600">
                Have you used QR? Share your experience and help us make it
                better.
              </p>
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              href="/feedback"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-950 transition hover:text-gray-600"
            >
              Share your experience
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#F7F7F5]">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-6 sm:py-24">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-950 text-white">
            <QrCode className="h-6 w-6" />
          </div>

          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            Start representing your identity.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-gray-600">
            Create your digital business profile today, connect the ways
            people can reach you, and share it with one simple link or QR
            code.
          </p>

          <Link
            href="/signup"
            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-gray-950 px-7 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
          >
            Get started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <div>
              <Link
                href="/"
                className="text-lg font-bold tracking-tight text-gray-950"
              >
                QR
              </Link>

              <p className="mt-3 max-w-xs text-sm leading-6 text-gray-500">
                A digital identity platform for people and organizations.
                Today, businesses can create and share digital profiles.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-950">
                Product
              </h3>

              <div className="mt-4 space-y-3">
                <Link
                  href="#why-qr"
                  className="block text-sm text-gray-500 transition hover:text-gray-950"
                >
                  Why QR
                </Link>

                <Link
                  href="#for-who"
                  className="block text-sm text-gray-500 transition hover:text-gray-950"
                >
                  For people & organizations
                </Link>

                <Link
                  href="#how-it-works"
                  className="block text-sm text-gray-500 transition hover:text-gray-950"
                >
                  How it works
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-950">
                Account
              </h3>

              <div className="mt-4 space-y-3">
                <Link
                  href="/signup"
                  className="block text-sm text-gray-500 transition hover:text-gray-950"
                >
                  Get started
                </Link>

                <Link
                  href="/dashboard"
                  className="block text-sm text-gray-500 transition hover:text-gray-950"
                >
                  Dashboard
                </Link>

                <Link
                  href="/login"
                  className="block text-sm text-gray-500 transition hover:text-gray-950"
                >
                  Sign in
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-950">
                Support
              </h3>

              <div className="mt-4 space-y-3">
                <Link
                  href="/faq"
                  className="block text-sm text-gray-500 transition hover:text-gray-950"
                >
                  FAQ
                </Link>

                <Link
                  href="/contact"
                  className="block text-sm text-gray-500 transition hover:text-gray-950"
                >
                  Contact us
                </Link>

                <Link
                  href="/feedback"
                  className="block text-sm text-gray-500 transition hover:text-gray-950"
                >
                  Feedback
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-gray-200 pt-6 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} QR. All rights reserved.</p>

            <p>Digital identity made shareable.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}