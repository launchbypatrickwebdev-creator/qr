import {
  notFound,
  redirect,
} from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import BusinessNavigation from "@/components/BusinessNavigation";
import DeleteBusinessButton from "@/components/DeleteBusinessButton";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BusinessSettingsPage({
  params,
}: Props) {
  const { slug } = await params;

  const supabase = await createClient();

  const {
    data: { user },
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

  return (
    <main className="min-h-screen bg-[#F7F7F5]">
      <BusinessNavigation
        slug={business.slug}
        businessName={business.name}
      />

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="max-w-3xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">
              Settings
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Manage settings and actions for this
              business.
            </p>
          </div>

          <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm sm:p-8">
            <div>
              <p className="text-sm font-medium text-red-600">
                Danger Zone
              </p>

              <h3 className="mt-2 text-lg font-semibold text-gray-900">
                Delete this business
              </h3>

              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600">
                This will permanently delete this
                business profile, its public page,
                QR code access, and all associated
                actions and links.
              </p>
            </div>

            <div className="mt-6">
              <DeleteBusinessButton
                businessId={business.id}
                businessName={business.name}
              />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}