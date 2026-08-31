"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] =
    useState(false);

  async function handleLogout() {
    setLoading(true);

    await supabase.auth.signOut();

    router.replace("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 transition hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <LogOut className="h-4 w-4" />

      {loading
        ? "Signing out..."
        : "Sign out"}
    </button>
  );
}