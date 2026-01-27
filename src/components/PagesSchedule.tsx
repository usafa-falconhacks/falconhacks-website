import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import LetterGlitch from "./LetterGlitch";

export default function PagesSchedule() {
  return (
    <div className="relative min-h-screen w-full font-mono text-white selection:bg-white selection:text-black">
      <div className="relative z-10 container mx-auto flex flex-col items-center px-6 py-32 md:py-48">
        <div className="mb-16 flex flex-col items-center space-y-4 text-center">
          <div className="flex items-center justify-center border border-white/10 bg-white/5 px-5 py-2.5 backdrop-blur-sm">
            <div className="text-center text-[8px] font-black text-red-500/50 uppercase duration-500 md:text-[10px] md:tracking-[0.25em]">
              Operation Timeline
            </div>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white uppercase mix-blend-difference md:text-7xl">
            Schedule
          </h1>
        </div>

        <div className="w-full max-w-4xl space-y-12">
          {/* Friday */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-white/20"></div>
              <h2 className="text-2xl font-black tracking-widest text-white uppercase">
                Day 01 // Friday
              </h2>
              <div className="h-px flex-1 bg-white/20"></div>
            </div>

            <div className="grid gap-4">
              {[
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
              ].map((item, i) => (
                <div
                  key={i}
                  className="group flex flex-col justify-between border border-white/10 bg-black/50 p-6 backdrop-blur-md transition-colors hover:bg-white/5 md:flex-row md:items-center"
                >
                  <div className="flex items-center gap-6">
                    <span className="font-mono text-xl font-bold text-white/50">
                      {item.time}
                    </span>
                    <span className="text-lg font-bold tracking-wide uppercase">
                      {item.event}
                    </span>
                  </div>
                  <span className="mt-2 text-xs font-bold tracking-widest text-[#C0C0C0]/60 uppercase md:mt-0">
                    {item.loc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Saturday */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-white/20"></div>
              <h2 className="text-2xl font-black tracking-widest text-white uppercase">
                Day 02 // Saturday
              </h2>
              <div className="h-px flex-1 bg-white/20"></div>
            </div>

            <div className="grid gap-4">
              {[
                { time: "0800", event: "Breakfast", loc: "Mess Hall" },
                { time: "1200", event: "Lunch", loc: "Mess Hall" },
                {
                  time: "1300",
                  event: "Workshop: Cyber Defense",
                  loc: "Room 101",
                },
                { time: "1800", event: "Dinner", loc: "Mess Hall" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group flex flex-col justify-between border border-white/10 bg-black/50 p-6 backdrop-blur-md transition-colors hover:bg-white/5 md:flex-row md:items-center"
                >
                  <div className="flex items-center gap-6">
                    <span className="font-mono text-xl font-bold text-white/50">
                      {item.time}
                    </span>
                    <span className="text-lg font-bold tracking-wide uppercase">
                      {item.event}
                    </span>
                  </div>
                  <span className="mt-2 text-xs font-bold tracking-widest text-[#C0C0C0]/60 uppercase md:mt-0">
                    {item.loc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sunday */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-white/20"></div>
              <h2 className="text-2xl font-black tracking-widest text-white uppercase">
                Day 03 // Sunday
              </h2>
              <div className="h-px flex-1 bg-white/20"></div>
            </div>

            <div className="grid gap-4">
              {[
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
              ].map((item, i) => (
                <div
                  key={i}
                  className="group flex flex-col justify-between border border-white/10 bg-black/50 p-6 backdrop-blur-md transition-colors hover:bg-white/5 md:flex-row md:items-center"
                >
                  <div className="flex items-center gap-6">
                    <span className="font-mono text-xl font-bold text-white/50">
                      {item.time}
                    </span>
                    <span className="text-lg font-bold tracking-wide uppercase">
                      {item.event}
                    </span>
                  </div>
                  <span className="mt-2 text-xs font-bold tracking-widest text-[#C0C0C0]/60 uppercase md:mt-0">
                    {item.loc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
