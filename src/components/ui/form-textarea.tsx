"use client";
import { cn } from "../../lib/utils";
import { useMotionTemplate, useMotionValue, motion } from "framer-motion";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import * as React from "react";

export interface InputProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const FormTextArea = React.forwardRef<HTMLTextAreaElement, InputProps>(
  ({ className, ...props }, ref) => {
    const radius = 200; // change this to increase the rdaius of the hover effect
    const [visible, setVisible] = useState(false);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: any) {
      const { left, top } = currentTarget.getBoundingClientRect();

      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    }
    return (
      <motion.div
        style={{
          background: useMotionTemplate`
        radial-gradient(
          ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
          var(--blue-500),
          transparent 80%
        )
      `,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="p-[2px] rounded-lg transition duration-300 group/input"
      >
        <div
          className="flex max-h-lg gap-x-1 w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm  file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 dark:placeholder-text-neutral-600 focus-visible:outline-none focus-visible:ring-[2px]  focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600 disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-[0px_0px_1px_1px_var(--neutral-700)] group-hover/input:shadow-none transition duration-400
        "
        >
          <textarea
            className={cn(
              `w-full bg-gray-50 dark:bg-zinc-800 text-black dark:text-white placeholder:text-neutral-400 dark:placeholder-text-neutral-600 focus:outline-none block p-2.5`,
              className
            )}
            rows={4}
            ref={ref}
            {...props}
          />
        </div>
      </motion.div>
    );
  }
);
FormTextArea.displayName = "FormTextArea";

export { FormTextArea };
