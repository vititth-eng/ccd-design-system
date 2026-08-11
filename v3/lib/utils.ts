import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge class names, letting a caller's utility win over the component's own.
 *
 * clsx flattens conditionals; twMerge resolves Tailwind conflicts by keeping
 * the last of any competing pair. Without twMerge, `<Body className="text-sm">`
 * would emit both `text-base` and `text-sm` and the winner would be decided by
 * stylesheet order rather than by the caller.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
