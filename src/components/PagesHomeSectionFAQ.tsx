import React from "react";
import { motion, type Variants } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useIsMobile } from "@/hooks/use-mobile";
import LetterGlitch from "./LetterGlitch";
import { TechnicalContainer } from "./TechnicalContainer";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function PagesHomeSectionFAQ() {
  const isMobile = useIsMobile();

  const faqs = [
    {
      question: "What is a hackathon?",
      answer:
        "A hackathon is an innovation sprint where you turn your crazy ideas into real projects. At FalconHacks, for 36 hours (April 24th to 26th) online, you'll be learning and building in an energetic environment with people as passionate as you are! We cover epic prizes, world-renowned guest speakers, incredible mentors, and deeply technical workshops and fun activities throughout the event. Basically, you take care of hacking and we'll take care of you!",
    },
    {
      question: "Who can participate?",
      answer:
        "FalconHacks is open to all USAFA cadets and service academy students. Be sure to submit an application. No prior coding experience is required!",
    },
    {
      question: "How much does it cost?",
      answer:
        "FalconHacks is free for all accepted hackers! It's our plreasure to bring virtual workshops and prizes to our hackers without any cost on your end.",
    },
    {
      question: "What if I don't have a team or idea?",
      answer:
        "Teams can range from 1 to 4 members. Many hackers don't have a team, and you can form them at the event! Once you're accepted, we open up a meeting room to help you find teammates. We also have team-forming and idea-brainstorming activities to help you find teammates for our tracks.",
    },
    {
      question: "Is there a theme?",
      answer:
        "Yes! This year's theme is 'Cyber Warfare & Defense'. Projects should focus on innovative solutions to the given tracks.",
    },
  ];

  return (
    <div className="relative min-h-screen w-full font-mono text-white selection:bg-white selection:text-black">
      <div className="relative z-10 container mx-auto flex flex-col items-center px-6 py-32 md:py-48">
        <motion.div
          variants={itemVariants}
          className="mb-16 flex flex-col items-center space-y-4 text-center"
        >
          <div className="flex items-center justify-center border border-white/20 bg-white/10 px-5 py-2.5 backdrop-blur-md">
            <div className="text-center text-[10px] font-black tracking-[0.3em] text-red-500/80 uppercase md:text-xs">
              Intel Database
            </div>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white uppercase mix-blend-difference md:text-7xl lg:text-8xl">
            FAQ
          </h1>
        </motion.div>

        <motion.div variants={itemVariants} className="w-full max-w-3xl">
          <TechnicalContainer label="INTEL // Q&A">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-white/20"
                >
                  <AccordionTrigger className="hover:text-primary py-6 text-left text-lg font-black tracking-widest uppercase transition-colors hover:no-underline hover:brightness-150">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 font-sans text-xl leading-relaxed font-medium text-white">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TechnicalContainer>
        </motion.div>
      </div>
    </div>
  );
}
