import Link from "next/link";
import CreateBusinessForm from "@/components/CreateBusinessForm";

export default function CreateBusinessPage() {
  return (
    <main className="px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-2xl">

        <div className="mb-8 mt-6">
          <p className="text-sm text-gray-500">
            New Business
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Create your business profile
          </h1>

          <p className="mt-2 text-gray-600">
            Add the basic details for your business. You can customize
            everything else later.
          </p>
        </div>

        <CreateBusinessForm />
      </div>
    </main>
  );
}