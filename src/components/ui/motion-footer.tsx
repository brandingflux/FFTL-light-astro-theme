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
export interface SocialItem {
  label: string;
  handle: string;
  href: string;
  icon: "x" | "instagram" | "threads" | "github" | "linkedin";
}

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
  socialItems?: SocialItem[];
  copyrightText?: string;
  creditName?: string;
  className?: string;
  asSection?: boolean;
}

const DEFAULT_SOCIAL_ITEMS: SocialItem[] = [
  {
    label: "X",
    handle: "@fluxfuse_",
    href: "https://x.com/fluxfuse_",
    icon: "x",
  },
  {
    label: "Instagram",
    handle: "@fluxfuse",
    href: "https://www.instagram.com/fluxfuse",
    icon: "instagram",
  },
  {
    label: "Threads",
    handle: "@fluxfuse",
    href: "https://www.threads.net/@fluxfuse",
    icon: "threads",
  },
  {
    label: "GitHub",
    handle: "brandingflux",
    href: "https://github.com/brandingflux",
    icon: "github",
  },
  {
    label: "LinkedIn",
    handle: "fluxfuse",
    href: "https://linkedin.com/company/fluxfuse",
    icon: "linkedin",
  },
];

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
  socialItems,
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
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ];

  const links = secondaryLinks || defaultLinks;
  const socials = socialItems || DEFAULT_SOCIAL_ITEMS;

  const renderSocialIcon = (icon: "x" | "instagram" | "threads" | "github" | "linkedin") => {
    switch (icon) {
      case "x":
        return (
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
          </svg>
        );
      case "instagram":
        return (
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077" />
          </svg>
        );
      case "threads":
        return (
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z" />
          </svg>
        );
      case "github":
        return (
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
        );
      case "linkedin":
        return (
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        );
      default:
        return null;
    }
  };

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

          {/* Official Social Channels */}
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 w-full mt-3">
            {socials.map((social, idx) => (
              <MagneticButton
                key={idx}
                as="a"
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-glass-pill px-4 py-2 rounded-full text-neutral-700 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-400 text-xs font-semibold flex items-center gap-2 group transition-all"
                title={`${social.label} (${social.handle})`}
              >
                <span className="text-neutral-500 group-hover:text-orange-500 transition-colors">
                  {renderSocialIcon(social.icon)}
                </span>
                <span>{social.label}</span>
                <span className="text-[11px] font-mono opacity-50 font-normal">{social.handle}</span>
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
