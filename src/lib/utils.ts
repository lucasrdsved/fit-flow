import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names into a single string, handling conditional classes and resolving Tailwind CSS conflicts.
 *
 * This utility function merges class names using `clsx` and then resolves any conflicting Tailwind CSS classes using `tailwind-merge`.
 * It is commonly used to construct `className` props in React components.
 *
 * @param {...ClassValue[]} inputs - A list of class values. Can be strings, objects, arrays, or null/undefined.
 * @returns {string} The merged class name string.
 *
 * @example
 * cn("bg-red-500", "p-4", { "text-white": true, "hidden": false })
 * // returns "bg-red-500 p-4 text-white"
 *
 * cn("p-4", "p-2")
 * // returns "p-2" (resolves conflict)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
