"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FAQItem = {
  question: string;
  answer: string;
};

type Props = {
  items: FAQItem[];
};

export default function FAQAccordion({
  items,
}: Props) {
  const [openIndex, setOpenIndex] =
    useState<number | null>(null);

  return (
    <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
      {items.map((item, index) => {
        const open = openIndex === index;

        return (
          <div key={item.question}>
            <button
              type="button"
              aria-expanded={open}
              onClick={() =>
                setOpenIndex(
                  open ? null : index
                )
              }
              className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left sm:px-6"
            >
              <span className="text-sm font-semibold text-gray-950">
                {item.question}
              </span>

              <ChevronDown
                className={`h-5 w-5 shrink-0 text-gray-500 transition-transform ${
                  open
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {open && (
              <div className="px-5 pb-5 sm:px-6">
                <p className="max-w-2xl text-sm leading-6 text-gray-600">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}