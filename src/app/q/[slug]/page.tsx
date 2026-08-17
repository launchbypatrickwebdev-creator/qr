import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import QRCodeDisplay from "@/components/QRCode";
import ActionIcon from "@/components/ActionIcon";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BusinessPage({ params }: Props) {
  const { slug } = await params;

  const supabase = await createClient();

  const { data: business, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !business) {
    notFound();
  }

  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("business_id", business.id)
    .eq("active", true)
    .order("position", { ascending: true });

  return (
    <main className="min-h-screen bg-white px-6 py-12 text-gray-900">
      <div className="mx-auto max-w-md text-center">
        {business.logo_url && (
          <img
            src={business.logo_url}
            alt={business.name}
            className="mx-auto mb-4 h-24 w-24 rounded-full object-cover"
          />
        )}

        <h1 className="text-2xl font-bold">
          {business.name}
        </h1>

        {business.description && (
          <p className="mt-2 text-gray-600">
            {business.description}
          </p>
        )}

        <div className="my-8">
          <QRCodeDisplay path={`/q/${business.slug}`} />
        </div>

        <div className="mt-8 space-y-3">
          {links?.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 text-left font-medium shadow-sm transition hover:bg-gray-50"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                <ActionIcon type={link.type} />
              </span>

              <span className="flex-1">
                {link.title}
              </span>

              <span className="text-gray-400">
                →
              </span>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}