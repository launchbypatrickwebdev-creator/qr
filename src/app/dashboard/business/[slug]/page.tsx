import { notFound, redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import EditBusinessForm from "@/components/EditBusinessForm";
import BusinessNavigation from "@/components/BusinessNavigation";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BusinessProfilePage({
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

  const { data: business, error } = await supabase
    .from("businesses")
    .select(`
      id,
      name,
      slug,
      description,
      phone,
      whatsapp,
      email,
      location,
      logo_url,
      theme_color,
      background_color,
      button_style
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
      title,
      type,
      position,
      active
    `)
    .eq("business_id", business.id)
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
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">
              Profile
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Update the information and visual identity
              customers see when they open your profile.
            </p>
          </div>

          <EditBusinessForm
            business={business}
            links={links ?? []}
          />
        </div>
      </section>
    </main>
  );
}