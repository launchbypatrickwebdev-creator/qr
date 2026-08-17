import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditBusinessForm from "@/components/EditBusinessForm";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EditBusinessPage({ params }: Props) {
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
    .select("*")
    .eq("slug", slug)
    .eq("owner_id", user.id)
    .single();

  if (error || !business) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <p className="text-sm text-gray-500">
            Business Profile
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Edit {business.name}
          </h1>
        </div>

        <EditBusinessForm business={business} />
      </div>
    </main>
  );
}