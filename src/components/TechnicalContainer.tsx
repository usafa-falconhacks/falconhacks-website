import React from "react";
import { motion } from "framer-motion";

interface TechnicalContainerProps {
  children: React.ReactNode;
  className?: string;
  side?: "left" | "right" | "both";
  label?: string;
}

export const TechnicalContainer = ({
  children,
  className = "",
  side = "both",
  label,
}: TechnicalContainerProps) => {
  const getClipPath = () => {
    if (side === "left")
      return "polygon(0 0, 100% 0, 100% 100%, 20px 100%, 0 calc(100% - 20px))";
    if (side === "right")
      return "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)";
    return "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)";
  };

  return (
    <div className={`relative ${className}`}>
      {/* HUD Label */}
      {label && (
        <div className="absolute -top-3 left-6 z-20 bg-black px-2 text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">
          {label}
        </div>
      )}

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
        whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{
          duration: 1.2,
          ease: [0.215, 0.61, 0.355, 1.0], // cubic-bezier for a smooth "settling" feel
        }}
        className="relative border border-white/5 bg-black/20 shadow-2xl ring-1 ring-white/5 backdrop-blur-xl"
        style={{ clipPath: getClipPath() }}
      >
        {/* Subtle Sheen Gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent" />

        <div className="relative z-20 p-8 md:p-10">{children}</div>

        {/* Corner Accents */}
        <div className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-white/20" />
        <div className="absolute right-0 bottom-0 h-4 w-4 border-r-2 border-b-2 border-white/20" />
      </motion.div>

      {/* External Brackets Decoration */}
      <div className="pointer-events-none absolute -inset-2 border-x border-white/5 opacity-50" />
    </div>
  );
};
