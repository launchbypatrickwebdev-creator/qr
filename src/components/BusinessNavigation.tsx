"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ExternalLink,
  Link2,
  Pencil,
  QrCode,
  Settings,
} from "lucide-react";

type Props = {
  slug: string;
  businessName: string;
};

export default function BusinessNavigation({
  slug,
  businessName,
}: Props) {
  const pathname = usePathname();

  const items = [
    {
      href: `/dashboard/business/${slug}`,
      label: "Profile",
      icon: Pencil,
    },
    {
      href: `/dashboard/business/${slug}/links`,
      label: "Actions",
      icon: Link2,
    },
    {
      href: `/dashboard/business/${slug}/qr`,
      label: "QR Code",
      icon: QrCode,
    },
    {
      href: `/dashboard/business/${slug}/settings`,
      label: "Settings",
      icon: Settings,
    },
  ];

  function isActive(href: string) {
    return pathname === href;
  }

  return (
    <>
      {/* Constant business page header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex min-h-16 items-center justify-between gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-950"
            >
              <span aria-hidden="true">←</span>
              Dashboard
            </Link>

            <Link
              href={`/q/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-950"
            >
              View public profile
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Business workspace header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
            Business workspace
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            {businessName}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
            Manage your digital business identity,
            customer actions, and QR access point.
          </p>

          <nav className="mt-8 flex overflow-x-auto border-b border-gray-200">
            {items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm transition ${
                    active
                      ? "border-gray-950 font-semibold text-gray-950"
                      : "border-transparent font-medium text-gray-500 hover:text-gray-950"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </section>
    </>
  );
}