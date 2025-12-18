import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold font-display ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md",
        outline: "border-2 border-border bg-transparent hover:bg-secondary hover:border-primary/50 text-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-secondary hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Fitness-specific variants
        success: "bg-success text-success-foreground hover:bg-success/90 shadow-md shadow-success/20",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90 shadow-md shadow-warning/20",
        energy: "bg-energy text-energy-foreground hover:bg-energy/90 shadow-md shadow-energy/20",
        // Hero/CTA variants
        hero: "bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-lg hover:scale-[1.02] transition-transform",
        "hero-accent": "bg-gradient-accent text-accent-foreground shadow-accent-glow hover:shadow-lg hover:scale-[1.02] transition-transform",
        // Glass variants for overlays
        glass: "glass text-foreground hover:bg-card/90",
        // Action button for workout logging
        action: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-md shadow-accent/30 min-h-[56px] text-base font-bold",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-11 w-11",
        "icon-sm": "h-9 w-9",
        "icon-lg": "h-14 w-14",
        // Touch-friendly sizes for mobile workout tracking
        touch: "h-14 px-6 min-w-[120px] text-base",
        "touch-lg": "h-16 px-8 min-w-[160px] text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
