"use client";

import { MagicText } from "@/components/ui/magic-text";

export const Demo = () => {
  return (
    <div className="relative w-full min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 px-4">
      <div className="relative flex items-center justify-center pb-[30rem] mt-[70rem]">
        <MagicText
          text={
            "Hi there! I'm preet, creator of HextaUI. Thank you so much of all the support and love you've shown me. I hope you enjoy using HextaUI as much as I enjoyed creating it."
          }
        />
      </div>
      <p className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-sm font-mono uppercase tracking-widest text-neutral-400">
        Scroll Down 👇
      </p>
    </div>
  );
};

export default Demo;
