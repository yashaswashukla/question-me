"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signinSchema } from "@/schemas/signinSchema";
import { signIn } from "next-auth/react";
import { Label } from "@/components/ui/label";
import { LabelInput } from "@/components/ui/form-input";
import LabelInputContainer from "@/components/LabelInputContainer";
import BottomGradient from "@/components/BottomGradient";

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  // using zod

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    setIsSubmitting(true);
    const response = await signIn("credentials", {
      identifier: data.email,
      password: data.password,
      redirect: false,
    });
    if (response?.error) {
      toast({
        title: "Login Failed ",
        description: "Incorrect email or password",
        variant: "destructive",
      });
    }

    if (response?.url) {
      router.replace("/dashboard");
    }
    setIsSubmitting(false);
  };

  return (
    <main className="h-screen overflow-y-hidden w-full dark:bg-black bg-white dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center">
      <div className="flex-col space-y-10 place-items-center">
        <h1 className="text-3xl sm:text-5xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b dark:from-neutral-200 dark:to-neutral-500 from-stone-950 to-stone-500 py-4 text-center">
          Welcome back to Question Me
        </h1>
        <div className="w-full max-w-md items-center bg-gray-100 dark:bg-black">
          <div className="w-full max-w-md mx-auto  md:rounded-2xl p-4 md:px-8 md:pb-8 md:pt-4 shadow-input bg-white dark:bg-zinc-950 pt-2">
            <div className="text-center">
              <p className="font-semibold relative z-20 bg-clip-text text-transparent bg-gradient-to-b dark:from-neutral-200 dark:to-neutral-500 from-stone-950 to-stone-500 mb-8">
                Sign in to continue your anonymous adventure
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <LabelInputContainer>
                          <Label htmlFor="email">Email Address</Label>
                          <LabelInput
                            type="text"
                            placeholder="johndoe@xyz.com"
                            {...field}
                          />
                        </LabelInputContainer>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <LabelInputContainer>
                          <Label htmlFor="password">Password</Label>
                          <LabelInput
                            placeholder="••••••••"
                            type="password"
                            {...field}
                          />
                        </LabelInputContainer>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] mt-10"
                >
                  {isSubmitting ? (
                    <div className="flex justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    "Login"
                  )}
                  <BottomGradient />
                </Button>
              </form>
            </Form>
            <div className="text-center mt-8 flex gap-2 justify-center">
              <p>Not a member yet? </p>
              <div className="dark:text-blue-400 text-blue-500 font-bold transition hover:scale-110">
                <Link href="/signup">Sign up</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
