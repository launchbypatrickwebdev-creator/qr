import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import QRCodeDisplay from "@/components/QRCode";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BusinessPage({ params }: Props) {
  const { slug } = await params;

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
    .eq("is_active", true)
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
          {business.phone && (
            <a
              href={`tel:${business.phone}`}
              className="block rounded-xl border p-4 font-medium hover:bg-gray-50"
            >
              Call
            </a>
          )}

          {business.whatsapp && (
            <a
              href={`https://wa.me/${business.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border p-4 font-medium hover:bg-gray-50"
            >
              WhatsApp
            </a>
          )}

          {links?.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border p-4 font-medium hover:bg-gray-50"
            >
              {link.title}
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}