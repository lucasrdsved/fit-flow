import { Outlet } from "react-router-dom";
import { useState } from "react";
import { TrainerSidebar } from "./TrainerSidebar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
