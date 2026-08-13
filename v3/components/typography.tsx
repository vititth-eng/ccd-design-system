import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * CCD v3 — type roles.
 *
 * Seven roles, each welding size, weight and colour into one decision. shadcn
 * ships no typography of its own ("We do not ship any typography styles by
 * default"), so this file is the entire type doctrine for a v3 app.
 *
 * WHY COMPONENTS AND NOT CLASSES. The alternative is writing utilities inline
 * — `text-xl font-semibold text-foreground` — which renders identically and
 * costs nothing to type. It loses one thing: the markup then records how the
 * text LOOKS and not what it IS, so a page title and a stat that happen to
 * share a size become indistinguishable, and no later change can move all the
 * titles without also moving everything else that size. A role name keeps that
 * intent, and `grep "<Title"` answers "where are the titles" in one search.
 *
 * These do not stop anyone writing a bare <h1 className="text-xl">, and are
 * not meant to. What they buy is that the drift is FINDABLE: `<h1` locates
 * every bypass. A misspelled <Titel> is a type error rather than the silent
 * no-op a misspelled CSS class would be.
 *
 * Colour uses the shadcn semantic tokens, which arrive with the colour layer.
 *
 * NO ROLE FOR 24. `--text-2xl` was minted 2026-08-13 for one reason: the
 * registry's blocks use `text-2xl` eight times — a dashboard KPI figure and an
 * auth screen's h1 — and without the token they rendered at the inherited size.
 * Nothing CCD authors uses 24 yet, and a role nobody calls is the same lie this
 * file spent a session being: an export the codebase does not honour. Mint the
 * role when a CCD screen actually needs that size, not before.
 */

type HeadingLevel = "h1" | "h2" | "h3" | "h4"

/**
 * Display — the one loudest thing on a page. A hero figure, not a heading.
 *
 * Carries the only 700 in the system, and `tabular-nums` so a column of
 * changing numbers does not jitter as digits swap width.
 */
function Display({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="display"
      className={cn(
        "text-3xl font-bold tabular-nums text-foreground",
        className
      )}
      {...props}
    />
  )
}

/**
 * Title — the page's name. Once per page.
 *
 * `as` exists because heading level is a document-structure question, not a
 * visual one: a title inside a dialog or a card is still a title but must not
 * be an <h1>. Default h1; pass `as="h2"` where the outline demands it.
 */
function Title({
  className,
  as: Comp = "h1",
  ...props
}: React.ComponentProps<"h1"> & { as?: HeadingLevel }) {
  return (
    <Comp
      data-slot="title"
      className={cn("text-xl font-semibold text-foreground", className)}
      {...props}
    />
  )
}

/** Section — the header of a block within a page. Repeats; a Title does not. */
function Section({
  className,
  as: Comp = "h2",
  ...props
}: React.ComponentProps<"h2"> & { as?: HeadingLevel }) {
  return (
    <Comp
      data-slot="section"
      className={cn("text-lg font-semibold text-foreground", className)}
      {...props}
    />
  )
}

/** Body — running text and data. The workhorse; most text on a page is this. */
function Body({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="body"
      className={cn("text-base text-foreground", className)}
      {...props}
    />
  )
}

/**
 * Strong — body size, read first. A label column, a figure inside a sentence,
 * the one value in a row that the eye should land on.
 *
 * Emphasis by weight at body size, which is why it is a role and not just
 * <strong>: it also takes tabular figures, since most of its uses are numbers.
 */
function Strong({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="strong"
      className={cn(
        "text-base font-semibold tabular-nums text-foreground",
        className
      )}
      {...props}
    />
  )
}

/**
 * Muted — the supporting line under something else. A subtitle, a hint, a
 * secondary value.
 *
 * Quieter by BOTH size and colour, because colour alone is not enough
 * separation at body size and size alone reads as an error.
 */
function Muted({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="muted"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

/**
 * Caption — timestamps, table meta, the smallest thing that ships.
 *
 * 12px is below the comfortable floor for Thai, whose tone marks lose
 * definition at this size. Reach for Muted first; use Caption only where the
 * text is genuinely incidental and mostly Latin or numeric.
 */
function Caption({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="caption"
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

/**
 * Prose — the container for running text.
 *
 * Owns the two things that belong to a block rather than to a line: the
 * measure (32rem, which measured out at 64 characters in both Thai and Latin)
 * and the vertical rhythm between children.
 *
 * This is deliberately a container and not a property of the roles above. The
 * same Body renders inside a narrow card and across a wide page; a component
 * that clamped its own width would fight whatever it was placed in. Wrap the
 * paragraphs that are meant to be READ. Leave table cells, labels and buttons
 * outside it — those are scanned, and they should fill their container.
 */
function Prose({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="prose"
      className={cn("prose-flow max-w-prose", className)}
      {...props}
    />
  )
}

export { Display, Title, Section, Body, Strong, Muted, Caption, Prose }
