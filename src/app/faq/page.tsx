import Link from "next/link";
import {
  ArrowLeft,
  MessageCircle,
} from "lucide-react";

import FAQAccordion from "@/components/FAQAccordion";

const faqSections = [
  {
    title: "Understanding QR",
    items: [
      {
        question: "What is QR?",
        answer:
          "QR is a digital identity and access platform designed to help people and organizations represent who they are, what they do, and how others can connect with them. Today, QR lets businesses create digital business profiles that can be shared through a link or QR code.",
      },
      {
        question: "Is QR only for QR codes?",
        answer:
          "No. The QR code is one way people can access a profile. The profile is the important part. QR is being built around digital identities that can be represented and shared in different ways.",
      },
      {
        question: "Who is QR for?",
        answer:
          "QR is being built for individuals, businesses, professionals, entrepreneurs, creators, service providers, companies, and other organizations. The current product is focused on digital business profiles, while the platform is being developed toward broader identity use cases.",
      },
      {
        question: "What can I create on QR today?",
        answer:
          "Today, you can create a digital business profile, add your business information and customer actions, share your profile through a link, generate a QR code, and view business analytics.",
      },
      {
        question: "Can individuals create professional profiles on QR?",
        answer:
          "Professional identity profiles are part of the direction QR is being built toward, but the current product is focused on business profiles. The goal is to allow people to represent professional information such as experience, skills, portfolio, credentials, and contact information in a structured digital identity.",
      },
      {
        question: "What is QR building toward?",
        answer:
          "QR is being built toward a platform where people and organizations can maintain digital identities and use different representations of those identities depending on the situation. For example, a person could have a professional profile, CV, portfolio, or shareable profile, while an organization could have its company profile, team, services, projects, and other organizational information.",
      },
    ],
  },
  {
    title: "Business Profiles",
    items: [
      {
        question: "How do I create a business profile?",
        answer:
          "Create an account, open your dashboard, select Add Business, and enter your business information. You can then add customer actions, links, and generate your QR code.",
      },
      {
        question: "What information can I put on my business profile?",
        answer:
          "Your current profile can contain information such as your business name, description, logo, phone number, WhatsApp, email, website, location, social links, and other customer actions you choose to add.",
      },
      {
        question: "Can I change my business information?",
        answer:
          "Yes. Open the business from your dashboard and edit the information you want to change. Your public profile will reflect the updated information.",
      },
      {
        question: "Can I add my logo?",
        answer:
          "Yes. Your business profile supports a business logo, which you can manage from your business settings.",
      },
      {
        question: "What actions can customers take?",
        answer:
          "Depending on what you add to your profile, customers can call your business, send a WhatsApp message, visit your website, view your location, open social links, or access other links you provide.",
      },
      {
        question: "Can I manage more than one business?",
        answer:
          "Yes. Your account can be used to create and manage multiple business profiles. Each business profile has its own public page and QR code.",
      },
    ],
  },
  {
    title: "Sharing & QR Codes",
    items: [
      {
        question: "How does my QR code work?",
        answer:
          "Your QR code opens your public business profile. Customers can scan it with a compatible phone camera or QR scanner and access the information and actions you have added.",
      },
      {
        question: "Does my QR code change when I update my profile?",
        answer:
          "No. Your QR code points to your online business profile rather than storing all of your business information inside the image. You can update the profile without needing to create a new QR code.",
      },
      {
        question: "Do customers need the QR app?",
        answer:
          "No. Customers do not need an account or a special QR app. They can scan your QR code using a compatible phone camera or QR scanner and open your public profile in their browser.",
      },
      {
        question: "Can I share my profile without a QR code?",
        answer:
          "Yes. Your profile has a web address that you can share directly through messaging apps, social media, email, websites, or anywhere else you want.",
      },
      {
        question: "Where can I use my QR code?",
        answer:
          "You can use it wherever people interact with your business, including business cards, storefronts, menus, packaging, receipts, flyers, posters, vehicles, tables, product displays, social media, and other promotional materials.",
      },
      {
        question: "What happens if I change my phone number or website?",
        answer:
          "Simply update the information on your business profile. Your existing QR code can continue pointing to the same profile, so you do not need to replace it just because your business information changed.",
      },
    ],
  },
  {
    title: "Business Analytics",
    items: [
      {
        question: "What is Business Analytics?",
        answer:
          "Business Analytics helps you understand how people interact with your public business profile. You can see profile views, action clicks, activity over time, and which customer actions receive the most clicks.",
      },
      {
        question: "What can I see in my analytics?",
        answer:
          "Your current analytics include total profile views, total action clicks, activity for today, this week and this month, a recent activity chart, and your most clicked customer actions.",
      },
      {
        question: "Does a QR scan count as a profile view?",
        answer:
          "When someone scans your QR code and opens your public business profile, that visit is recorded as a profile view. QR currently uses profile views as the main measure of visits to your public business profile.",
      },
      {
        question: "Can I see which action customers clicked?",
        answer:
          "Yes. Action clicks are recorded by action name, allowing you to see which actions on your profile receive the most engagement.",
      },
      {
        question: "Can I see who scanned my QR code?",
        answer:
          "No. QR's current analytics are designed to show business-level activity rather than identify individual customers. The current system does not provide you with the personal identity of people who visit or interact with your profile.",
      },
      {
        question: "Can I see customer locations or devices?",
        answer:
          "Not currently. The current analytics system focuses on profile views and action clicks.",
      },
      {
        question: "How often are analytics updated?",
        answer:
          "Analytics are recorded when people visit your public profile or interact with tracked actions. Your dashboard uses those recorded events to show your business activity.",
      },
    ],
  },
  {
    title: "Free Early Access",
    items: [
      {
        question: "Is QR free to use?",
        answer:
          "Yes. QR is currently available free for early users.",
      },
      {
        question: "Why is QR free right now?",
        answer:
          "We are making QR available free during the early stage so businesses can try the platform, create their digital business profiles, use their QR codes, and help us improve the product through real-world use and feedback.",
      },
      {
        question: "What does free early access include?",
        answer:
          "Early users can currently create and manage business profiles, add links and customer actions, generate and download QR codes, share their public profiles, and use the available business analytics.",
      },
      {
        question: "Why are you inviting people to use QR this early?",
        answer:
          "QR is being developed through real-world use. Early users help us discover what works, where people struggle, what information they need, and which problems the platform should solve next.",
      },
    ],
  },
  {
    title: "Identity & Privacy",
    items: [
      {
        question: "Is my business profile public?",
        answer:
          "Yes. Your public business profile is designed to be shared with customers. Information and actions you add to the public profile can be accessed by anyone who has the profile link or scans your QR code.",
      },
      {
        question: "Do customers need an account to view my profile?",
        answer:
          "No. Your public business profile can be opened directly in a web browser. Customers do not need a QR account to view it.",
      },
      {
        question: "Does QR identify my customers?",
        answer:
          "QR's current business analytics focus on aggregate activity such as profile views and action clicks. The current system does not provide you with the personal identity of individual visitors.",
      },
      {
        question: "What information should I put on my public profile?",
        answer:
          "Only add information you are comfortable making available publicly. Your current public profile is intended for business information such as contact details, business links, location, and customer actions.",
      },
      {
        question: "Will every part of a future QR identity have to be public?",
        answer:
          "No. The broader identity system is being designed around controlled sharing. Different information or representations can be shared depending on the situation, rather than requiring a person or organization to expose everything they have.",
      },
    ],
  },
  {
    title: "People, Work & Organizations",
    items: [
      {
        question: "Could QR be used as a professional profile?",
        answer:
          "Yes. That is part of the broader direction of QR. A professional identity could bring together experience, education, skills, projects, credentials, portfolio information, and contact methods in one structured identity.",
      },
      {
        question: "Could a CV become part of my QR identity?",
        answer:
          "Yes. The long-term concept is that a CV would be one representation of a person's professional identity rather than the identity itself. The same underlying information could support a professional profile, CV, resume, portfolio, or application-specific representation.",
      },
      {
        question: "Could a company have an identity on QR too?",
        answer:
          "Yes. The organizational side of QR is intended to represent more than a simple business contact page. An organization can eventually have its identity, services, projects, capabilities, team, credentials, opportunities, and other relevant information connected together.",
      },
      {
        question: "Could companies use QR for careers and recruitment?",
        answer:
          "That is part of the direction QR is being designed toward. The idea is for organizations to maintain their own organizational identity and eventually use it as a place where people can understand the organization, discover opportunities, and interact with it. Those capabilities are not part of the current business-profile MVP yet.",
      },
      {
        question: "Would QR replace job platforms?",
        answer:
          "The goal is not to assume that every external platform needs to disappear. QR can provide an organization's own identity and interaction layer, while external platforms can still serve as places where opportunities are discovered and distributed.",
      },
    ],
  },
  {
    title: "Using QR for Your Business",
    items: [
      {
        question: "Can a restaurant use QR?",
        answer:
          "Yes. A restaurant can use its profile for actions such as calling, WhatsApp, location, Instagram, viewing a menu, or accessing other customer links.",
      },
      {
        question: "Can service businesses use QR?",
        answer:
          "Yes. Professionals and service businesses can use their profile to give customers one place to find their contact information, website, social pages, location, and other ways to get in touch.",
      },
      {
        question: "Can I use QR for my personal brand or professional services?",
        answer:
          "The broader platform is being designed to support professionals, freelancers, consultants, creators, and personal brands. The current account experience, however, is focused on creating business profiles.",
      },
      {
        question: "What is the advantage of a QR profile instead of just a QR code?",
        answer:
          "A QR code is simply an access mechanism. QR connects that access mechanism to a digital profile where the important information and actions can be organized and updated. This gives people one destination rather than requiring a separate QR code for every piece of information.",
      },
      {
        question: "Can I update my profile after printing my QR code?",
        answer:
          "Yes. Your QR code points to your online profile, so you can update the information behind it without needing to print a new QR code.",
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
    title: "Support & Feedback",
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
          "You can send feedback through the Feedback page. Suggestions from early users help us understand what people and organizations need from QR.",
      },
      {
        question: "Why does QR ask early users for feedback?",
        answer:
          "Because the platform is being developed through real-world use. Feedback helps us identify genuine problems and improve QR around the needs of the people actually using it.",
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

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
            Learn how QR works today, what you can do with a digital business
            profile, how QR handles sharing and analytics, and the broader
            identity direction the platform is being built toward.
          </p>
        </div>

        <div className="mt-10 space-y-10">
          {faqSections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-4 text-lg font-semibold text-gray-950">
                {section.title}
              </h2>

              <FAQAccordion items={section.items} />
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