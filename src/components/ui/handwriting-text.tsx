"use client";

import { useEffect, useRef, useState } from "react";
import opentype from "opentype.js";

/**
 * Text that writes itself, then inks in.
 *
 * Three things make this behave like handwriting rather than like a fade:
 *
 * 1. The font is parsed from its raw TTF and the glyphs converted to paths. A web font
 *    renders as filled shapes with no outline, so there is nothing to stroke and nothing
 *    to animate — the conversion is what makes a pen stroke possible at all.
 *
 * 2. Every contour is its own <path>. An SVG dash pattern RESTARTS at each subpath, so a
 *    single path holding the whole word cannot be drawn progressively: one long dash just
 *    makes each letter fully present or fully absent. Splitting them and staggering the
 *    delays is what produces a pen crossing the word left to right.
 *
 * 3. The weight comes from one filled copy of the entire word underneath, faded in as the
 *    stroke finishes. The fill must be a single path: a counter — the hole in an `e` or
 *    an `a` — is a separate contour, and it only reads as a hole when the fill rule sees
 *    it together with the outer contour. Fill the split paths individually and every
 *    letter becomes a blob.
 *
 * The glyph parsing is done by opentype.js (bundled locally).
 * The default font is self-hosted at /fonts/handwriting.ttf for instant, zero-CORS loading.
 *
 * If either the library or the font fails to load, the component renders the text as an
 * ordinary <span> — it degrades to plain text rather than to nothing.
 *
 * Colour comes from `currentColor`, so `className="text-primary-500"` styles it.
 */

const DEFAULT_FONT_URL = "/fonts/handwriting.ttf";

export interface HandwritingTextProps {
  /** A single phrase to write. Ignored when `words` is given. */
  text?: string;
  /** Cycle through these, rewriting on each change. */
  words?: string[];
  /** Milliseconds each word is held before the next one starts. */
  interval?: number;
  /** URL of a .ttf or .otf. Must be CORS-readable; self-host for production. */
  fontUrl?: string;
  /** Seconds for the pen to cross the whole word. */
  duration?: number;
  /** Seconds before the pen starts. */
  delay?: number;
  /** Stroke weight, in units of a 100px em. */
  strokeWidth?: number;
  /** Ink the letters in once drawn. Set false to leave them as outlines. */
  fill?: boolean;
  /** CSS height of the rendered word; width follows the glyphs. */
  height?: string;
  className?: string;
  style?: React.CSSProperties;
}

type Geometry = {
  full: string;
  contours: string[];
  x: number;
  y: number;
  w: number;
  h: number;
};

/* eslint-disable @typescript-eslint/no-explicit-any */

function getOpentype(): any {
  if (typeof window !== "undefined" && (window as any).opentype) {
    return (window as any).opentype;
  }
  return (opentype as any).default || opentype;
}

// One fetch and one parse per font URL, shared by every instance on the page.
const fontCache = new Map<string, Promise<any>>();

function loadFont(url: string): Promise<any> {
  let pending = fontCache.get(url);
  if (!pending) {
    pending = fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Font request failed: ${res.status}`);
        return res.arrayBuffer();
      })
      .then((buffer) => {
        const lib = getOpentype();
        return lib.parse(buffer);
      });
    fontCache.set(url, pending);
  }
  return pending;
}

const EM = 100; // arbitrary: the viewBox normalises whatever we pick

export function HandwritingText({
  text,
  words,
  interval = 3200,
  fontUrl = DEFAULT_FONT_URL,
  duration = 1.5,
  delay = 0.05,
  strokeWidth = 1.6,
  fill = true,
  height = "1.15em",
  className,
  style,
}: HandwritingTextProps) {
  const cycle = Boolean(words && words.length > 0);
  const [index, setIndex] = useState(0);
  const current = cycle ? words![index % words!.length] : text ?? "";

  const [font, setFont] = useState<any>(null);
  const [geom, setGeom] = useState<Geometry | null>(null);
  const [drawn, setDrawn] = useState(false);
  const [lengths, setLengths] = useState<number[]>([]);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    if (!cycle) return undefined;
    const id = setInterval(() => setIndex((i) => i + 1), interval);
    return () => clearInterval(id);
  }, [cycle, interval]);

  useEffect(() => {
    let cancelled = false;
    loadFont(fontUrl)
      .then((f) => {
        if (!cancelled) setFont(f);
      })
      .catch((err) => {
        console.error("Failed to load handwriting font:", err);
      });
    return () => {
      cancelled = true;
    };
  }, [fontUrl]);

  useEffect(() => {
    if (!font || !current) return;
    try {
      const path = font.getPath(current, 0, EM, EM);
      const box = path.getBoundingBox();
      const pad = EM * 0.12; // room for the stroke and any descenders
      const full = path.toPathData(2);
      pathRefs.current = [];
      setGeom({
        full,
        // Split on the moveto that opens each contour, keeping the M with its segment.
        contours: full.split(/(?=M)/).filter((d: string) => d.trim().length > 1),
        x: box.x1 - pad,
        y: box.y1 - pad,
        w: box.x2 - box.x1 + pad * 2,
        h: box.y2 - box.y1 + pad * 2,
      });
      setDrawn(false);
      setLengths([]);
    } catch (err) {
      console.error("Error computing handwriting glyph paths:", err);
    }
  }, [font, current]);

  useEffect(() => {
    if (!geom) return undefined;
    const measuredLengths = pathRefs.current
      .slice(0, geom.contours.length)
      .map((el) => (el ? el.getTotalLength() : 0));
    setLengths(measuredLengths);

    // Two frames: the first commits the full-length offsets with no transition, the
    // second enables it and moves to zero. Both in one commit leaves nothing to animate.
    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setDrawn(true);
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [geom]);

  // Before the font resolves — and if it never does — the text is still readable.
  if (!geom) {
    return <span className={className} style={style}>{current}</span>;
  }

  const count = Math.max(1, geom.contours.length);

  return (
    <svg
      key={current}
      viewBox={`${geom.x} ${geom.y} ${geom.w} ${geom.h}`}
      role="img"
      aria-label={current}
      className={["inline-block", className].filter(Boolean).join(" ")}
      style={{
        height,
        width: `calc(${height} * ${(geom.w / geom.h).toFixed(4)})`,
        overflow: "visible",
        verticalAlign: "middle",
        ...style,
      }}
    >
      {fill && (
        <path
          d={geom.full}
          fill="currentColor"
          stroke="none"
          style={{
            opacity: drawn ? 1 : 0,
            transition: drawn
              ? `opacity 0.45s ease-out ${(delay + duration * 0.72).toFixed(3)}s`
              : "none",
          }}
        />
      )}
      {geom.contours.map((d, i) => {
        const length = lengths[i] || 1000;
        // Contours overlap slightly so the stroke reads as one continuous movement
        // rather than as letters switching on in turn.
        const each = (duration / count) * 2.4;
        const start = delay + (i / count) * duration;
        return (
          <path
            key={i}
            ref={(el) => {
              pathRefs.current[i] = el;
            }}
            d={d}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: length,
              strokeDashoffset: drawn ? 0 : length,
              transition: drawn
                ? `stroke-dashoffset ${each.toFixed(3)}s ease-out ${start.toFixed(3)}s`
                : "none",
            }}
          />
        );
      })}
    </svg>
  );
}

export default HandwritingText;
