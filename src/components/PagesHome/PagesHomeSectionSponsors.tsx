import { motion } from "framer-motion";
// @ts-ignore
import { LogoLoop } from "../react-bits/LogoLoop";

// Placeholder logos with better styling
const SPONSORS = [
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png",
    alt: "Google",
    href: "https://www.google.com",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/2560px-Microsoft_logo_%282012%29.svg.png",
    alt: "Microsoft",
    href: "https://www.microsoft.com",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png",
    alt: "Amazon",
    href: "https://www.amazon.com",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Tesla_logo.png/2560px-Tesla_logo.png",
    alt: "Tesla",
    href: "https://www.tesla.com",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/2560px-Meta_Platforms_Inc._logo.svg.png",
    alt: "Meta",
    href: "https://www.meta.com",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/2560px-IBM_logo.svg.png",
    alt: "IBM",
    href: "https://www.ibm.com",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png",
    alt: "Netflix",
    href: "https://www.netflix.com",
  },
];

export default function PagesHomeSectionSponsors() {
  return (
    <div className="relative w-full overflow-hidden border-t border-white/5 py-24">
      <div className="mx-auto mb-12 flex w-full max-w-7xl items-center gap-4 px-6">
        <div className="h-px flex-1 bg-linear-to-r from-transparent to-white/20" />
        <h2 className="font-mono text-sm font-bold tracking-[0.3em] text-white/40 uppercase">
          This Hackathon is Proudly Supported By
        </h2>
        <div className="h-px flex-1 bg-linear-to-l from-transparent to-white/20" />
      </div>

      <div className="relative flex w-full flex-col items-center justify-center opacity-70 transition-opacity hover:opacity-100">
        <div className="absolute inset-y-0 left-0 z-10 w-32 bg-linear-to-r from-black to-transparent" />
        <div className="absolute inset-y-0 right-0 z-10 w-32 bg-linear-to-l from-black to-transparent" />

        <LogoLoop
          // @ts-ignore
          logos={SPONSORS}
          speed={100}
          direction="left"
          logoHeight={60}
          gap={60}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          fadeOutColor="#000000"
          ariaLabel="Technology partners"
        />
      </div>
    </div>
  );
}
