import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
    useGLTF,
    Environment,
    Float,
    PerspectiveCamera,
    ContactShadows,
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

function Model({ url }: { url: string }) {
    const { scene } = useGLTF(url);
    const group = useRef<any>(null);

    useFrame((state) => {
        if (group.current) {
            group.current.rotation.y += 0.0005 * 2;
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

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "pointer-events-auto fixed top-0 left-0 z-50 flex w-full items-center justify-between px-8 py-6 transition-all duration-150",
                scrolled
                    ? "border-b border-white/10 bg-black/80 py-4 backdrop-blur-md"
                    : "bg-transparent",
            )}
        >
            <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center bg-white">
                    <span className="text-xs font-black text-black uppercase">FH</span>
                </div>
                <div className="text-xl font-bold tracking-tighter text-white uppercase">
                    Falcon Hack
                </div>
            </div>
            <div className="flex items-center gap-10">
                {["About", "Schedule", "FAQ"].map((link) => (
                    <a
                        key={link}
                        href={`#${link.toLowerCase()}`}
                        className="text-[10px] font-bold tracking-[0.2em] text-[#C0C0C0]/60 uppercase transition-all hover:tracking-[0.3em] hover:text-white"
                    >
                        {link}
                    </a>
                ))}
                <Button className="h-10 rounded-none bg-white px-8 font-black tracking-widest text-black uppercase transition-all duration-150 hover:scale-105 hover:bg-[#C0C0C0]">
                    Join Now
                </Button>
            </div>
        </nav>
    );
};

export default function PagesHome() {
    return (
        <div className="relative h-screen w-full overflow-hidden bg-black font-mono text-white selection:bg-white selection:text-black">
            {/* Background Layer: Letter Glitch */}
            <div className="absolute inset-0 z-0 opacity-[0.15]">
                <LetterGlitch
                    glitchColors={["#4B9CD3", "#C0C0C0", "#111111"]}
                    glitchSpeed={100}
                    centerVignette={false}
                    outerVignette={true}
                    smooth={true}
                />
            </div>

            {/* Full Screen 3D Canvas Layer */}
            <div className="pointer-events-none absolute inset-0 z-20">
                <Canvas
                    gl={{ antialias: false, alpha: true, stencil: false, depth: true }}
                >
                    <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={40} />
                    <ambientLight intensity={10} />
                    <pointLight position={[-10, -10, -10]} intensity={100} />
                    <pointLight position={[10, 10, 10]} intensity={100} />

                    <Suspense fallback={null}>
                        <group
                            position={[0, -0.85, 0]}
                            scale={0.12}
                            rotation={[0, -Math.PI / 9, 0]}
                        >
                            <Model url="/assets/models/low_poly_11_usaf_f22a_raptor.glb" />
                        </group>
                        <Environment preset="city" />
                    </Suspense>

                    <EffectComposer>
                        <ASCII characters=" .:-+*=%@#" fontSize={1000} color="#4e4f4e" />
                        <Bloom
                            intensity={0.5}
                            luminanceThreshold={0.2}
                            luminanceSmoothing={0.9}
                        />
                        <ChromaticAberration
                            offset={new THREE.Vector2(0.005, 0.005)}
                        />
                    </EffectComposer>
                </Canvas>
            </div>

            {/* Full Screen 3D Canvas Layer */}
            <div className="pointer-events-none absolute inset-0 z-20">
                <Canvas
                    gl={{ antialias: false, alpha: true, stencil: false, depth: true }}
                >
                    <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={40} />
                    <ambientLight intensity={10} />
                    <pointLight position={[-10, -10, -10]} intensity={100} />
                    <pointLight position={[10, 10, 10]} intensity={100} />

                    <Suspense fallback={null}>
                        <group
                            position={[0, -0.85, 0]}
                            scale={0.12}
                            rotation={[0, -Math.PI / 9, 0]}
                        >
                            <Model url="/assets/models/low_poly_11_usaf_f22a_raptor.glb" />
                        </group>
                        <Environment preset="city" />
                    </Suspense>

                    <EffectComposer>
                        <ASCII characters=" .:-+*=%@#" fontSize={1000} color="#4e4f4e" />
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

            {/* Hero Content Layer */}
            <div className="pointer-events-none relative z-30 flex h-full w-full flex-col items-center justify-center">
                <div className="flex flex-col items-center space-y-12 text-center">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="inline-block border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-sm">
                            <span className="text-[10px] font-black tracking-[0.5em] text-[#4B9CD3] uppercase">
                                Mission: Innovation
                            </span>
                        </div>
                        <h1 className="text-7xl leading-none font-black tracking-tighter text-white uppercase mix-blend-difference md:text-[10rem]">
                            falcon hack
                        </h1>
                    </div>

                    <div className="pointer-events-auto flex flex-col items-center gap-8">
                        <Button
                            size="lg"
                            className="group bg-primary relative overflow-hidden rounded-none border-none px-10 py-8 text-3xl font-black text-white uppercase transition-all duration-150 hover:scale-105"
                        >
                            Join Now
                        </Button>
                        <p className="animate-pulse text-[10px] font-bold tracking-[0.3em] text-[#C0C0C0]/40 uppercase">
                            [ System Status: Active // Deployment: USAFA ]
                        </p>
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="pointer-events-none absolute bottom-8 left-8 z-40 space-y-2">
                <div className="h-px w-24 bg-white/20" />
                <p className="text-[10px] font-black tracking-[0.3em] text-[#C0C0C0] uppercase">
                    Coordinate: 38.9928° N, 104.8583° W
                </p>
            </div>

            <div className="pointer-events-none absolute right-8 bottom-8 z-40 flex flex-col items-end space-y-2">
                <p className="border border-white/10 bg-black/50 px-4 py-2 text-[10px] font-black tracking-[0.5em] text-white uppercase backdrop-blur-sm">
                    FLY FIGHT WIN
                </p>
                <div className="flex gap-4 opacity-20">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-1 w-1 rounded-full bg-white" />
                    ))}
                </div>
            </div>

            {/* Scanline Overlay */}
            <div className="pointer-events-none absolute inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%),linear-gradient(90deg,rgba(255,0,0,0.1),rgba(0,255,0,0.05),rgba(0,0,255,0.1))] bg-size-[100%_2px,2px_100%] opacity-15" />
        </div>
    );
}
