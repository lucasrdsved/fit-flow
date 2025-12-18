import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

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

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
