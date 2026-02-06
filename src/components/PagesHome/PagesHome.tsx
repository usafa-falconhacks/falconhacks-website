import React, { useEffect, useRef, useState, Suspense } from "react";
import { useScroll, useTransform, useSpring, motion } from "motion/react";
import * as THREE from "three";
import {
  Environment,
  Float,
  PerspectiveCamera,
  useGLTF,
  useProgress,
  Html,
} from "@react-three/drei";
import { useFrame, useThree, Canvas } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  ASCII,
} from "@react-three/postprocessing";
import { ChevronDown } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import LetterGlitch from "../react-bits/LetterGlitch";
import { LoadingScreen } from "../LoadingScreen";
import { Navbar } from "../Navbar";
import { RegistrationModal } from "../RegistrationModal";
import { Button } from "../ui/button";
import { Footer } from "../Footer";
import PagesHomeSectionAbout from "./PagesHomeSectionAbout";
import PagesHomeSectionFAQ from "./PagesHomeSectionFAQ";
import PagesHomeSectionSchedule from "./PagesHomeSectionSchedule";

import PagesHomeSectionStats from "./PagesHomeSectionStats";
import PagesHomeSectionPrizes from "./PagesHomeSectionPrizes";
import PagesHomeSectionSponsors from "./PagesHomeSectionSponsors";
import { EncryptedText } from "../ui/encrypted-text";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const group = useRef<any>(null);
  const isMobile = useIsMobile();
  const { mouse, viewport } = useThree();
  const [reticlePos, setReticlePos] = useState({ x: 0, y: 0 });

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        -mouse.y * 0.2,
        0.1,
      );
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        mouse.x * 0.2,
        0.1,
      );
    }
  });

  // Apply premium material to model
  useEffect(() => {
    if (scene) {
      scene.traverse((child: any) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: "#1a1a1a",
            metalness: 0.9,
            roughness: 0.3,
            wireframe: false,
          });
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [scene]);

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

const SceneContent = ({ isMobile }: { isMobile: boolean }) => {
  // Performance optimization: skip post-processing on mobile
  if (isMobile) {
    return (
      <>
        <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={40} />
        <ambientLight intensity={2.5} />
        <pointLight position={[10, 10, 10]} intensity={500} />
        <pointLight position={[-10, -10, -10]} intensity={500} />
        <Suspense fallback={null}>
          <group
            position={[0, -0.75, 0]}
            scale={0.065}
            rotation={[-Math.PI / 32, -Math.PI / 9, 0]}
          >
            <Model url="/assets/models/low_poly_11_usaf_f22a_raptor.glb" />
          </group>
          <Environment preset="city" environmentIntensity={2} />
        </Suspense>
      </>
    );
  }

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={40} />
      <ambientLight intensity={2.5} />
      <pointLight position={[10, 10, 10]} intensity={500} />
      <pointLight position={[-10, -10, -10]} intensity={500} />
      <Suspense fallback={null}>
        <group
          position={[0, -1.5, 0]}
          scale={0.12}
          rotation={[-Math.PI / 32, -Math.PI / 9, 0]}
        >
          <Model url="/assets/models/low_poly_11_usaf_f22a_raptor.glb" />
        </group>
        <Environment preset="city" environmentIntensity={2} />
      </Suspense>

      <EffectComposer>
        <ASCII
          characters=" .:-+*=%@#<>"
          fontSize={1000}
          cellSize={isMobile ? 8 : 4}
          color="#4e4f4e"
        />
        <Bloom
          intensity={0.75}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
        />
        <ChromaticAberration offset={new THREE.Vector2(0.0035, 0.0035)} />
      </EffectComposer>
    </>
  );
};

const PremiumSection = ({
  children,
  id,
}: {
  children: React.ReactNode;
  id?: string;
}) => {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-20%" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
          },
        },
      }}
      className="relative z-30"
    >
      {children}
    </motion.section>
  );
};

export default function PagesHome() {
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { progress } = useProgress();

  const { scrollY } = useScroll();
  const springScrollY = useSpring(scrollY, { stiffness: 100, damping: 30 });

  const y1 = useTransform(springScrollY, [0, 500], [0, -150]);
  const y2 = useTransform(springScrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const canvasOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const canvasDisplay = useTransform(scrollY, (value) =>
    value > 600 ? "none" : "block",
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => setLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  return (
    <div className="relative w-full overflow-hidden bg-black font-mono text-white selection:bg-white selection:text-black">
      <LoadingScreen loading={loading} />

      <div className="fixed inset-0 z-0 opacity-[0.075]">
        <LetterGlitch
          glitchColors={["#4B9CD3", "#C0C0C0", "#111111"]}
          glitchSpeed={100}
          centerVignette={true}
          outerVignette={true}
          smooth={!isMobile}
          fontSize={isMobile ? 12 : 16}
          charWidth={isMobile ? 7.5 : 10}
          charHeight={isMobile ? 15 : 20}
          key={String(isMobile)}
        />
      </div>

      <motion.div
        style={{ opacity: canvasOpacity, display: canvasDisplay }}
        className="pointer-events-none fixed inset-0 z-20"
      >
        {mounted && (
          <Suspense fallback={null}>
            <Canvas
              dpr={[1, 1.5]}
              performance={{ min: 0.5 }}
              gl={{
                alpha: true,
                antialias: false,
                powerPreference: "high-performance",
              }}
            >
              <SceneContent isMobile={isMobile} />
            </Canvas>
          </Suspense>
        )}
      </motion.div>

      <Navbar />

      <section
        id="home"
        className="relative z-30 flex h-screen w-full flex-col items-center justify-center px-6"
      >
        <motion.div
          style={{ y: y1, opacity: heroOpacity }}
          className="pointer-events-none flex flex-col items-center space-y-8 text-center md:space-y-8"
        >
          <div className="flex flex-col items-center space-y-4">
            <h1 className="text-4xl leading-none font-black tracking-tighter text-white uppercase mix-blend-difference md:text-8xl lg:text-9xl">
              <EncryptedText
                text="FalconHacks"
                encryptedClassName="text-neutral-500"
                revealedClassName="text-white"
                revealDelayMs={75}
                key={loading ? "loading" : "loaded"}
              />
            </h1>
          </div>

          <div className="pointer-events-auto flex flex-col items-center gap-6 md:gap-8">
            <RegistrationModal>
              <Button
                size="lg"
                className="group h-12 rounded-none border-none px-8 text-lg font-black uppercase shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 hover:scale-105 hover:bg-white hover:text-black md:h-14 md:px-10 md:text-xl"
              >
                Join Now
              </Button>
            </RegistrationModal>
            <p className="animate-pulse bg-black/40 px-3 py-1 text-[8px] font-bold tracking-[0.2em] text-[#C0C0C0] uppercase backdrop-blur-sm md:text-[10px] md:tracking-[0.3em]">
              [ SYSTEM STATUS: ACTIVE // DEPLOYMENT: USAFA ]
            </p>
          </div>
        </motion.div>

        <motion.div
          style={{ y: y2, opacity: heroOpacity }}
          className="pointer-events-none absolute bottom-8 left-8 z-40 hidden sm:block"
        >
          <p className="bg-black/40 px-2 py-1 text-[10px] font-bold tracking-[0.3em] text-white uppercase opacity-50 backdrop-blur-sm">
            COORDINATE: 38.9928° N, 104.8583° W
          </p>
        </motion.div>

        <motion.div
          style={{ y: y2, opacity: heroOpacity }}
          className="pointer-events-none absolute right-8 bottom-8 z-40 hidden sm:block"
        >
          <p className="bg-black/40 px-2 py-1 text-[10px] font-bold tracking-[0.3em] text-white uppercase opacity-50 backdrop-blur-sm">
            TAKE FLIGHT
          </p>
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
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
        </motion.div>
      </section>

      <PremiumSection id="about">
        <PagesHomeSectionAbout />
      </PremiumSection>

      <PremiumSection id="stats">
        <PagesHomeSectionStats />
      </PremiumSection>

      <PremiumSection id="prizes">
        <PagesHomeSectionPrizes />
      </PremiumSection>

      <PremiumSection id="schedule">
        <PagesHomeSectionSchedule />
      </PremiumSection>

      <PremiumSection id="faq">
        <div className="pb-20">
          <PagesHomeSectionFAQ />
        </div>
      </PremiumSection>

      <PremiumSection id="sponsors">
        <PagesHomeSectionSponsors />
      </PremiumSection>

      <Footer />

      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%),linear-gradient(90deg,rgba(255,0,0,0.1),rgba(0,255,0,0.05),rgba(0,0,255,0.1))] bg-[length:100%_4px,4px_100%] opacity-20" />
    </div>
  );
}
