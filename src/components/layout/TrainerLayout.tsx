import { Outlet } from "react-router-dom";
import { useState } from "react";
import { TrainerSidebar } from "./TrainerSidebar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

/**
 * The layout component for the trainer application.
 *
 * It manages the state of the sidebar (collapsed/expanded) and adjusts the main content margin accordingly.
 * It includes the `TrainerSidebar` component and an `Outlet` for child routes.
 *
 * @returns {JSX.Element} The trainer layout component.
 */
export function TrainerLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <TrainerSidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "min-h-screen transition-all duration-300",
          sidebarCollapsed ? "ml-[72px]" : "ml-64"
        )}
      >
        <Outlet />
      </motion.main>
    </div>
  );
}
