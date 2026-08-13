"use client";

import { Radio } from "@base-ui/react/radio";

import { cn } from "@/lib/utils";

/**
 * One numbered circle in a rating scale. Sits inside the registry's
 * `RadioGroup`, which is what owns roving focus and the arrow keys.
 *
 * WHY THIS IS A COMPONENT AND NOT MARKUP IN A PAGE. The registry ships
 * `RadioGroupItem`, and it cannot be used here: it hardcodes its own indicator
 * child, so nothing can go inside the circle and a Likert scale needs the
 * number there. The first attempt treated that as licence to write the circle
 * by hand inside a mock page, which is hand-rolling one layer up — the group's
 * keyboard behaviour was kept and the item's CONTRACT was thrown away. Diffed
 * against the registry afterwards, that hand-written circle had silently
 * dropped disabled, dropped every invalid state, and bordered a control with
 * `border-border` instead of `border-input`.
 *
 * That last one is the reason this file exists rather than a bug fix in two
 * places. The two tokens are the same value in light and diverge in dark
 * (#ffffff1a against #ffffff26), so a control wearing the panel-edge token
 * renders a fainter edge than every other control in the system, in one mode
 * only, and nothing errors. The shipped Likert scene had inherited it too.
 *
 * A CCD component, deliberately not in `ui/`: that directory holds registry
 * copies that must stay byte-identical to `shadcn add --diff`, and this is ours.
 * It lives beside `typography.tsx`, the other thing CCD authors.
 */

/**
 * Disabled keys off `data-disabled`, not the `disabled:` variant the house
 * style uses elsewhere. Base UI renders Radio.Root as a SPAN, and `disabled:`
 * is a form-element pseudo-class that can never match one — it would compile,
 * render nothing, and error nowhere. The intent is the same as Button's
 * (`opacity-50` + `pointer-events-none`); only the selector differs, because
 * only this one matches.
 *
 * pointer-events-none is also what keeps hover from firing on a disabled
 * circle, which is why there is no separate rule turning hover off.
 */
const ROOT = "group grid cursor-pointer place-items-center outline-none data-disabled:pointer-events-none data-disabled:opacity-50";

/**
 * `aria-invalid` rather than Base UI's `data-invalid`: the latter is only set
 * inside a `Field.Root`, which a Likert matrix does not use, while aria-invalid
 * is what every other control in this system styles on and what a consumer sets
 * by hand. Matching the registry's convention keeps one error look across the
 * set.
 */
const CIRCLE = [
  "grid aspect-square shrink-0 place-items-center rounded-full border",
  "text-sm font-medium tabular-nums transition-colors",
  /* border-input, NOT border-border. This is a control, and the two tokens
     part company in dark. */
  "border-input bg-card dark:bg-input/30",
  "group-hover:border-muted-foreground",
  "group-focus-visible:border-ring group-focus-visible:ring-3 group-focus-visible:ring-ring/50",
  /* The dark repeat is not redundant. `dark:bg-input/30` above and this rule
     are the same specificity, so in dark the resting fill was winning and a
     CHECKED circle rendered as an outline with no fill — caught by looking at
     the scene in dark, not by reading. The registry carries the same duplicate
     (`dark:data-checked:bg-primary`) for the same reason; dropping it was how
     this broke. */
  "group-data-checked:border-primary group-data-checked:bg-primary group-data-checked:text-primary-foreground",
  "dark:group-data-checked:bg-primary",
  "group-aria-invalid:border-destructive group-aria-invalid:ring-3 group-aria-invalid:ring-destructive/20",
].join(" ");

/**
 * Two sizes, and the pair is a live question rather than a preference: both
 * clear WCAG 2.2's 24×24 floor, and 44 is what a phone-first survey
 * conventionally wants. Rendered side by side at /mocks/likert-control.
 */
const SIZE = {
  default: "size-10",
  lg: "size-11",
} as const;

export function ScaleOption({
  className,
  circleClassName,
  size = "default",
  children,
  ...props
}: Radio.Root.Props & {
  size?: keyof typeof SIZE;
  /** The circle is a child of the target, so styling it needs its own hook. */
  circleClassName?: string;
}) {
  return (
    /* Two elements, not one, and this is carried from v2 deliberately: the Root
       fills its whole column so the tappable box is wider than the circle it
       draws. At 375px that is a 56px target around a 40px circle. */
    <Radio.Root data-slot="scale-option" className={cn(ROOT, className)} {...props}>
      <span className={cn(CIRCLE, SIZE[size], circleClassName)}>{children}</span>
    </Radio.Root>
  );
}
