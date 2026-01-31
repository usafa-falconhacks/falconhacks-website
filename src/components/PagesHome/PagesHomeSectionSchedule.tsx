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

export default function PagesHomeSectionSchedule() {
  return (
    <div className="relative w-full font-mono text-white selection:bg-white selection:text-black">
      <div className="relative z-10 container mx-auto flex flex-col items-center px-6 py-20">
        <motion.div
          variants={itemVariants}
          className="mb-16 flex flex-col items-center space-y-4 text-center"
        >
          <div className="flex items-center justify-center border border-white/20 bg-white/10 px-5 py-2.5 backdrop-blur-md">
            <div className="text-center text-[10px] font-black tracking-[0.3em] text-red-500/80 uppercase md:text-xs">
              Operation Timeline
            </div>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white uppercase mix-blend-difference md:text-7xl lg:text-8xl">
            Schedule
          </h1>
        </motion.div>

        <div className="w-full max-w-4xl space-y-16">
          {/* Day sections */}
          {[
            {
              day: "01",
              name: "Friday",
              items: [
                {
                  time: "1600",
                  event: "Check-in & Registration",
                  loc: "Polaris Hall Lobby",
                },
                {
                  time: "1700",
                  event: "Opening Ceremony",
                  loc: "Main Auditorium",
                },
                { time: "1800", event: "Hacking Begins", loc: "Hack Areas" },
                { time: "1900", event: "Dinner Served", loc: "Mess Hall" },
                { time: "2359", event: "Midnight Snack", loc: "Break Room" },
              ],
            },
            {
              day: "02",
              name: "Saturday",
              items: [
                { time: "0800", event: "Breakfast", loc: "Mess Hall" },
                { time: "1200", event: "Lunch", loc: "Mess Hall" },
                {
                  time: "1300",
                  event: "Workshop: Cyber Defense",
                  loc: "Room 101",
                },
                { time: "1800", event: "Dinner", loc: "Mess Hall" },
              ],
            },
            {
              day: "03",
              name: "Sunday",
              items: [
                { time: "0800", event: "Breakfast", loc: "Mess Hall" },
                { time: "1000", event: "Hacking Ends", loc: "All Areas" },
                {
                  time: "1100",
                  event: "Demos & Judging",
                  loc: "Main Auditorium",
                },
                {
                  time: "1300",
                  event: "Closing Ceremony & Awards",
                  loc: "Main Auditorium",
                },
              ],
            },
          ].map((section, sIdx) => (
            <div key={section.day} className="space-y-8">
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-6"
              >
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-white/30 to-transparent"></div>
                <h2 className="text-3xl font-black tracking-widest text-white uppercase">
                  Day {section.day} // {section.name}
                </h2>
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-white/30 to-transparent"></div>
              </motion.div>

              <div className="grid gap-4">
                {section.items.map((item, i) => (
                  <motion.div key={i} variants={itemVariants}>
                    <TechnicalContainer
                      side={i % 2 === 0 ? "left" : "right"}
                      className="group"
                    >
                      <div className="flex flex-col justify-between md:flex-row md:items-center">
                        <div className="flex items-center gap-8">
                          <span className="group-hover:text-primary/60 font-mono text-2xl font-black text-white/40 transition-colors">
                            {item.time}
                          </span>
                          <span className="text-xl font-bold tracking-tight text-white uppercase transition-transform group-hover:translate-x-1">
                            {item.event}
                          </span>
                        </div>
                        <span className="mt-2 bg-white/5 px-3 py-1 text-xs font-black tracking-[0.2em] text-white/50 uppercase md:mt-0">
                          {item.loc}
                        </span>
                      </div>
                    </TechnicalContainer>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
