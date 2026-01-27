import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import LetterGlitch from "./LetterGlitch";

export default function PagesAbout() {
  return (
    <div className="relative min-h-screen w-full font-mono text-white selection:bg-white selection:text-black">
      <div className="relative z-10 container mx-auto flex flex-col items-center px-6 py-32 md:py-48">
        <div className="mb-16 flex flex-col items-center space-y-4 text-center">
          <div className="flex items-center justify-center border border-white/10 bg-white/5 px-5 py-2.5 backdrop-blur-sm">
            <div className="text-center text-[8px] font-black text-red-500/50 uppercase duration-500 md:text-[10px] md:tracking-[0.25em]">
              Mission Briefing
            </div>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white uppercase mix-blend-difference md:text-7xl">
            About
          </h1>
        </div>

        <div className="grid w-full max-w-6xl grid-cols-1 gap-12 md:grid-cols-2">
          <div className="space-y-6 border border-white/10 bg-black/50 p-8 backdrop-blur-md md:p-12">
            <h2 className="border-b border-white/10 pb-4 text-2xl font-black tracking-widest text-white uppercase">
              The Initiative
            </h2>
            <p className="text-lg leading-relaxed text-[#C0C0C0]">
              FalconHack is the premier hackathon at the United States Air Force
              Academy. We bring together the brightest minds to solve critical
              challenges in national security, cyber defense, and aerospace
              innovation.
            </p>
            <p className="text-lg leading-relaxed text-[#C0C0C0]">
              Our mission is to foster a culture of rapid innovation and
              technical excellence within the cadet wing and beyond.
              Participants will have access to cutting-edge resources,
              mentorship from industry experts, and the opportunity to present
              their solutions to senior leaders.
            </p>
          </div>

          <div className="space-y-8">
            <div className="space-y-4 border border-white/10 bg-black/50 p-8 backdrop-blur-md">
              <h3 className="text-xl font-bold tracking-widest text-white uppercase">
                Venue
              </h3>
              <p className="text-[#C0C0C0]">
                United States Air Force Academy
                <br />
                Polaris Hall - Center for Character and Leadership Development
              </p>
            </div>

            <div className="space-y-4 border border-white/10 bg-black/50 p-8 backdrop-blur-md">
              <h3 className="text-xl font-bold tracking-widest text-white uppercase">
                Tracks
              </h3>
              <ul className="space-y-2 text-[#C0C0C0]">
                <li className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 bg-red-500/50"></span>
                  Cyber Warfare
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 bg-white/50"></span>
                  AI & Machine Learning
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 bg-blue-500/50"></span>
                  Space Systems
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 bg-green-500/50"></span>
                  Simulation & Training
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
