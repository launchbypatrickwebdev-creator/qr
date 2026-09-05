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
          "QR lets you create a digital business profile where customers can find your business information and take actions such as calling, messaging, visiting your website, viewing your social links, or finding your location.",
      },
      {
        question: "Who is QR for?",
        answer:
          "QR is designed for businesses, entrepreneurs, professionals, creators, shops, restaurants, service providers, and anyone who wants to give customers one simple place to find their business information.",
      },
      {
        question: "How do I create a business profile?",
        answer:
          "Create an account, open your dashboard, select Add Business, and enter your business information. You can then add customer actions, links, and generate your QR code.",
      },
      {
        question: "Do I need technical knowledge to use QR?",
        answer:
          "No. QR is designed to be simple to set up and manage. You can create and update your business profile from your dashboard without needing to write code.",
      },
      {
        question: "Can I use QR for more than one business?",
        answer:
          "Yes. You can create and manage business profiles from your account. Each business profile has its own public page and QR code.",
      },
    ],
  },
  {
    title: "Business Profile",
    items: [
      {
        question: "What information can I put on my business profile?",
        answer:
          "Your profile can contain information such as your business name, description, logo, phone number, WhatsApp, website, social links, location, and other customer actions you choose to add.",
      },
      {
        question: "Can I change my business information?",
        answer:
          "Yes. Open the business from your dashboard and edit the information you want to change. Your public profile will reflect the updated information.",
      },
      {
        question: "Can I add my logo?",
        answer:
          "Yes. Your business profile supports a business logo. You can manage it from your business settings.",
      },
      {
        question: "What actions can customers take?",
        answer:
          "Depending on what you add to your profile, customers can take actions such as calling your business, sending a WhatsApp message, visiting your website, viewing your location, opening your social pages, or accessing other links.",
      },
      {
        question: "Can I update my profile after printing my QR code?",
        answer:
          "Yes. Your QR code points to your online business profile. You can update the information on your profile without needing to print a new QR code.",
      },
      {
        question: "Can I share my business profile without a QR code?",
        answer:
          "Yes. Your business profile has a web address that you can share directly through messaging apps, social media, email, websites, or anywhere else you want.",
      },
    ],
  },
  {
    title: "QR Code",
    items: [
      {
        question: "How does my QR code work?",
        answer:
          "Your QR code opens your public business profile. Customers can scan it with their phone camera or a compatible QR scanner and access the information and actions you have added.",
      },
      {
        question: "Can I print my QR code?",
        answer:
          "Yes. You can download your QR code and use it on printed materials such as signs, business cards, packaging, menus, storefronts, flyers, receipts, or other business materials.",
      },
      {
        question: "Does my QR code change when I update my profile?",
        answer:
          "No. Your QR code points to your business profile rather than storing all of your business information inside the image. Updating your profile does not require you to create a new QR code.",
      },
      {
        question: "Do customers need the QR app?",
        answer:
          "No. Customers do not need an account or a special QR app. They can scan your QR code using a compatible phone camera or QR scanner and open your public business profile in their browser.",
      },
      {
        question: "Can I use my QR code on my business cards or flyers?",
        answer:
          "Yes. You can download your QR code and place it on business cards, flyers, posters, packaging, signs, menus, promotional materials, and other customer-facing materials.",
      },
      {
        question: "What happens if I change my phone number or website?",
        answer:
          "Simply update the information on your business profile. Your existing QR code can continue pointing to the same profile, so you do not need to reprint it just because your business information changed.",
      },
    ],
  },
  {
    title: "Business Analytics",
    items: [
      {
        question: "What is Business Analytics?",
        answer:
          "Business Analytics helps you understand how people interact with your QR business profile. You can see profile views, action clicks, activity over time, and which customer actions receive the most clicks.",
      },
      {
        question: "What can I see in my analytics?",
        answer:
          "Your analytics currently include total profile views, total action clicks, activity for today, this week and this month, a recent activity chart, and your most-clicked customer actions.",
      },
      {
        question: "Does a QR scan count as a profile view?",
        answer:
          "When someone scans your QR code and opens your public business profile, that visit is recorded as a profile view. QR currently uses profile views as the main measure of visits to your public business profile.",
      },
      {
        question: "Can I see which action customers clicked?",
        answer:
          "Yes. Action clicks are recorded by action name, allowing you to see which actions on your profile are receiving the most engagement.",
      },
      {
        question: "Can I see who scanned my QR code?",
        answer:
          "No. QR's current analytics are designed to show business-level activity rather than identify individual customers. We do not currently provide personal identities for people who visit or interact with your profile.",
      },
      {
        question: "Can I see customer locations or devices?",
        answer:
          "Not currently. The current analytics system focuses on profile views and action clicks. More advanced analytics may be introduced in the future.",
      },
      {
        question: "How often are analytics updated?",
        answer:
          "Analytics are recorded when customers visit your public profile or interact with tracked actions. Your dashboard uses those recorded events to show your business activity.",
      },
    ],
  },
  {
    title: "Free Access",
    items: [
      {
        question: "Is QR free to use?",
        answer:
          "QR is currently available free of charge while we grow the platform and welcome early users.",
      },
      {
        question: "Will QR always be free?",
        answer:
          "We have not finalized the long-term pricing structure yet. QR is currently free for early users, and future plans may introduce additional paid features or plans. Any major changes will be communicated clearly.",
      },
      {
        question: "Are business analytics currently free?",
        answer:
          "Yes. Business Analytics is currently available as part of the free experience while QR is in its early stage.",
      },
      {
        question: "Will analytics remain free?",
        answer:
          "The current analytics experience is free. We may introduce more advanced analytics or additional business features as the platform develops, but the future pricing structure has not been finalized.",
      },
      {
        question: "Why is QR free right now?",
        answer:
          "We are making QR available free during the early stage so businesses can try the platform, create their digital business profiles, use their QR codes, and help us improve the product through real-world use and feedback.",
      },
    ],
  },
  {
    title: "Privacy & Public Profiles",
    items: [
      {
        question: "Is my business profile public?",
        answer:
          "Yes. Your QR business profile is designed to be shared with customers, so information and actions you add to the public profile can be accessed by anyone who has the profile link or scans your QR code.",
      },
      {
        question: "Do customers need to create an account to view my profile?",
        answer:
          "No. Your public business profile can be opened directly in a web browser. Customers do not need a QR account to view it.",
      },
      {
        question: "Does QR identify my customers?",
        answer:
          "QR's business analytics are focused on aggregate activity such as profile views and action clicks. The current system does not provide you with the personal identity of individual visitors.",
      },
      {
        question: "What information should I put on my public profile?",
        answer:
          "Only add information you are comfortable making available to your customers. Your public profile is intended for business information such as contact details, business links, location, and customer actions.",
      },
    ],
  },
  {
    title: "Using QR for Your Business",
    items: [
      {
        question: "Where can I use my QR code?",
        answer:
          "You can use it anywhere customers interact with your business, including storefronts, business cards, menus, packaging, receipts, flyers, posters, vehicles, tables, product displays, and social media.",
      },
      {
        question: "Can a restaurant use QR?",
        answer:
          "Yes. A restaurant could use a QR profile for actions such as calling, WhatsApp, location, Instagram, viewing a menu, or accessing other customer links.",
      },
      {
        question: "Can service businesses use QR?",
        answer:
          "Yes. Professionals and service businesses can use their profile to give customers one place to find their contact information, website, social pages, location, and other ways to get in touch.",
      },
      {
        question: "Can I use QR for my personal brand or professional services?",
        answer:
          "Yes. QR can also be used by freelancers, consultants, creators, professionals, and personal brands who want to give people one simple destination for their important links and contact actions.",
      },
      {
        question: "What is the advantage of using a QR business profile instead of just a QR code?",
        answer:
          "A static QR code usually points to one destination. QR combines the QR code with a digital business profile where you can organize multiple customer actions and update the information without replacing the QR code.",
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
        question: "What happens if I forget my password?",
        answer:
          "Use the available account recovery option on the sign-in page to regain access to your account.",
      },
      {
        question: "Can I manage multiple business profiles from one account?",
        answer:
          "Yes. Your account can be used to manage your business profiles from the dashboard.",
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
      {
        question: "How can I report a problem?",
        answer:
          "If something is not working correctly, contact support and describe the problem, what you were trying to do, and any error message you saw.",
      },
      {
        question: "How can I suggest a feature?",
        answer:
          "You can send feedback through the Feedback page. Feature suggestions from early users help us understand what businesses need from QR as the platform develops.",
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
            Find answers about business profiles, QR codes, analytics,
            free access, accounts, and using QR for your business.
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