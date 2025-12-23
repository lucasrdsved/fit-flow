import { useState, useEffect, useCallback } from 'react';

export function useWorkoutTimer() {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null || prev <= 1) {
            setIsActive(false);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setTimeLeft(null);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startTimer = useCallback((seconds: number) => {
    setTimeLeft(seconds);
    setIsActive(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsActive(false);
  }, []);

  const resumeTimer = useCallback(() => {
    if (timeLeft !== null && timeLeft > 0) {
      setIsActive(true);
    }
  }, [timeLeft]);

  const stopTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(null);
  }, []);

  const addTime = useCallback((seconds: number) => {
    setTimeLeft((prev) => (prev || 0) + seconds);
  }, []);

  return {
    timeLeft,
    isActive,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    addTime,
  };
}

export function useRestTimer(defaultRestTime: number = 60) {
  const timer = useWorkoutTimer();

  const startRest = useCallback(
    (customTime?: number) => {
      timer.startTimer(customTime || defaultRestTime);
    },
    [timer, defaultRestTime],
  );

  const skipRest = useCallback(() => {
    timer.stopTimer();
  }, [timer]);

  const addRestTime = useCallback(
    (seconds: number) => {
      timer.addTime(seconds);
    },
    [timer],
  );

  return {
    ...timer,
    startRest,
    skipRest,
    addRestTime,
  };
}