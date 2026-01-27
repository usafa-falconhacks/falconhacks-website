import React, { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const registrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  school: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
});

type RegistrationValues = z.infer<typeof registrationSchema>;

export const RegistrationModal = ({
  children,
}: {
  children: React.ReactNode;
}) => {
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
