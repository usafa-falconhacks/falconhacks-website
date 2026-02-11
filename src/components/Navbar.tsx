import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { RegistrationModal } from "./RegistrationModal";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Stats", href: "#stats" },
    { name: "Prizes", href: "#prizes" },
    { name: "Schedule", href: "#schedule" },
    { name: "FAQ", href: "#faq" },
    // { name: "Sponsors", href: "#sponsors" },
  ];

  return (
    <>
      <nav
        className={cn(
          "pointer-events-auto fixed top-0 left-0 z-50 flex w-full items-center justify-between px-6 py-6 transition-all duration-300 md:px-12",
          scrolled
            ? "border-b border-white/10 bg-black/80 py-4 backdrop-blur-md"
            : "border-black/10 bg-transparent",
        )}
      >
        <a href="/#home" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center bg-white">
            <span className="text-xs font-black text-black uppercase">FH</span>
          </div>
          <div className="hidden text-xl font-bold tracking-tighter text-white uppercase md:block">
            FalconHacks
          </div>
        </a>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[10px] font-bold tracking-[0.2em] text-[#C0C0C0]/60 uppercase transition-all hover:tracking-[0.3em] hover:text-white"
            >
              {link.name}
            </a>
          ))}
          <RegistrationModal>
            <Button className="h-10 rounded-none bg-white px-8 font-black tracking-widest text-black uppercase transition-all duration-300 hover:scale-105 hover:bg-[#C0C0C0]">
              Join Now
            </Button>
          </RegistrationModal>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex h-10 w-10 items-center justify-center text-white md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-[60] transform bg-black/95 backdrop-blur-xl transition-transform duration-500 ease-in-out md:hidden",
          isMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-full flex-col items-center justify-center space-y-12">
          <button
            className="absolute top-6 right-6 text-white"
            onClick={() => setIsMenuOpen(false)}
          >
            <X size={32} />
          </button>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-2xl font-black tracking-[0.2em] text-white uppercase"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <RegistrationModal>
            <Button
              className="h-16 w-64 rounded-none bg-white text-xl font-black tracking-widest text-black uppercase"
              onClick={() => setIsMenuOpen(false)}
            >
              Join Now
            </Button>
          </RegistrationModal>
        </div>
      </div>
    </>
  );
};
