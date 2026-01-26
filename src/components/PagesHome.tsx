import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
    useGLTF,
    OrbitControls,
    Environment,
    Float,
    PerspectiveCamera,
} from "@react-three/drei";
import { EffectComposer, ASCII } from "@react-three/postprocessing";
import LetterGlitch from "./LetterGlitch";
import { Button } from "./ui/button";

function Model({ url }: { url: string }) {
    const { scene } = useGLTF(url);
    const group = useRef<any>(null);

    useFrame((state) => {
        if (group.current) {
            group.current.rotation.y += 0.005;
            group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <primitive
                ref={group}
                object={scene}
                scale={5}
                position={[0, 0, 0]}
                rotation={[0.3, -Math.PI / 4, 0]}
            />
        </Float>
    );
}

const Navbar = () => {
    return (
        <nav className="pointer-events-auto fixed top-0 left-0 z-50 flex w-full items-center justify-between px-8 py-6">
            <div className="text-xl font-bold tracking-tighter text-white">
                FALCON HACKS
            </div>
            <div className="flex items-center gap-8">
                <a
                    href="#faq"
                    className="text-sm font-medium tracking-widest text-[#C0C0C0]/80 uppercase transition-colors hover:text-white"
                >
                    FAQ
                </a>
                <Button
                    variant="outline"
                    size="sm"
                    className="border-none bg-white  font-black tracking-widest text-black uppercase shadow-[0_0_50px_rgba(255,255,255,0.2)] transition-all duration-300 hover:scale-105 hover:bg-[#C0C0C0]"

                >
                    Join Now
                </Button>
            </div>
        </nav>
    );
};

export default function PagesHome() {
    return (
        <div className="relative h-screen w-full overflow-hidden bg-black font-mono">
            {/* Background Layer: Letter Glitch */}
            <div className="absolute inset-0 z-0 opacity-20">
                <LetterGlitch
                    glitchColors={["#4B9CD3", "#C0C0C0", "#2C5234"]}
                    glitchSpeed={80}
                    centerVignette={false}
                    outerVignette={true}
                    smooth={true}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
            </div>

            {/* Full Screen 3D Canvas Layer */}
            <div className="pointer-events-none absolute inset-0 z-10">
                <Canvas gl={{ antialias: false, alpha: true }}>
                    <PerspectiveCamera makeDefault position={[0, 0, 10]} />
                    <ambientLight intensity={1.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                    <pointLight position={[-10, -10, -10]} />

                    <Suspense fallback={null}>
                        <group position={[0, -1, -2]} scale={0.15}>

                            <Model url="/assets/models/low_poly_11_usaf_f22a_raptor.glb" />
                        </group>
                        <Environment preset="city" />
                    </Suspense>

                    <EffectComposer>
                        <ASCII characters=" .:-+*=%@#" fontSize={1000} color="#003594" />
                    </EffectComposer>
                </Canvas>
            </div>

            <Navbar />

            {/* Hero Content Layer */}
            <div className="pointer-events-none relative z-20 flex h-full w-full flex-col items-center justify-center">
                <div className="flex flex-col items-center space-y-8 text-center">
                    <h1 className="text-6xl font-black tracking-tighter text-white uppercase mix-blend-difference md:text-9xl">
                        falconhacks
                    </h1>

                    <div className="pointer-events-auto mt-12">
                        <Button
                            size="lg"
                            className="border-none bg-white px-16 py-10 text-2xl font-black tracking-widest text-black uppercase shadow-[0_0_50px_rgba(255,255,255,0.2)] transition-all duration-300 hover:scale-105 hover:bg-[#C0C0C0]"
                        >
                            Join Now
                        </Button>
                    </div>
                </div>
            </div>

            {/* Bottom Text Decor */}
            <div className="pointer-events-none absolute right-8 bottom-8 z-30 opacity-30">
                <p className="text-[10px] tracking-[0.4em] text-[#C0C0C0] uppercase">
                    FLY FIGHT WIN
                </p>
            </div>
        </div>
    );
}
