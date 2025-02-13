"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/data/messages.json";

export default function Home() {
  return (
    <main className="h-screen overflow-y-hidden w-full dark:bg-black bg-white dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

      <div className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b dark:from-neutral-200 dark:to-neutral-500 from-stone-950 to-stone-500 py-4 ">
            Dive into the anonymous world
          </h1>
          <p className="text-xl sm:text-4xl font-semibold relative z-20 bg-clip-text text-transparent bg-gradient-to-b dark:from-neutral-200 dark:to-neutral-500 from-stone-950 to-stone-500 py-4">
            Where your identity remains a secret
          </p>
        </section>
        <Carousel
          plugins={[Autoplay({ delay: 3000 })]}
          className="w-full max-w-xs aspect-video"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <>
                  <Card className="dark:bg-black bg-white ">
                    <CardHeader className="text-sm md:text-md font-light">
                      {message.title}
                    </CardHeader>
                    <CardContent className="text-lg md:text-2xl font-bold">
                      <span>{message.content}</span>
                    </CardContent>
                    <CardFooter className="text-xs font-extralight">
                      {message.received}
                    </CardFooter>
                  </Card>
                </>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </main>
  );
}
