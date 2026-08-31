import {
  notFound,
  redirect,
} from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import LinkManager from "@/components/LinkManager";
import BusinessNavigation from "@/components/BusinessNavigation";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BusinessLinksPage({
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

  const { data: business, error } =
    await supabase
      .from("businesses")
      .select(`
        id,
        name,
        slug
      `)
      .eq("slug", slug)
      .eq("owner_id", user.id)
      .single();

  if (error || !business) {
    notFound();
  }

  const { data: links } = await supabase
    .from("links")
    .select(`
      id,
      business_id,
      title,
      url,
      icon,
      type,
      value,
      position,
      active
    `)
    .eq(
      "business_id",
      business.id
    )
    .order("position", {
      ascending: true,
    });

  return (
    <main className="min-h-screen bg-[#F7F7F5]">
      <BusinessNavigation
        slug={business.slug}
        businessName={business.name}
      />

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="max-w-3xl">
          <LinkManager
            businessId={business.id}
            initialLinks={links ?? []}
          />
        </div>
      </section>
    </main>
  );
}