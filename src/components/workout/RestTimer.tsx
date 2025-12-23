import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface RestTimerProps {
  timeLeft: number | null;
  isActive: boolean;
  nextSetInfo?: string;
  onSkip: () => void;
  onAddTime: (seconds: number) => void;
}

export function RestTimer({
  timeLeft,
  isActive,
  nextSetInfo,
  onSkip,
  onAddTime,
}: RestTimerProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isActive || timeLeft === null) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 px-6 backdrop-blur-lg"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <p className="mb-2 text-muted-foreground">Descanse</p>
          <motion.p
            key={timeLeft}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="mb-6 animate-timer-pulse font-display text-7xl font-bold text-foreground"
          >
            {formatTime(timeLeft)}
          </motion.p>

          {nextSetInfo && (
            <p className="mb-8 text-sm text-muted-foreground">
              {nextSetInfo}
            </p>
          )}

          <div className="flex gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => onAddTime(15)}
            >
              +15s
            </Button>
            <Button variant="hero" size="lg" onClick={onSkip}>
              Pular
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}