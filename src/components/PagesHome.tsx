import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
    useGLTF,
    Environment,
    Float,
    PerspectiveCamera,
    Points,
    PointMaterial,
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
import { Menu, X, Loader2 } from "lucide-react";
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

const registrationSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    school: z.string().optional(),
    dietaryRestrictions: z.string().optional(),
});

type RegistrationValues = z.infer<typeof registrationSchema>;


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

const RegistrationModal = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<RegistrationValues>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            name: "",
            email: "",
            school: "",
            dietaryRestrictions: "",
        },
    });

    async function onSubmit(values: RegistrationValues) {
        setLoading(true);
        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            const data = (await response.json()) as { error?: string };

            if (response.ok) {
                toast.success("Registration successful! Welcome to FalconHack.");
                setOpen(false);
                form.reset();
            } else {
                toast.error(data.error || "Registration failed. Please try again.");
            }
        } catch (error) {
            toast.error("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="border-white/10 bg-black/90 font-mono text-white backdrop-blur-xl sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black tracking-tighter uppercase">
                        Mission Registration
                    </DialogTitle>
                    <DialogDescription className="text-xs tracking-widest text-[#C0C0C0]/60 uppercase">
                        Enter your credentials to join FalconHack 2026.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 pt-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-bold tracking-widest text-[#C0C0C0] uppercase">
                                        Full Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="John Doe"
                                            {...field}
                                            className="rounded-none border-white/10 bg-white/5 focus-visible:ring-white"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[10px] text-red-500 uppercase" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-bold tracking-widest text-[#C0C0C0] uppercase">
                                        Email Address
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="john@example.edu"
                                            {...field}
                                            className="rounded-none border-white/10 bg-white/5 focus-visible:ring-white"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[10px] text-red-500 uppercase" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="school"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-bold tracking-widest text-[#C0C0C0] uppercase">
                                        School / Institution
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="USAFA"
                                            {...field}
                                            className="rounded-none border-white/10 bg-white/5 focus-visible:ring-white"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[10px] text-red-500 uppercase" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dietaryRestrictions"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-bold tracking-widest text-[#C0C0C0] uppercase">
                                        Dietary Restrictions (Optional)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="None"
                                            {...field}
                                            className="rounded-none border-white/10 bg-white/5 focus-visible:ring-white"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[10px] text-red-500 uppercase" />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-none bg-white font-black tracking-widest text-black uppercase hover:bg-[#C0C0C0]"
                        >
                            {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            Initialize Registration
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <nav
                className={cn(
                    "pointer-events-auto fixed top-0 left-0 z-50 flex w-full items-center justify-between px-6 py-6 transition-all duration-300 md:px-12",
                    scrolled
                        ? "border-b border-white/10 bg-black/80 py-4 backdrop-blur-md"
                        : "bg-transparent",
                )}
            >
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center bg-white">
                        <span className="text-xs font-black text-black uppercase">FH</span>
                    </div>
                    <div className="hidden text-xl font-bold tracking-tighter text-white uppercase md:block">
                        Falcon Hack
                    </div>
                </div>

                {/* Desktop Menu */}
                <div className="hidden items-center gap-10 md:flex">
                    {["About", "Schedule", "FAQ"].map((link) => (
                        <a
                            key={link}
                            href={`#${link.toLowerCase()}`}
                            className="text-[10px] font-bold tracking-[0.2em] text-[#C0C0C0]/60 uppercase transition-all hover:tracking-[0.3em] hover:text-white"
                        >
                            {link}
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
                    {["About", "Schedule", "FAQ"].map((link) => (
                        <a
                            key={link}
                            href={`#${link.toLowerCase()}`}
                            className="text-2xl font-black tracking-[0.2em] text-white uppercase"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {link}
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

export default function PagesHome() {
    const isMobile = useIsMobile();
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
                            position={[0, 0, 0]}
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

            {/* Hero Content Layer */}
            <div className="pointer-events-none relative z-30 flex h-full w-full flex-col items-center justify-center px-6">
                <div className="flex flex-col items-center space-y-8 text-center md:space-y-12">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="flex items-center justify-center border border-white/10 bg-white/5 px-5 py-2.5 backdrop-blur-sm">
                            <div className="text-red-500/50 duration-500 text-center text-[8px] font-black uppercase md:text-[10px] md:tracking-[0.25em]">
                                Operation: CREATE MAYHEM
                            </div>
                        </div>
                        <h1 className="text-5xl leading-none font-black tracking-tighter text-white uppercase mix-blend-difference md:text-[10rem]">
                            falcon
                            <br />
                            hack
                        </h1>
                    </div>

                    <div className="pointer-events-auto flex flex-col items-center gap-6 md:gap-8">
                        <RegistrationModal>
                            <Button
                                size="lg"
                                className="group h-16 rounded-none border-none px-12 py-8 text-xl font-black uppercase transition-all duration-300 hover:scale-105 hover:bg-[#C0C0C0] md:h-20 md:px-20 md:py-12 md:text-3xl"
                            >
                                Join Now
                            </Button>
                        </RegistrationModal>
                        <p className="animate-pulse text-[8px] font-bold tracking-[0.2em] text-[#C0C0C0]/40 uppercase md:text-[10px] md:tracking-[0.3em]">
                            [ System Status: Active // Deployment: USAFA ]
                        </p>
                    </div>
                </div>
            </div>

            {/* Decorative Elements - Hidden on small mobile */}
            <div className="pointer-events-none absolute bottom-8 left-8 z-40 hidden space-y-2 sm:block">
                <div className="h-px w-24 bg-white/20" />
                <p className="text-[10px] font-black tracking-[0.3em] text-[#C0C0C0] uppercase">
                    Coordinate: 38.9928° N, 104.8583° W
                </p>
            </div>

            <div className="pointer-events-none absolute right-8 bottom-8 z-40 flex flex-col items-end space-y-2">
                <p className="border border-white/10 bg-black/50 px-4 py-2 text-[8px] font-black tracking-[0.3em] text-white uppercase backdrop-blur-sm md:text-[10px] md:tracking-[0.5em]">
                    FLY FIGHT WIN
                </p>
                <div className="flex gap-4 opacity-20">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-1 w-1 rounded-full bg-white" />
                    ))}
                </div>
            </div>

            {/* Scanline Overlay */}
            <div className="pointer-events-none absolute inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%),linear-gradient(90deg,rgba(255,0,0,0.1),rgba(0,255,0,0.05),rgba(0,0,255,0.1))] bg-[length:100%_4px,4px_100%] opacity-20" />
        </div>
    );
}
