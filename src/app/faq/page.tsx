import Link from "next/link";
import {
  ArrowLeft,
  MessageCircle,
} from "lucide-react";
import FAQAccordion from "@/components/FAQAccordion";

const faqSections = [
  {
    title: "Getting Started",
    items: [
      {
        question: "What is QR?",
        answer:
          "QR lets you create a digital business profile where customers can find your business information and take actions such as calling, messaging, visiting your website, or finding your location.",
      },
      {
        question: "How do I create a business profile?",
        answer:
          "Create an account, open your dashboard, select Add Business, and enter your business information. You can then add customer actions and generate your QR code.",
      },
      {
        question: "How does my QR code work?",
        answer:
          "Your QR code opens your public business profile. Customers can scan it with their phone camera and access the information and actions you have added.",
      },
    ],
  },
  {
    title: "Business Profile",
    items: [
      {
        question: "Can I change my business information?",
        answer:
          "Yes. Open the business from your dashboard and edit the information you want to change.",
      },
      {
        question: "Can I add my logo?",
        answer:
          "Yes. Your business profile supports a business logo. You can manage it from your business settings.",
      },
      {
        question: "What actions can customers take?",
        answer:
          "Depending on what you add to your profile, customers can access actions such as calling your business, sending a WhatsApp message, visiting your website, viewing your location, and opening other links.",
      },
    ],
  },
  {
    title: "QR Code",
    items: [
      {
        question: "Can I print my QR code?",
        answer:
          "Yes. You can download your QR code and use it on printed materials such as signs, cards, packaging, or other business materials.",
      },
      {
        question: "Does my QR code change when I update my profile?",
        answer:
          "Your QR code points to your business profile. Updating the information on that profile does not require you to create a new QR code.",
      },
      {
        question: "Do customers need the QR app?",
        answer:
          "No. Customers can scan your QR code using a compatible phone camera or QR scanner and open your public business profile in their browser.",
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        question: "How do I change my password?",
        answer:
          "Open Account from your dashboard. In the Security section, enter your current password and your new password, then select Update password.",
      },
      {
        question: "How do I delete my account?",
        answer:
          "Open Account from your dashboard, scroll to the Danger zone, select Delete Account, and confirm the deletion.",
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        question: "How do I contact support?",
        answer:
          "Open the Contact support page from your Account section or the website footer. Complete the support form and submit your message.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-[#F7F7F5]">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back home
        </Link>

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
            Support
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            Frequently asked questions
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600">
            Find answers about business profiles, QR codes, accounts, and support.
          </p>
        </div>

        <div className="mt-10 space-y-10">
          {faqSections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-4 text-lg font-semibold text-gray-950">
                {section.title}
              </h2>

              <FAQAccordion
                items={section.items}
              />
            </section>
          ))}
        </div>

        <section className="mt-12 rounded-2xl border border-gray-200 bg-white p-6 sm:p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
              <MessageCircle className="h-5 w-5 text-gray-700" />
            </div>

            <div>
              <h2 className="font-semibold text-gray-950">
                Still need help?
              </h2>

              <p className="mt-1 text-sm leading-6 text-gray-600">
                Contact support and tell us what you need help with.
              </p>

              <Link
                href="/contact"
                className="mt-4 inline-flex rounded-lg bg-gray-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Contact support
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}