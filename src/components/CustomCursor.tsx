import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
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

  // Use refs to avoid recreating functions
  const lastHoverCheckRef = useRef(0);
  const pendingIdleCallbackRef = useRef<number | null>(null);
  const HOVER_CHECK_INTERVAL = 150;

  const moveCursor = useCallback(
    (e: MouseEvent) => {
      // Always update position immediately for smoothness
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Throttle the expensive DOM traversal
      const now = Date.now();
      if (now - lastHoverCheckRef.current > HOVER_CHECK_INTERVAL) {
        lastHoverCheckRef.current = now;

        // Cancel any pending idle callback
        if (pendingIdleCallbackRef.current !== null) {
          if (typeof window.cancelIdleCallback === "function") {
            window.cancelIdleCallback(pendingIdleCallbackRef.current);
          }
        }

        // Use requestIdleCallback if available for expensive DOM checks
        if (typeof window.requestIdleCallback === "function") {
          pendingIdleCallbackRef.current = window.requestIdleCallback(
            () => {
              const target = e.target as HTMLElement;
              if (!target) return;

              // More efficient check using matches instead of closest where possible
              const isInteractive =
                target.matches("button, a, input, .cursor-pointer") ||
                !!target.closest("button, a, input, .cursor-pointer");

              setIsHovering(isInteractive);
              pendingIdleCallbackRef.current = null;
            },
            { timeout: 100 },
          );
        } else {
          // Fallback for browsers without requestIdleCallback
          const target = e.target as HTMLElement;
          if (!target) return;

          const isInteractive =
            target.matches("button, a, input, .cursor-pointer") ||
            !!target.closest("button, a, input, .cursor-pointer");

          setIsHovering(isInteractive);
        }
      }
    },
    [mouseX, mouseY, isVisible],
  );

  const handleMouseEnter = useCallback(() => setIsVisible(true), []);
  const handleMouseLeave = useCallback(() => setIsVisible(false), []);

  useEffect(() => {
    // Only show custom cursor on desktop and if hardware concurrency is sufficient
    const hasSufficientPerformance =
      typeof navigator !== "undefined"
        ? (navigator.hardwareConcurrency || 4) > 2
        : true;
    if (isMobile || !hasSufficientPerformance) return;

    window.addEventListener("mousemove", moveCursor, { passive: true });
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

      // Cancel any pending idle callback
      if (
        pendingIdleCallbackRef.current !== null &&
        typeof window.cancelIdleCallback === "function"
      ) {
        window.cancelIdleCallback(pendingIdleCallbackRef.current);
      }

      // Restore default cursor
      document.documentElement.style.cursor = "";
      document.body.style.cursor = "";
      const styleEl = document.getElementById("cursor-style");
      if (styleEl) styleEl.remove();
    };
  }, [isMobile, moveCursor, handleMouseEnter, handleMouseLeave]);

  if (isMobile || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-9999 overflow-hidden">
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
            transition={{ duration: 0.3 }}
            className="absolute"
          >
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 2,
                ease: "linear",
                repeat: Infinity,
              }}
              className="h-16 w-16 rounded-full border border-dashed border-red-500/30"
              style={{ willChange: "transform" }}
            />
          </motion.div>

          {/* Square Target Box - Expands and Glows on Hover */}
          <motion.div
            animate={{
              width: isHovering ? "48px" : "16px",
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
            style={{ willChange: "width, height" }}
          />

          {/* Extended Crosshairs - Retract for Focus */}
          <motion.div
            animate={{
              height: isHovering ? "60px" : "32px",
              opacity: isHovering ? 0.8 : 0.5,
            }}
            transition={{ duration: 0.3 }}
            className="absolute top-1/2 left-1/2 w-px -translate-x-1/2 -translate-y-1/2 bg-red-500"
            style={{ willChange: "height" }}
          />
          <motion.div
            animate={{
              width: isHovering ? "60px" : "32px",
              opacity: isHovering ? 0.8 : 0.5,
            }}
            transition={{ duration: 0.3 }}
            className="absolute top-1/2 left-1/2 h-px -translate-x-1/2 -translate-y-1/2 bg-red-500"
            style={{ willChange: "width" }}
          />

          {/* Corner Accents - Snap to corners on hover */}
          {[
            {
              pos: "top-0 left-0",
              borders: "border-t-2 border-l-2",
              x: -2,
              y: -2,
            },
            {
              pos: "top-0 right-0",
              borders: "border-t-2 border-r-2",
              x: 2,
              y: -2,
            },
            {
              pos: "bottom-0 left-0",
              borders: "border-b-2 border-l-2",
              x: -2,
              y: 2,
            },
            {
              pos: "right-0 bottom-0",
              borders: "border-r-2 border-b-2",
              x: 2,
              y: 2,
            },
          ].map((corner, i) => (
            <motion.div
              key={i}
              animate={{
                x: isHovering ? corner.x : 0,
                y: isHovering ? corner.y : 0,
                opacity: isHovering ? 1 : 0,
              }}
              transition={{ duration: 0.2 }}
              className={`absolute h-2 w-2 ${corner.pos} ${corner.borders} border-red-500`}
              style={{ willChange: "transform, opacity" }}
            />
          ))}

          {/* Center Dot */}
          <motion.div
            animate={{
              scale: isHovering ? 2 : 1,
            }}
            transition={{ duration: 0.2 }}
            className="absolute top-1/2 left-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 bg-red-500"
            style={{ willChange: "transform" }}
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
            style={{ willChange: "transform, opacity" }}
          >
            {/* Connecting Data Line */}
            <motion.div
              animate={{ height: isHovering ? 12 : 0 }}
              transition={{ duration: 0.2 }}
              className="w-px bg-red-500/50"
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
