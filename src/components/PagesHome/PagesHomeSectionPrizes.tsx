import React from "react";
import { motion, type Variants } from "framer-motion";
import { TechnicalContainer } from "../TechnicalContainer";
import { Trophy, Target, Zap, Shield, Cpu, Rocket } from "lucide-react";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: [0.215, 0.61, 0.355, 1.0] },
  },
};

const PrizeCard = ({
  rank,
  amount,
  title,
  icon: Icon,
  colorClass,
  ringClass,
  textClass,
  delay,
}: {
  rank: string;
  amount: string;
  title: string;
  icon: any;
  colorClass: string;
  ringClass: string;
  textClass: string;
  delay: number;
}) => (
  <motion.div variants={itemVariants} className="group relative flex-1">
    <TechnicalContainer
      label={`RANK // ${rank}`}
      side="both"
      className="h-full transition-transform duration-500 hover:-translate-y-2"
    >
      <div className="flex flex-col items-center text-center">
        <div
          className={`mb-6 rounded-full bg-white/5 p-4 ring-1 ring-white/10 transition-all duration-500 ${colorClass} ${ringClass}`}
        >
          <Icon
            className={`h-8 w-8 text-white transition-colors duration-500 ${textClass}`}
          />
        </div>

        <h3 className="mb-2 text-3xl font-black tracking-tighter text-white uppercase">
          {amount}
        </h3>
        <p className="mb-4 text-xs font-bold tracking-[0.2em] text-white/60 uppercase">
          {title}
        </p>

        <div className="group-hover:bg-primary h-px w-12 bg-white/20 transition-all duration-500 group-hover:w-24" />
      </div>
    </TechnicalContainer>
  </motion.div>
);

export default function PagesHomeSectionPrizes() {
  return (
    <div className="relative w-full font-mono text-white selection:bg-white selection:text-black">
      <div className="relative z-10 container mx-auto flex flex-col items-center px-6 py-24">
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="mb-20 flex flex-col items-center space-y-4 text-center"
        >
          <div className="flex items-center justify-center border border-white/20 bg-white/10 px-5 py-2.5 backdrop-blur-md">
            <div className="text-center text-[10px] font-black tracking-[0.3em] text-red-500/80 uppercase md:text-xs">
              Mission Bounties
            </div>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white uppercase mix-blend-difference md:text-7xl lg:text-8xl">
            Prizes
          </h1>
        </motion.div>

        {/* Main Prizes */}
        <div className="mb-16 grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          <PrizeCard
            rank="02"
            amount="$2,000"
            title="2nd Place"
            icon={Target}
            colorClass="group-hover:bg-white/20"
            ringClass="group-hover:ring-white/50"
            textClass="group-hover:text-white"
            delay={0.2}
          />
          <div className="md:-mt-12">
            {" "}
            {/* Elevate 1st place */}
            <PrizeCard
              rank="01"
              amount="$5,000"
              title="Grand Champion"
              icon={Trophy}
              colorClass="group-hover:bg-amber-500/20"
              ringClass="group-hover:ring-amber-500/50"
              textClass="group-hover:text-amber-400"
              delay={0}
            />
          </div>
          <PrizeCard
            rank="03"
            amount="$1,000"
            title="3rd Place"
            icon={Shield}
            colorClass="group-hover:bg-orange-500/20"
            ringClass="group-hover:ring-orange-500/50"
            textClass="group-hover:text-orange-400"
            delay={0.4}
          />
        </div>

        {/* Track Specific Prizes */}
        <div className="w-full max-w-6xl">
          <TechnicalContainer label="SPECIAL // OPS" className="w-full">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                { title: "Best Cyber Defense", amount: "$500", icon: Shield },
                { title: "Best AI Solution", amount: "$500", icon: Cpu },
                { title: "Best Aerospace", amount: "$500", icon: Rocket },
                { title: "Most Innovative", amount: "$500", icon: Zap },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group hover:border-primary flex flex-col items-start border-l-2 border-white/10 pl-6 transition-colors"
                >
                  <h4 className="text-lg font-bold tracking-tight text-white uppercase">
                    {item.amount}
                  </h4>
                  <p className="text-xs font-medium tracking-widest text-white/50 uppercase group-hover:text-white">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </TechnicalContainer>
        </div>
      </div>
    </div>
  );
}
