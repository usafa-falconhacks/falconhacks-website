import React from "react";
import { motion, type Variants } from "framer-motion";
import { TechnicalContainer } from "../TechnicalContainer";

const itemVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 1.5, ease: [0.215, 0.61, 0.355, 1.0] },
  },
};

export default function PagesHomeSectionAbout() {
  return (
    <div className="relative w-full font-mono text-white selection:bg-white selection:text-black">
      <div className="relative z-10 container mx-auto flex flex-col items-center px-6 py-20">
        <motion.div
          variants={itemVariants}
          className="mb-16 flex flex-col items-center space-y-4 text-center"
        >
          <div className="flex items-center justify-center border border-white/20 bg-white/10 px-5 py-2.5 backdrop-blur-md">
            <div className="text-center text-[10px] font-black tracking-[0.3em] text-red-500/80 uppercase md:text-xs">
              Mission Briefing
            </div>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white uppercase mix-blend-difference md:text-7xl lg:text-8xl">
            About
          </h1>
        </motion.div>

        <div className="grid w-full max-w-6xl grid-cols-1 gap-12 md:grid-cols-2">
          <motion.div variants={itemVariants}>
            <TechnicalContainer label="DEBRIEF // 01">
              <div className="space-y-6">
                <h2 className="border-b border-white/20 pb-4 text-2xl font-black tracking-widest text-white uppercase">
                  The Initiative
                </h2>
                <p className="text-lg leading-relaxed font-medium text-white">
                  The United States Air Force Academy’s premier hackathon where
                  students and cadets from around the nation come together to
                  design and build innovative technological solutions from
                  scratch.
                </p>
                <p className="text-lg leading-relaxed text-[#D0D0D0]">
                  Our mission is to foster a culture of rapid innovation and
                  technical excellence within the cadet wing and beyond.
                  Participants will have access to cutting-edge resources,
                  mentorship from industry experts, and the opportunity to
                  present their solutions to senior leaders.
                </p>
              </div>
            </TechnicalContainer>
          </motion.div>

          <div className="space-y-8">
            <motion.div variants={itemVariants}>
              <TechnicalContainer label="LOCATION // AO" side="right">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold tracking-widest text-white uppercase">
                    Venue
                  </h3>
                  <p className="text-lg font-bold text-white">
                    United States Air Force Academy
                  </p>
                  <p className="text-[#D0D0D0]">
                    Polaris Hall - Center for Character and Leadership
                    Development
                  </p>
                </div>
              </TechnicalContainer>
            </motion.div>

            <motion.div variants={itemVariants}>
              <TechnicalContainer label="TRACKS // LOG" side="left">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold tracking-widest text-white uppercase">
                    Tracks
                  </h3>
                  <ul className="grid grid-cols-1 gap-x-8 gap-y-3 font-medium text-white sm:grid-cols-2">
                    {[
                      { name: "Artificial Intelligence", color: "bg-red-500" },
                      { name: "Space & Cyber Domain", color: "bg-white" },
                      { name: "Information Security", color: "bg-red-700" },
                      { name: "Autonomous Systems", color: "bg-orange-600" },
                      { name: "Education & Training", color: "bg-red-400" },
                      { name: "Health & Wellness", color: "bg-amber-500" },
                    ].map((track) => (
                      <li
                        key={track.name}
                        className="flex items-center gap-3 transition-transform hover:translate-x-1"
                      >
                        <span
                          className={`h-2 w-2 ${track.color} shadow-[0_0_8px_currentColor]`}
                        ></span>
                        <span className="tracking-tight">{track.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TechnicalContainer>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
