import {
  notFound,
  redirect,
} from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import DownloadQRCode from "@/components/DownloadQRCode";
import BusinessNavigation from "@/components/BusinessNavigation";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function QRPage({
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

  const { data: business } =
    await supabase
      .from("businesses")
      .select(
        "id, name, slug"
      )
      .eq("slug", slug)
      .eq(
        "owner_id",
        user.id
      )
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

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
            QR Code
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            Share {business.name}
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-600">
            Customers can scan this code to open
            your digital business profile.
          </p>
        </div>

        <div className="mt-10">
          <DownloadQRCode
            slug={business.slug}
            businessName={business.name}
          />
        </div>
      </section>
    </main>
  );
}