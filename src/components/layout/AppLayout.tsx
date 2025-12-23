import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

/**
 * The main application layout component.
 *
 * It provides a container with a background color and applies a fade-in animation to the content.
 * It renders the child routes using `Outlet`.
 *
 * @returns {JSX.Element} The application layout.
 */
export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen"
      >
        <Outlet />
      </motion.main>
    </div>
  );
}
