"use client";

import * as React from "react";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

export interface MagicTextProps {
  text: string;
  className?: string;
  wordClassName?: string;
  offset?: [string, string];
}

interface WordProps {
  children: string;
  progress: any;
  range: [number, number];
  wordClassName?: string;
}

const Word: React.FC<WordProps> = ({ children, progress, range, wordClassName }) => {
  const opacity = useTransform(progress, range, [0, 1]);

  return (
    <span
      className={cn(
        "relative inline-block mr-2 md:mr-3.5 my-1 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight",
        wordClassName
      )}
    >
      <span className="absolute top-0 left-0 opacity-20 select-none pointer-events-none text-neutral-900 dark:text-white">
        {children}
      </span>
      <motion.span
        style={{ opacity: opacity }}
        className="text-neutral-900 dark:text-white"
      >
        {children}
      </motion.span>
    </span>
  );
};

export const MagicText: React.FC<MagicTextProps> = ({
  text,
  className,
  wordClassName,
  offset = ["start 0.9", "start 0.25"],
}) => {
  const container = useRef<HTMLParagraphElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: offset as any,
  });

  const words = text.split(" ");

  return (
    <p
      ref={container}
      className={cn("flex flex-wrap leading-normal p-4", className)}
    >
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;

        return (
          <Word
            key={i}
            progress={scrollYProgress}
            range={[start, end]}
            wordClassName={wordClassName}
          >
            {word}
          </Word>
        );
      })}
    </p>
  );
};

export default MagicText;
