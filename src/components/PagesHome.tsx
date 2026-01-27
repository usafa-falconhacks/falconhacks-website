import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  Environment,
  Float,
  PerspectiveCamera,
  Points,
  PointMaterial,
  useProgress,
} from "@react-three/drei";

import {
  EffectComposer,
  ASCII,
  Bloom,
  ChromaticAberration,
} from "@react-three/postprocessing";
import * as THREE from "three";
import LetterGlitch from "./LetterGlitch";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, Loader2, ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Navbar } from "./Navbar";
import { RegistrationModal } from "./RegistrationModal";
import { LoadingScreen } from "./LoadingScreen";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const group = useRef<any>(null);
  const isMobile = useIsMobile();

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y += isMobile ? 0.004 : 0.002;
      group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      group.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <primitive
        ref={group}
        object={scene}
        scale={5.5}
        position={[0, 0, 0]}
        rotation={[0.2, -Math.PI / 4, 0]}
      />
    </Float>
  );
}

import PagesAbout from "./PagesAbout";
import PagesSchedule from "./PagesSchedule";
import PagesFAQ from "./PagesFAQ";
import { Footer } from "./Footer";

export default function PagesHome() {
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const { progress } = useProgress();

  useEffect(() => {
    if (progress === 100) {
      // Add a small delay for smoother transition
      const timer = setTimeout(() => setLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  return (
    <div className="relative w-full overflow-hidden bg-black font-mono text-white selection:bg-white selection:text-black">
      <LoadingScreen loading={loading} />

      {/* Background Layer: Letter Glitch */}
      <div className="fixed inset-0 z-0 opacity-[0.15]">
        <LetterGlitch
          glitchColors={["#4B9CD3", "#C0C0C0", "#111111"]}
          glitchSpeed={100}
          centerVignette={false}
          outerVignette={true}
          smooth={true}
        />
      </div>

      {/* Full Screen 3D Canvas Layer */}
      <div className="pointer-events-none fixed inset-0 z-20">
        <Canvas
          gl={{ antialias: false, alpha: true, stencil: false, depth: true }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={40} />
          <ambientLight intensity={10} />
          <pointLight position={[-10, -10, -10]} intensity={100} />
          <pointLight position={[10, 10, 10]} intensity={100} />

          <Suspense fallback={null}>
            <group
              position={[0, -1, 0]}
              scale={isMobile ? 0.045 : 0.12}
              rotation={[0, -Math.PI / 9, 0]}
            >
              <Model url="/assets/models/low_poly_11_usaf_f22a_raptor.glb" />
            </group>
            <Environment preset="city" />
          </Suspense>

          <EffectComposer>
            <ASCII
              characters=" .:-+*=%@#"
              fontSize={isMobile ? 750 : 1000}
              color="#4e4f4e"
            />
            <Bloom
              intensity={0.5}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
            />
            <ChromaticAberration offset={new THREE.Vector2(0.005, 0.005)} />
          </EffectComposer>
        </Canvas>
      </div>

      <Navbar />

      {/* Hero Section */}
      <section
        id="home"
        className="relative z-30 flex h-screen w-full flex-col items-center justify-center px-6"
      >
        <div className="pointer-events-none flex flex-col items-center space-y-8 text-center md:space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <h1 className="text-4xl leading-none font-black tracking-tighter text-white uppercase mix-blend-difference md:text-8xl lg:text-9xl">
              falcon hacks
            </h1>
          </div>

          <div className="pointer-events-auto flex flex-col items-center gap-6 md:gap-8">
            <RegistrationModal>
              <Button
                size="lg"
                className="group h-12 rounded-none border-none px-8 text-lg font-black uppercase transition-all duration-300 hover:scale-105 hover:bg-[#C0C0C0] md:h-14 md:px-10 md:text-xl"
              >
                Join Now
              </Button>
            </RegistrationModal>
            <p className="animate-pulse text-[8px] font-bold tracking-[0.2em] text-[#C0C0C0]/40 uppercase md:text-[10px] md:tracking-[0.3em]">
              [ SYSTEM STATUS: ACTIVE // DEPLOYMENT: USAFA ]
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="pointer-events-none absolute bottom-8 left-8 z-40 hidden sm:block">
          <p className="text-[10px] font-bold tracking-[0.3em] text-white uppercase opacity-50">
            COORDINATE: 38.9928° N, 104.8583° W
          </p>
        </div>

        <div className="pointer-events-none absolute right-8 bottom-8 z-40 hidden sm:block">
          <p className="text-[10px] font-bold tracking-[0.3em] text-white uppercase opacity-50">
            FLY FIGHT WIN
          </p>
        </div>

        {/* Scroll Indicator */}
        <div
          className="absolute bottom-6 left-1/2 z-40 -translate-x-1/2 cursor-pointer opacity-30 transition-all duration-500 hover:opacity-100"
          onClick={() =>
            document
              .getElementById("about")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-[9px] font-bold tracking-[0.4em] text-white uppercase">
              Scroll
            </span>
            <ChevronDown className="h-4 w-4 animate-bounce text-white" />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className="absolute bottom-6 left-1/2 z-40 -translate-x-1/2 cursor-pointer opacity-30 transition-all duration-500 hover:opacity-100"
          onClick={() =>
            document
              .getElementById("about")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-[9px] font-bold tracking-[0.4em] text-white uppercase">
              Scroll
            </span>
            <ChevronDown className="h-4 w-4 animate-bounce text-white" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative z-30">
        <PagesAbout />
      </section>

      {/* Schedule Section */}
      <section id="schedule" className="relative z-30">
        <PagesSchedule />
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative z-30 pb-20">
        <PagesFAQ />
      </section>

      <Footer />

      {/* Scanline Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%),linear-gradient(90deg,rgba(255,0,0,0.1),rgba(0,255,0,0.05),rgba(0,0,255,0.1))] bg-[length:100%_4px,4px_100%] opacity-20" />
    </div>
  );
}
