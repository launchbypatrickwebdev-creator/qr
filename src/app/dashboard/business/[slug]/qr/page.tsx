import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DownloadQRCode from "@/components/DownloadQRCode";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function QRPage({ params }: Props) {
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
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <p className="text-sm text-gray-500">
            QR Code
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            {business.name}
          </h1>

          <p className="mt-2 text-gray-600">
            Download and use this QR code on your business cards,
            flyers, signs, packaging, and other materials.
          </p>
        </div>

        <DownloadQRCode
          slug={business.slug}
          businessName={business.name}
        />
      </div>
    </main>
  );
}