import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

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
