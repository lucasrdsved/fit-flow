import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

/**
 * A wrapper around `react-router-dom`'s `NavLink` that allows styling active and pending states via props.
 *
 * This component simplifies the usage of class names for active/pending states by accepting strings directly
 * instead of requiring a function callback for the `className` prop.
 *
 * @component
 * @example
 * <NavLink to="/home" className="text-gray-500" activeClassName="text-blue-500">
 *   Home
 * </NavLink>
 */
const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive, isPending }) =>
          cn(className, isActive && activeClassName, isPending && pendingClassName)
        }
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
