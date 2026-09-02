import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Link2,
  MapPin,
  MessageCircle,
  Phone,
  QrCode,
  Share2,
  Star,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

const features = [
  {
    icon: Link2,
    title: "Everything in one place",
    description:
      "Bring your phone, WhatsApp, website, social links, location, and other customer actions into one profile.",
  },
  {
    icon: QrCode,
    title: "One QR code",
    description:
      "Give customers one simple way to open your business profile from signs, cards, packaging, or your storefront.",
  },
  {
    icon: Share2,
    title: "Easy to share",
    description:
      "Share your profile anywhere with a simple link or let customers scan your QR code.",
  },
];

const actions = [
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
              href="#features"
              className="text-sm font-medium text-gray-600 transition hover:text-gray-950"
            >
              Features
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

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-gray-600 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-gray-950" />
              Digital business profiles
            </div>

            <h1 className="mt-7 text-5xl font-bold tracking-[-0.04em] text-gray-950 sm:text-6xl lg:text-7xl">
              Your business.
              <br />
              One simple link.
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              Create a digital business profile where customers can find your
              contact details, website, social links, location, and more.
              Share it with one link or one QR code.
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
                Simple to create
              </span>

              <span className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-gray-900" />
                Easy to share
              </span>

              <span className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-gray-900" />
                Free to use
              </span>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="relative overflow-hidden rounded-[2rem] border border-gray-200 bg-white p-3 shadow-2xl shadow-gray-300/30">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem]">
                <Image
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=85"
                  alt="Modern retail business interior"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-black/10" />

                {/* Floating profile card */}
                <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/70 bg-white/95 p-4 shadow-xl backdrop-blur sm:bottom-7 sm:left-7 sm:right-auto sm:w-[290px]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-950 text-sm font-bold text-white">
                      YB
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-gray-950">
                        Your Business
                      </p>

                      <p className="mt-0.5 text-xs text-gray-500">
                        Digital business profile
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {actions.map((action) => {
                      const Icon = action.icon;

                      return (
                        <div
                          key={action.label}
                          className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-2 py-2.5"
                        >
                          <Icon className="h-4 w-4 text-gray-800" />

                          <span className="text-[10px] font-medium text-gray-500">
                            {action.label}
                          </span>
                        </div>
                      );
                    })}
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

      {/* Image strip */}
      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-5 sm:grid-cols-3 sm:px-6 lg:px-8">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl sm:aspect-[4/3]">
            <Image
              src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80"
              alt="Business team working together"
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover"
            />
          </div>

          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl sm:aspect-[4/3]">
            <Image
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80"
              alt="Customer shopping at a business"
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover"
            />
          </div>

          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl sm:aspect-[4/3]">
            <Image
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80"
              alt="Modern business workspace"
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="border-b border-gray-200 bg-[#F7F7F5]"
      >
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
              Everything connected
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              Give your customers one place to start.
            </h2>

            <p className="mt-4 text-base leading-7 text-gray-600">
              Instead of sending customers in different directions, give them
              a single profile that connects them to your business.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-950 text-white">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-6 text-lg font-semibold text-gray-950">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {feature.description}
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
                alt="Customer using a smartphone"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>

            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/70 bg-white/95 p-5 shadow-xl backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                One profile
              </p>

              <p className="mt-1 text-lg font-bold text-gray-950">
                Everything customers need.
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
              How it works
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              Set it up once.
              <br />
              Share it everywhere.
            </h2>

            <div className="mt-10 space-y-8">
              <div className="flex gap-5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-950 text-sm font-bold text-white">
                  1
                </div>

                <div>
                  <h3 className="font-semibold text-gray-950">
                    Create your business profile
                  </h3>

                  <p className="mt-1.5 text-sm leading-6 text-gray-600">
                    Add your business name, description, contact details,
                    branding, and other information.
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-950 text-sm font-bold text-white">
                  2
                </div>

                <div>
                  <h3 className="font-semibold text-gray-950">
                    Add your customer actions
                  </h3>

                  <p className="mt-1.5 text-sm leading-6 text-gray-600">
                    Give customers direct ways to call, message, visit your
                    website, find your location, and more.
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-950 text-sm font-bold text-white">
                  3
                </div>

                <div>
                  <h3 className="font-semibold text-gray-950">
                    Share your profile
                  </h3>

                  <p className="mt-1.5 text-sm leading-6 text-gray-600">
                    Use your profile link or download your QR code and put it
                    wherever customers can see it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product mockup */}
      <section className="overflow-hidden bg-gray-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 py-20 sm:px-6 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
              Your digital front door
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              A profile that represents your business.
            </h2>

            <p className="mt-5 max-w-lg text-base leading-7 text-gray-400">
              Your customers do not need to understand the technology behind
              it. They simply scan, tap, and find what they need.
            </p>

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
                    <h3 className="text-lg font-bold">
                      Your Business
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Everything in one profile.
                    </p>
                  </div>
                </div>

                <div className="mt-7 space-y-3">
                  {[
                    "Call your business",
                    "Message on WhatsApp",
                    "Visit website",
                    "Get directions",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className="flex min-h-14 items-center gap-3 rounded-xl border border-gray-200 bg-white px-4"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-950 text-white">
                        {index === 0 && <Phone className="h-4 w-4" />}
                        {index === 1 && (
                          <MessageCircle className="h-4 w-4" />
                        )}
                        {index === 2 && <Link2 className="h-4 w-4" />}
                        {index === 3 && <MapPin className="h-4 w-4" />}
                      </div>

                      <span className="text-sm font-medium">
                        {item}
                      </span>

                      <ArrowRight className="ml-auto h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
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
              See what people using QR have shared about their experience.
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
                better for businesses everywhere.
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
            Put your business in one place.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-gray-600">
            Create your digital business profile, connect your customer
            actions, and share it with one simple link or QR code.
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
                Simple digital business profiles that make it easier for
                customers to connect with you.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-950">
                Product
              </h3>

              <div className="mt-4 space-y-3">
                <Link
                  href="#features"
                  className="block text-sm text-gray-500 transition hover:text-gray-950"
                >
                  Features
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

            <p>Digital business profiles made simple.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}