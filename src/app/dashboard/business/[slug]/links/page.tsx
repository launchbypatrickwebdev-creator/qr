import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LinkManager from "@/components/LinkManager";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function LinksPage({ params }: Props) {
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

  const { data: links, error } = await supabase
    .from("links")
    .select("*")
    .eq("business_id", business.id)
    .order("position", { ascending: true });

  if (error) {
    return (
      <main className="p-8">
        <h1 className="text-xl font-bold">
          Something went wrong
        </h1>

        <p className="mt-2 text-gray-600">
          {error.message}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <p className="text-sm text-gray-500">
            Link Management
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            {business.name}
          </h1>

          <p className="mt-2 text-gray-600">
            Manage the links visitors see on your QR profile.
          </p>
        </div>

        <LinkManager
          businessId={business.id}
          initialLinks={links ?? []}
        />
      </div>
    </main>
  );
}