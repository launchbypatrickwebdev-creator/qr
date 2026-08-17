import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: businesses, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

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
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Dashboard
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              Your Businesses
            </h1>
          </div>
        </div>

        <div className="mt-8">
          {businesses?.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <p className="text-gray-600">
                You don't have any businesses yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {businesses?.map((business) => (
                <div
                  key={business.id}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >
                  <h2 className="text-xl font-semibold">
                    {business.name}
                  </h2>

                  {business.description && (
                    <p className="mt-2 text-gray-600">
                      {business.description}
                    </p>
                  )}

                  <p className="mt-4 text-sm text-gray-500">
                    /q/{business.slug}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <a
                      href={`/dashboard/business/${business.slug}`}
                      className="inline-block rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white"
                    >
                      Edit Profile
                    </a>

                    <a
                      href={`/dashboard/business/${business.slug}/links`}
                      className="inline-block rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900"
                    >
                      Manage Links
                    </a>

                    <a
                      href={`/dashboard/business/${business.slug}/qr`}
                      className="inline-block rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900"
                    >
                      QR Code
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}