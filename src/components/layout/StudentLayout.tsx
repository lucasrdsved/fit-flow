import { Outlet } from "react-router-dom";
import { StudentBottomNav } from "./StudentBottomNav";
import { motion } from "framer-motion";

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
