import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Variants for the Badge component, including general styles and fitness-specific themes.
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold font-display transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground border-border",
        // Fitness-specific
        success: "border-transparent bg-success/15 text-success",
        warning: "border-transparent bg-warning/15 text-warning",
        energy: "border-transparent bg-energy/15 text-energy",
        // Status badges
        active: "border-transparent bg-accent/15 text-accent",
        inactive: "border-transparent bg-muted text-muted-foreground",
        pending: "border-transparent bg-warning/15 text-warning",
        completed: "border-transparent bg-success/15 text-success",
        // Workout specific
        sets: "border-transparent bg-primary/15 text-primary font-mono",
        reps: "border-transparent bg-accent/15 text-accent font-mono",
        weight: "border-transparent bg-energy/15 text-energy font-mono",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Props for the Badge component.
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * A small status indicator or label.
 *
 * It supports various variants for different contexts, including fitness-specific ones like 'sets', 'reps', and 'weight'.
 *
 * @param {BadgeProps} props - The component props.
 * @returns {JSX.Element} The badge component.
 */
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
