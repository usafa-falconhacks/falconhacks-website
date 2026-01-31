import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

export function CustomCursor() {
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for the cursor
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only show custom cursor on desktop
    if (isMobile) return;

    // Optimized mouse handler
    let lastHoverCheck = 0;
    const HOVER_CHECK_INTERVAL = 50; // Check hover state max every 50ms

    const moveCursor = (e: MouseEvent) => {
      // Always update position immediately for smoothness
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Throttle the expensive DOM traversal (closest)
      const now = Date.now();
      if (now - lastHoverCheck > HOVER_CHECK_INTERVAL) {
        const target = e.target as HTMLElement;
        const isInteractive =
          target.closest("button") ||
          target.closest("a") ||
          target.closest("input") ||
          target.closest(".cursor-pointer");

        setIsHovering(!!isInteractive);
        lastHoverCheck = now;
      }
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", moveCursor);
    document.body.addEventListener("mouseenter", handleMouseEnter);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    // Hide default cursor
    document.documentElement.style.cursor = "none";
    document.body.style.cursor = "none";

    // Ensure all interactive elements also don't show cursor
    const style = document.createElement("style");
    style.id = "cursor-style";
    style.innerHTML = `
      * {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
      document.body.removeEventListener("mouseleave", handleMouseLeave);

      // Restore default cursor
      document.documentElement.style.cursor = "";
      document.body.style.cursor = "";
      const styleEl = document.getElementById("cursor-style");
      if (styleEl) styleEl.remove();
    };
  }, [isMobile, mouseX, mouseY]);

  if (isMobile || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      <motion.div
        className="absolute top-0 left-0"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <div className="relative flex items-center justify-center">
          {/* Spinning Outer Ring - Flares on Hover */}
          <motion.div
            animate={{
              opacity: isHovering ? 1 : 0,
              scale: isHovering ? 1.5 : 0.8,
            }}
            className="absolute"
          >
            <motion.div
              animate={{
                rotate: isHovering ? 360 : 0, // Changed to 360 for full spin
              }}
              transition={{
                duration: 2,
                ease: "linear",
                repeat: Infinity,
              }}
              className="h-16 w-16 rounded-full border border-dashed border-red-500/30"
            />
          </motion.div>
          {/* Square Target Box - Expands and Glows on Hover */}
          <motion.div
            animate={{
              width: isHovering ? "48px" : "16px", // Increased base size from 12px to 16px
              height: isHovering ? "48px" : "16px",
              borderColor: isHovering
                ? "rgba(239, 68, 68, 1)"
                : "rgba(239, 68, 68, 0.8)",
              backgroundColor: isHovering
                ? "rgba(239, 68, 68, 0.05)"
                : "transparent",
              boxShadow: isHovering
                ? "0 0 20px rgba(239, 68, 68, 0.4), inset 0 0 10px rgba(239, 68, 68, 0.2)"
                : "none",
            }}
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            className="relative z-10 border border-red-500"
          />

          {/* Extended Crosshairs - Retract for Focus */}
          <motion.div
            animate={{
              height: isHovering ? "60px" : "32px", // Increased base size from 24px to 32px
              opacity: isHovering ? 0.8 : 0.5,
              backgroundColor: isHovering ? "#ef4444" : "#ef4444",
            }}
            className="absolute top-1/2 left-1/2 w-[1px] -translate-x-1/2 -translate-y-1/2 bg-red-500"
          />
          <motion.div
            animate={{
              width: isHovering ? "60px" : "32px", // Increased base size from 24px to 32px
              opacity: isHovering ? 0.8 : 0.5,
              backgroundColor: isHovering ? "#ef4444" : "#ef4444",
            }}
            className="absolute top-1/2 left-1/2 h-[1px] -translate-x-1/2 -translate-y-1/2 bg-red-500"
          />

          {/* Corner Accents - Snap to corners on hover */}
          <motion.div
            animate={{
              x: isHovering ? -2 : 0,
              y: isHovering ? -2 : 0,
              opacity: isHovering ? 1 : 0,
            }}
            className="absolute top-0 left-0 h-2 w-2 border-t-2 border-l-2 border-red-500"
          />
          <motion.div
            animate={{
              x: isHovering ? 2 : 0,
              y: isHovering ? -2 : 0,
              opacity: isHovering ? 1 : 0,
            }}
            className="absolute top-0 right-0 h-2 w-2 border-t-2 border-r-2 border-red-500"
          />
          <motion.div
            animate={{
              x: isHovering ? -2 : 0,
              y: isHovering ? 2 : 0,
              opacity: isHovering ? 1 : 0,
            }}
            className="absolute bottom-0 left-0 h-2 w-2 border-b-2 border-l-2 border-red-500"
          />
          <motion.div
            animate={{
              x: isHovering ? 2 : 0,
              y: isHovering ? 2 : 0,
              opacity: isHovering ? 1 : 0,
            }}
            className="absolute right-0 bottom-0 h-2 w-2 border-r-2 border-b-2 border-red-500"
          />

          {/* Center Dot */}
          <motion.div
            animate={{
              scale: isHovering ? 2 : 1, // Disappear on hover to clear view
            }}
            className="absolute top-1/2 left-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 bg-red-500"
          />

          {/* Target Acquired Text Block */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: isHovering ? 1 : 0,
              y: isHovering ? 42 : 10,
            }}
            transition={{ duration: 0.2, delay: 0.05 }}
            className="absolute z-50 flex flex-col items-center"
          >
            {/* Connecting Data Line */}
            <motion.div
              animate={{ height: isHovering ? 12 : 0 }}
              className="w-[1px] bg-red-500/50"
            />

            {/* Text Label */}
            <div className="flex items-center gap-2 border border-red-500/50 bg-black/90 px-3 py-1 shadow-[0_0_15px_rgba(239,68,68,0.3)] backdrop-blur-md">
              <div className="h-1.5 w-1.5 animate-pulse bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.8)]" />
              <span className="text-[10px] font-black tracking-[0.2em] whitespace-nowrap text-red-100 uppercase">
                Target Acquired
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
