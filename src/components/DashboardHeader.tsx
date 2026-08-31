"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

const navItems = [
  {
    href: "/dashboard",
    label: "Businesses",
  },
  {
    href: "/dashboard/business/new",
    label: "Add Business",
  },
  {
    href: "/dashboard/account",
    label: "Account",
  },
  {
    href: "/faq",
    label: "FAQ",
  },
  {
    href: "/contact",
    label: "Support",
  },
];

export default function DashboardHeader() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="shrink-0 text-lg font-bold text-gray-900"
        >
          QR
        </Link>

        <nav className="hidden items-center gap-2 sm:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive(item.href)
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LogoutButton />
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto border-t border-gray-100 px-4 py-2 sm:hidden">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium ${
              isActive(item.href)
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}