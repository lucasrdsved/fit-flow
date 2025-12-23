import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

/**
 * The root component for the Collapsible.
 * An interactive component which expands/collapses a panel.
 */
const Collapsible = CollapsiblePrimitive.Root;

/**
 * The trigger that toggles the collapsible state.
 */
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

/**
 * The content that is expanded or collapsed.
 */
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
