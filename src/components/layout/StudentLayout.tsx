import { Outlet } from "react-router-dom";
import { StudentBottomNav } from "./StudentBottomNav";
import { motion } from "framer-motion";

/**
 * The layout component for the student application.
 *
 * It wraps the content in a container with bottom padding to accommodate the bottom navigation.
 * It applies a fade-in and slide-up animation to the content.
 * It includes the `StudentBottomNav` component.
 *
 * @returns {JSX.Element} The student layout component.
 */
export function StudentLayout() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen"
      >
        <Outlet />
      </motion.main>
      <StudentBottomNav />
    </div>
  );
}
