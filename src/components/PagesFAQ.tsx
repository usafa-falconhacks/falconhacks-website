import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useIsMobile } from "@/hooks/use-mobile";
import LetterGlitch from "./LetterGlitch";

export default function PagesFAQ() {
  const isMobile = useIsMobile();

  const faqs = [
    {
      question: "Who can participate?",
      answer:
        "FalconHack is open to all USAFA cadets and visiting students from invited institutions. No prior coding experience is required!",
    },
    {
      question: "What is the team size?",
      answer:
        "Teams can range from 1 to 4 members. You can form a team beforehand or find teammates at the event.",
    },
    {
      question: "What should I bring?",
      answer:
        "Bring your laptop, charger, and any hardware you might want to hack on. We'll provide food, drinks, and swag.",
    },
    {
      question: "Is there a theme?",
      answer:
        "Yes! This year's theme is 'Cyber Warfare & Defense'. Projects should focus on innovative solutions for national security challenges.",
    },
    {
      question: "How much does it cost?",
      answer:
        "Nothing! FalconHack is completely free for all participants, thanks to our generous sponsors.",
    },
  ];

  return (
    <div className="relative min-h-screen w-full font-mono text-white selection:bg-white selection:text-black">
      <div className="relative z-10 container mx-auto flex flex-col items-center px-6 py-32 md:py-48">
        <div className="mb-16 flex flex-col items-center space-y-4 text-center">
          <div className="flex items-center justify-center border border-white/10 bg-white/5 px-5 py-2.5 backdrop-blur-sm">
            <div className="text-center text-[8px] font-black text-red-500/50 uppercase duration-500 md:text-[10px] md:tracking-[0.25em]">
              Intel Database
            </div>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white uppercase mix-blend-difference md:text-7xl">
            FAQ
          </h1>
        </div>

        <div className="w-full max-w-3xl border border-white/10 bg-black/50 p-8 backdrop-blur-md">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-white/10"
              >
                <AccordionTrigger className="py-6 text-left font-bold tracking-widest uppercase hover:text-[#C0C0C0] hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-6 font-sans text-lg leading-relaxed text-[#C0C0C0]">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
