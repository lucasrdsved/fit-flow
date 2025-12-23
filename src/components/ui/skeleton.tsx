import { cn } from "@/lib/utils";

/**
 * A placeholder component that simulates the layout of content while it's loading.
 *
 * It uses a pulse animation to indicate a loading state.
 *
 * @param {React.HTMLAttributes<HTMLDivElement>} props - The component props.
 * @returns {JSX.Element} The skeleton component.
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}

export { Skeleton };
