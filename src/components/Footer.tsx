import React from "react";
import { cn } from "@/lib/utils";

export const Footer = () => {
  return (
    <footer className="relative z-30 border-t border-white/10 bg-black px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row md:gap-0">
        <div className="flex flex-col items-center gap-4 md:items-start">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center bg-white">
              <span className="text-[10px] font-black text-black uppercase">
                FH
              </span>
            </div>
            <span className="text-sm font-bold tracking-tighter text-white uppercase">
              Falcon Hacks
            </span>
          </div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#C0C0C0]/40 uppercase">
            © 2026 United States Air Force Academy
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          <a
            href="#about"
            className="text-[10px] font-bold tracking-[0.2em] text-[#C0C0C0]/60 uppercase transition-all hover:text-white"
          >
            About
          </a>
          <a
            href="#schedule"
            className="text-[10px] font-bold tracking-[0.2em] text-[#C0C0C0]/60 uppercase transition-all hover:text-white"
          >
            Schedule
          </a>
          <a
            href="#faq"
            className="text-[10px] font-bold tracking-[0.2em] text-[#C0C0C0]/60 uppercase transition-all hover:text-white"
          >
            FAQ
          </a>
        </div>

        <div className="flex flex-col items-center gap-2 md:items-end">
          <p className="text-[10px] font-bold tracking-[0.3em] text-white uppercase opacity-50">
            FLY FIGHT WIN
          </p>
          <p className="text-[9px] font-medium tracking-[0.2em] text-[#C0C0C0]/20 uppercase">
            Coordinate: 38.9928° N, 104.8583° W
          </p>
        </div>
      </div>
    </footer>
  );
};
