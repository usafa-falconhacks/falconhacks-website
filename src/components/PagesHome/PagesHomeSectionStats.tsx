import { motion } from "framer-motion";
import CountUp from "../react-bits/CountUp";

const StatItem = ({
  value,
  label,
  prefix = "",
  suffix = "",
  index,
}: {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  index: number;
}) => {
  return (
    <div className="group relative flex flex-col items-center justify-center">
      <div className="flex items-baseline justify-center font-black tracking-tighter text-white">
        {prefix && (
          <span className="mr-1 bg-linear-to-b from-white to-white/50 bg-clip-text text-4xl text-transparent md:text-6xl lg:text-7xl">
            {prefix}
          </span>
        )}
        <div className="flex items-baseline">
          <span className="text-4xl font-black text-white md:text-6xl lg:text-7xl">
            {/* @ts-ignore */}
            <CountUp
              to={value}
              from={0}
              separator=","
              direction="up"
              duration={0.5}
              delay={index * 0.5}
              className="count-up-text"
            />
          </span>
        </div>
        {suffix && (
          <span className="ml-1 bg-linear-to-b from-white to-white/50 bg-clip-text text-4xl text-transparent md:text-6xl lg:text-7xl">
            {suffix}
          </span>
        )}
      </div>
      <div className="via-primary mt-4 h-px w-12 bg-linear-to-r from-transparent to-transparent opacity-50 transition-all duration-500 group-hover:w-24 group-hover:opacity-100" />
      <div className="text-primary mt-4 font-mono text-xs font-bold tracking-[0.3em] uppercase md:text-sm">
        {label}
      </div>
    </div>
  );
};

export default function PagesHomeSectionStats() {
  return (
    <div className="relative w-full overflow-hidden py-32">
      {/* Dynamic Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-primary/5 absolute top-1/2 left-1/2 h-75 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]" />
        <div className="absolute top-0 h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-0 h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-3 md:gap-8">
          <StatItem value={10000} label="Prize Pool" prefix="$" index={0} />
          <StatItem value={500} label="Hackers" suffix="+" index={1} />
          <StatItem value={25} label="Universities" suffix="+" index={2} />
        </div>
      </div>
    </div>
  );
}
