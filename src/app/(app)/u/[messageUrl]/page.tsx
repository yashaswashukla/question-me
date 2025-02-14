"use client";
import BottomGradient from "@/components/BottomGradient";
import LabelInputContainer from "@/components/LabelInputContainer";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { FormTextArea } from "@/components/ui/form-textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export default function Home() {
  const messageUrl = decodeURIComponent(
    useParams<{ messageUrl: string }>().messageUrl
  );
  const [username, setUsername] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`/api/send-message`, {
        username,
        content: data.content,
      });

      if (response.data.success) {
        toast({ title: "Message sent successfully", variant: "default" });
      } else {
        toast({
          title: "Error",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log("Error in sending message", axiosError);
      toast({
        title: "Error",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axios.put<ApiResponse>(`/api/get-username`, {
          messageUrl,
        });
        if (response.data.success) {
          setUsername(response.data.username as string);
        } else {
          toast({
            title: "Error",
            description: "User not found",
            variant: "destructive",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        console.log("Error fetching username", axiosError);
        toast({
          title: "Error",
          description: axiosError.response?.data.message,
          variant: "destructive",
        });
      }
    };
    fetchUsername();
  }, [messageUrl]);
  return (
    <main className="h-screen overflow-y-hidden w-full dark:bg-black bg-white dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="flex-col space-y-10 place-items-center">
        <h1 className="text-2xl md:text-4xl font-bold mb-10 bg-clip-text text-transparent bg-gradient-to-b dark:from-neutral-200 dark:to-neutral-500 z-20 relative from-stone-950 to-stone-500">
          Send your message Anonymously
        </h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full"
          >
            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <LabelInputContainer>
                      <Label htmlFor="content">
                        Send anonymously to {username}
                      </Label>
                      <FormTextArea
                        placeholder="Write your anonymous message here"
                        className="w-full rows-4 cols-50"
                        {...field}
                      />
                    </LabelInputContainer>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
            <Button
              type="submit"
              disabled={isSubmitting || !form.formState.isValid}
              className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] mt-10"
            >
              {isSubmitting ? (
                <div className="flex justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                </div>
              ) : (
                "Send message"
              )}
              <BottomGradient />
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
