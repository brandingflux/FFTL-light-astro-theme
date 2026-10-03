"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

// Register ScrollTrigger safely for React
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// -------------------------------------------------------------------------
// 1. THEME-ADAPTIVE INLINE STYLES (Mizu Light/Dark Theme Consistent)
// -------------------------------------------------------------------------
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');

.cinematic-footer-wrapper {
  font-family: 'Clash-Grotesk', 'Plus Jakarta Sans', sans-serif;
  -webkit-font-smoothing: antialiased;

  --background: #ffffff;
  --foreground: #0a0a0a;
  --muted-foreground: #525252;
  --border: #e5e5e5;
  --primary: #FB5700;
  --primary-glow: rgba(251, 87, 0, 0.08);
  --destructive: #ef4444;

  /* Glass Pills Theming matching Mizu cards */
  --pill-bg: rgba(255, 255, 255, 0.85);
  --pill-bg-hover: #ffffff;
  --pill-border: rgba(229, 229, 229, 0.9);
  --pill-border-hover: rgba(251, 87, 0, 0.6);
  --pill-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
  --pill-shadow-hover: 0 10px 25px -3px rgba(251, 87, 0, 0.12);
}

:where(.dark, .dark *) .cinematic-footer-wrapper,
.dark .cinematic-footer-wrapper,
.cinematic-footer-wrapper.dark {
  --background: #0a0a0a;
  --foreground: #ffffff;
  --muted-foreground: #a3a3a3;
  --border: #262626;
  --primary: #FB5700;
  --primary-glow: rgba(251, 87, 0, 0.14);
  --destructive: #ef4444;

  --pill-bg: rgba(23, 23, 23, 0.85);
  --pill-bg-hover: rgba(38, 38, 38, 0.95);
  --pill-border: rgba(38, 38, 38, 0.9);
  --pill-border-hover: rgba(251, 87, 0, 0.5);
  --pill-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.4);
  --pill-shadow-hover: 0 10px 25px -3px rgba(251, 87, 0, 0.2);
}

@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
  100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
}

@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes footer-heartbeat {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px rgba(239, 68, 68, 0.5)); }
  15%, 45% { transform: scale(1.2); filter: drop-shadow(0 0 10px rgba(239, 68, 68, 0.8)); }
  30% { transform: scale(1); }
}

.animate-footer-breathe {
  animation: footer-breathe 8s ease-in-out infinite alternate;
}

.animate-footer-scroll-marquee {
  animation: footer-scroll-marquee 40s linear infinite;
}

.animate-footer-heartbeat {
  animation: footer-heartbeat 2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
}

/* Signature Theme Dashed Border */
.footer-border-dashed {
  background-image: repeating-linear-gradient(
    90deg,
    #e5e5e5 0 4px,
    transparent 4px 8px
  );
}
:where(.dark, .dark *) .footer-border-dashed,
.dark .footer-border-dashed,
.cinematic-footer-wrapper.dark .footer-border-dashed {
  background-image: repeating-linear-gradient(
    90deg,
    #333333 0 4px,
    transparent 4px 8px
  );
}

/* Theme-consistent Diagonal Stripe Pattern (matching devfiles/bg.png and the overall website) */
.footer-pattern-bg {
  background-image: url('/bgs/stripe-gray-light.svg');
  background-size: 38px;
  background-attachment: fixed;
}
:where(.dark, .dark *) .footer-pattern-bg,
.dark .footer-pattern-bg,
.cinematic-footer-wrapper.dark .footer-pattern-bg {
  background-image: url('/bgs/stripe-gray-dark.svg');
  background-size: 38px;
  background-attachment: fixed;
}

/* Theme Warm Brand Aurora Glow */
.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%, 
    var(--primary-glow) 0%, 
    rgba(249, 115, 22, 0.02) 45%, 
    transparent 70%
  );
}

/* Glass Pill Theming */
.footer-glass-pill {
  background: var(--pill-bg);
  border: 1px solid var(--pill-border);
  box-shadow: var(--pill-shadow);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-glass-pill:hover {
  background: var(--pill-bg-hover);
  border-color: var(--pill-border-hover);
  box-shadow: var(--pill-shadow-hover);
}

/* Giant Background Text Masking */
.footer-giant-bg-text {
  font-family: 'Clash-Display', sans-serif;
  font-size: 26vw;
  line-height: 0.75;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(0, 0, 0, 0.05);
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.06) 0%, transparent 60%);
  -webkit-background-clip: text;
  background-clip: text;
}

:where(.dark, .dark *) .footer-giant-bg-text,
.dark .footer-giant-bg-text,
.cinematic-footer-wrapper.dark .footer-giant-bg-text {
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.05);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, transparent 60%);
  -webkit-background-clip: text;
  background-clip: text;
}

/* Heading Typography matching Theme */
.footer-heading {
  font-family: 'Clash-Display', sans-serif;
  color: var(--foreground);
}
`;

// -------------------------------------------------------------------------
// 2. MAGNETIC BUTTON PRIMITIVE (Zero Dependency)
// -------------------------------------------------------------------------
export type MagneticButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & 
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as?: React.ElementType;
  };

export const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(
  ({ children, className, as: Component = "button", ...props }, ref) => {
    const buttonRef = useRef<HTMLElement>(null);
    const resolvedRef = (ref || buttonRef) as React.RefObject<HTMLElement>;

    useEffect(() => {
      const node = resolvedRef.current;
      if (!node) return;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = node.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;

        gsap.to(node, {
          x: distanceX * 0.25,
          y: distanceY * 0.25,
          duration: 0.4,
          ease: "power2.out",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(node, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: "elastic.out(1, 0.3)",
        });
      };

      node.addEventListener("mousemove", handleMouseMove);
      node.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        node.removeEventListener("mousemove", handleMouseMove);
        node.removeEventListener("mouseleave", handleMouseLeave);
      };
    }, [resolvedRef]);

    const Tag = Component;
    return (
      <Tag
        ref={resolvedRef}
        className={cn("cursor-pointer transition-transform select-none will-change-transform", className)}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);
MagneticButton.displayName = "MagneticButton";

// -------------------------------------------------------------------------
// 3. CINEMATIC FOOTER COMPONENT
// -------------------------------------------------------------------------
export interface CinematicFooterProps {
  title?: string;
  giantText?: string;
  marqueeItems?: string[];
  primaryButtons?: Array<{
    label: string;
    href: string;
    icon?: "apple" | "android" | "arrow" | React.ReactNode;
  }>;
  secondaryLinks?: Array<{
    label: string;
    href: string;
  }>;
  copyrightText?: string;
  creditName?: string;
  className?: string;
  asSection?: boolean;
}

const DEFAULT_MARQUEE_ITEMS = [
  "Apps & Software",
  "Productivity Extensions",
  "SaaS Platforms",
  "AI Automation",
  "Digital Solutions",
  "Engineering & Design",
];

const MarqueeItem = ({ items = DEFAULT_MARQUEE_ITEMS }: { items?: string[] }) => (
  <div className="flex items-center space-x-12 px-6">
    {items.map((item, index) => (
      <React.Fragment key={index}>
        <span>{item}</span>{" "}
        <span className="text-orange-500 dark:text-orange-400 opacity-80">
          ✦
        </span>
      </React.Fragment>
    ))}
  </div>
);

export function CinematicFooter({
  title = "Let's build something that matters.",
  giantText = "FLUXFUSE",
  marqueeItems = DEFAULT_MARQUEE_ITEMS,
  primaryButtons,
  secondaryLinks,
  copyrightText = "© 2026 FluxFuse Technologies Limited. All rights reserved.",
  creditName = "FluxFuse",
  className,
  asSection = false,
}: CinematicFooterProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!wrapperRef.current) return;

    // React strict mode compatible GSAP context cleanup
    const ctx = gsap.context(() => {
      // Background Parallax
      gsap.fromTo(
        giantTextRef.current,
        { y: "10vh", scale: 0.8, opacity: 0 },
        {
          y: "0vh",
          scale: 1,
          opacity: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 80%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );

      // Staggered Content Reveal
      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 40%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const defaultButtons = [
    {
      label: "Explore Products",
      href: "/products",
      icon: "arrow" as const,
    },
    {
      label: "Work With Us",
      href: "/contact",
      icon: "arrow" as const,
    },
  ];

  const buttons = primaryButtons || defaultButtons;

  const defaultLinks = [
    { label: "Products", href: "/products" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy & Terms", href: "/terms" },
  ];

  const links = secondaryLinks || defaultLinks;

  const renderIcon = (icon?: "apple" | "android" | "arrow" | React.ReactNode) => {
    if (icon === "apple") {
      return (
        <svg className="w-5 h-5 text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.79 3.59-.76 1.56.04 2.87.67 3.55 1.76-3.13 1.77-2.62 5.92.35 7.14-.65 1.58-1.57 3.1-2.57 4.03zm-3.21-14.7c-.55 1.4-1.89 2.37-3.25 2.28.09-1.5 1.05-2.82 2.38-3.4 1.25-.57 2.66-.41 3.25.04-.15.35-.26.72-.38 1.08z" />
        </svg>
      );
    }
    if (icon === "android") {
      return (
        <svg className="w-5 h-5 text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0004.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0004.5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0222 3.503C15.5902 8.242 13.8533 7.85 12 7.85c-1.8533 0-3.5902.392-5.1369 1.1004L4.841 5.4475a.416.416 0 00-.5676-.1521.416.416 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3436-4.1021-2.6893-7.5743-6.1185-9.4396" />
        </svg>
      );
    }
    if (icon === "arrow") {
      return (
        <svg className="w-4 h-4 text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-white transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      );
    }
    if (React.isValidElement(icon)) return icon;
    return null;
  };

  const footerContent = (
    <footer
      className={cn(
        asSection
          ? "relative flex min-h-[90vh] md:min-h-screen w-full flex-col justify-between overflow-hidden bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white cinematic-footer-wrapper pt-28 lg:pt-36 pb-12"
          : "fixed bottom-0 left-0 flex h-screen w-full flex-col justify-between overflow-hidden bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white cinematic-footer-wrapper pt-28 lg:pt-36",
        className
      )}
    >
      {/* Top & Bottom Dashed Borders matching Mizu theme */}
      <div className="absolute top-0 left-0 right-0 h-px footer-border-dashed z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-px footer-border-dashed z-20 pointer-events-none" />

      {/* Theme Stripe Background & Subtle Brand Aurora */}
      <div className="footer-pattern-bg absolute inset-0 z-0 pointer-events-none" />
      <div className="footer-aurora absolute left-1/2 top-1/2 h-[65vh] w-[85vw] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-[50%] blur-[90px] pointer-events-none z-0" />

      {/* Giant background text */}
      <div
        ref={giantTextRef}
        className="footer-giant-bg-text absolute -bottom-[5vh] left-1/2 -translate-x-1/2 whitespace-nowrap z-0 pointer-events-none select-none"
      >
        {giantText}
      </div>

      {/* 1. Diagonal Sleek Marquee (Top of footer, offset below sticky navbar) */}
      <div className="absolute top-28 lg:top-36 left-0 w-full overflow-hidden border-y border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md py-4 z-10 -rotate-2 scale-110 shadow-xs">
        <div className="flex w-max animate-footer-scroll-marquee text-xs md:text-sm font-mono font-bold tracking-[0.25em] text-neutral-600 dark:text-neutral-400 uppercase">
          <MarqueeItem items={marqueeItems} />
          <MarqueeItem items={marqueeItems} />
        </div>
      </div>

      {/* 2. Main Center Content (comfortably clear of navbar and marquee) */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 mt-28 lg:mt-36 pt-8 lg:pt-12 w-full max-w-5xl mx-auto">
        <h2
          ref={headingRef}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black footer-heading tracking-tight mb-8 lg:mb-12 text-center"
        >
          {title}
        </h2>

        {/* Interactive Magnetic Pills Layout */}
        <div ref={linksRef} className="flex flex-col items-center gap-6 w-full">
          {/* Primary Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 w-full">
            {buttons.map((btn, idx) => (
              <MagneticButton
                key={idx}
                as="a"
                href={btn.href}
                className="footer-glass-pill px-8 md:px-10 py-4 md:py-5 rounded-full text-neutral-900 dark:text-white font-bold text-sm md:text-base flex items-center gap-3 group"
              >
                {renderIcon(btn.icon)}
                <span>{btn.label}</span>
              </MagneticButton>
            ))}
          </div>

          {/* Secondary Text Links */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-6 w-full mt-2">
            {links.map((link, idx) => (
              <MagneticButton
                key={idx}
                as="a"
                href={link.href}
                className="footer-glass-pill px-5 md:px-6 py-2.5 rounded-full text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-xs md:text-sm font-medium flex items-center gap-2 group"
              >
                <span>{link.label}</span>
                {renderIcon("arrow")}
              </MagneticButton>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Bottom Utility Bar */}
      <div className="relative z-10 w-full px-6 py-8 md:py-10 max-w-7xl mx-auto">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200/80 dark:border-neutral-800/80 pt-8 text-xs font-medium text-neutral-500 dark:text-neutral-400">
          <p>{copyrightText}</p>

          <div className="flex items-center gap-2 rounded-full border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 px-4 py-1.5 backdrop-blur-md shadow-xs">
            <img src="/FFTL-01.svg" alt="FluxFuse mark" className="w-4 h-4 object-contain inline-block" />
            <span>Crafted by</span>
            <span className="font-semibold text-neutral-900 dark:text-white">{creditName}</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      {asSection ? (
        <div ref={wrapperRef} className="relative w-full overflow-hidden">
          {footerContent}
        </div>
      ) : (
        <div
          ref={wrapperRef}
          className="relative h-screen w-full"
          style={{
            clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)",
            WebkitClipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)",
          }}
        >
          {footerContent}
        </div>
      )}
    </>
  );
}

export default CinematicFooter;
