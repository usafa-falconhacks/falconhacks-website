import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  loading: boolean;
}

const bootSequence = [
  "INITIALIZING SYSTEMS...",
  "ESTABLISHING SECURE UPLINK...",
  "LOADING TACTICAL ASSETS...",
  "DECRYPTING MISSION DATA...",
  "SYSTEM CHECK COMPLETE.",
  "WELCOME, CADET.",
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ loading }) => {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    if (textIndex < bootSequence.length - 1) {
      const timeout = setTimeout(() => {
        setTextIndex((prev) => prev + 1);
      }, 400); // Speed of text updates
      return () => clearTimeout(timeout);
    }
  }, [textIndex]);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.8, ease: "easeInOut" },
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black font-mono text-white"
        >
          {/* Background Grid */}
          <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [will-change:opacity]" />

          {/* Center Content */}
          <div className="z-10 flex flex-col items-center space-y-8">
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{ willChange: "transform, opacity" }}
                className="h-24 w-24 rounded-full border-2 border-white/20 border-t-white"
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{
                  originX: "50%",
                  originY: "50%",
                  willChange: "transform",
                }}
                className="absolute inset-0 rounded-full border border-transparent border-t-white/80"
              />
            </div>

            <div className="flex h-16 flex-col items-center justify-center space-y-2 text-center">
              <motion.p
                key={textIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ willChange: "opacity" }}
                className="text-sm font-bold tracking-[0.2em] text-[#C0C0C0]"
              >
                {bootSequence[textIndex]}
              </motion.p>

              {/* Progress Bar */}
              <div className="h-1 w-64 overflow-hidden bg-white/10">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 2.5, ease: "easeInOut" }}
                  style={{ originX: 0, willChange: "transform" }}
                  className="h-full w-full bg-white"
                />
              </div>
            </div>
          </div>

          {/* Corner Decor */}
          <div className="absolute bottom-8 left-8 text-[10px] text-white/40">
            FALCONNET // SECURE CONNECTION
          </div>
          <div className="absolute right-8 bottom-8 text-[10px] text-white/40">
            V 2.0.24
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
