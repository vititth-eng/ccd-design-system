"use client";

import * as React from "react";

/**
 * The contrast ratio a piece of text ACTUALLY got, read off the rendered
 * element.
 *
 * Same reason as LeadingRow beside it: a tabulated ratio is a copy of theme.css
 * that keeps agreeing with it right up until it does not. Every number here
 * comes from getComputedStyle, so it re-measures when a token moves, when the
 * mode flips, and when a class fails to compile — the last of which is the case
 * a typed table can never catch, because a dead utility leaves the element at
 * the inherited colour and the table goes on quoting the intended one.
 *
 * It also re-measures on theme change, because the same pair passes in one mode
 * and fails in the other, and a number frozen at mount would report whichever
 * mode the page happened to load in.
 */

type Rgb = [number, number, number];

function channel(c: number) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function luminance([r, g, b]: Rgb) {
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function parse(value: string): [number, number, number, number] | null {
  const n = value.match(/-?[\d.]+/g);
  if (!n) return null;
  const [r, g, b, a] = n.map(Number);
  return [r, g, b, a === undefined ? 1 : a];
}

function over(top: [number, number, number, number], base: Rgb): Rgb {
  const a = top[3];
  return [top[0] * a + base[0] * (1 - a), top[1] * a + base[1] * (1 - a), top[2] * a + base[2] * (1 - a)];
}

/**
 * What is actually behind this text, composited.
 *
 * The element's OWN background counts — a pill's text sits on the pill. And a
 * translucent layer cannot be skipped in favour of the first opaque ancestor:
 * the status tints are `#27C93F24` in dark, so skipping them scored every pill
 * against the bare card and returned a number identical to the plain label
 * beside it. That agreement is what gave the bug away.
 */
function backdropFor(el: HTMLElement): Rgb {
  const layers: [number, number, number, number][] = [];
  let node: HTMLElement | null = el;
  while (node) {
    const parsed = parse(getComputedStyle(node).backgroundColor);
    if (parsed && parsed[3] > 0) {
      layers.push(parsed);
      if (parsed[3] > 0.99) break;
    }
    node = node.parentElement;
  }
  let base: Rgb = [255, 255, 255];
  for (let i = layers.length - 1; i >= 0; i--) base = over(layers[i], base);
  return base;
}

function ratioOf(el: HTMLElement): number {
  const bg = backdropFor(el);
  const fg = parse(getComputedStyle(el).color);
  if (!fg) return 0;
  const a = luminance(over(fg, bg));
  const b = luminance(bg);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * WCAG 1.4.3. The 3:1 tier needs 18.66px at semibold or 24px at any weight —
 * the size is read off the element too, so a pill that shrinks stops qualifying
 * on its own rather than because someone remembered to change a constant.
 */
function floorFor(el: HTMLElement): number {
  const s = getComputedStyle(el);
  const px = parseFloat(s.fontSize);
  const weight = Number(s.fontWeight) || 400;
  const large = px >= 24 || (px >= 18.66 && weight >= 700);
  return large ? 3 : 4.5;
}

export function ContrastProbe({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [read, setRead] = React.useState<{ ratio: number; floor: number } | null>(null);

  React.useEffect(() => {
    const measure = () => {
      if (!ref.current) return;
      setRead({ ratio: ratioOf(ref.current), floor: floorFor(ref.current) });
    };
    measure();
    /* data-theme lands on <html>, and the toggle writes it without a reload. */
    const observer = new MutationObserver(measure);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class"],
    });
    return () => observer.disconnect();
  }, []);

  const passes = read ? read.ratio >= read.floor : true;

  return (
    <span className="inline-flex items-center gap-2">
      <span ref={ref} className={className} style={style}>
        {children}
      </span>
      <span
        className={`text-xs font-mono ${passes ? "text-muted-foreground" : "text-negative-strong"}`}
      >
        {read ? `${read.ratio.toFixed(2)}:1 ${passes ? "✓" : `✗ needs ${read.floor}`}` : "—"}
      </span>
    </span>
  );
}
