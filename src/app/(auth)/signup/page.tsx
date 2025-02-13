"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signupSchema } from "@/schemas/signupSchema";
import { ApiResponse } from "@/types/ApiResponse";
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
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { LabelInput } from "@/components/ui/form-input";

export default function Home() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedUsername = useDebounceCallback(setUsername, 1000);
  const { toast } = useToast();
  const router = useRouter();

  // using zod

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username?username=${username}`
          );
          const message = response.data.message;
          setUsernameMessage(message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          console.log("Error occured", axiosError);
          setUsernameMessage(
            axiosError.response?.data.message || "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);
  useEffect(() => {
    if (usernameMessage) {
      if (usernameMessage !== "Username is unique") {
        toast({
          title: "Invalid username",
          description: usernameMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Valid username",
          description: "This username is valid",
        });
      }
    }
  }, [usernameMessage]);

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/signup`, data);
      if (response.data.success) {
        toast({ title: "Success", description: response.data.message });
        router.replace(`/verify/${username}`);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log("Error signing up the user", axiosError);
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="h-screen overflow-y-hidden w-full dark:bg-black bg-white dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center">
      <div>
        <h1 className="text-3xl sm:text-5xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b dark:from-neutral-200 dark:to-neutral-500 from-stone-950 to-stone-500 py-4 mb-10">
          Join Question Me
        </h1>
        <div className="flex justify-center items-center bg-gray-100 dark:bg-black">
          <div className="w-full max-w-md mx-auto md:rounded-2xl p-4 md:px-8 md:pb-8 md:pt-4 shadow-input bg-white dark:bg-zinc-950 pt-2">
            <div className="text-center">
              <p className="font-semibold relative z-20 bg-clip-text text-transparent bg-gradient-to-b dark:from-neutral-200 dark:to-neutral-500 from-stone-950 to-stone-500 mb-8">
                Sign up to start your anonymous adventure
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  name="username"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <LabelInputContainer>
                          <Label htmlFor="username">Username</Label>
                          <LabelInput
                            placeholder="johndoe"
                            type="text"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              debouncedUsername(e.target.value);
                            }}
                          />
                        </LabelInputContainer>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] mt-10"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    "Signup"
                  )}
                  <BottomGradient />
                </Button>
              </form>
            </Form>
            <div className="text-center mt-8 flex gap-2 justify-center">
              <p>Already a member? </p>
              <div className="dark:text-blue-400 text-blue-500 font-bold transition hover:scale-110">
                <Link href="/signin">Sign in</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
