import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="bg-gradient-hero dark min-h-screen relative overflow-hidden flex flex-col">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -left-20 top-1/2 h-60 w-60 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-40 w-40 rounded-full bg-energy/10 blur-2xl" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-6 relative z-10"
      >
        <div className="flex items-center gap-3">
          <div className="bg-gradient-primary flex h-12 w-12 items-center justify-center rounded-xl shadow-glow">
            <Dumbbell className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-display text-2xl font-bold text-foreground">FitCoach</span>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto flex flex-1 items-center justify-center px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 text-center">
            <h1 className="mb-3 font-display text-3xl font-bold text-foreground md:text-4xl">
              {title}
            </h1>
            {description && <p className="text-muted-foreground">{description}</p>}
          </div>

          <div className="rounded-2xl border border-border/50 bg-card/50 p-6 shadow-lg backdrop-blur-xl">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
