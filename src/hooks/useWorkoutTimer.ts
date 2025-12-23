import { useState, useEffect, useCallback } from 'react';
import { useNotifications } from './useNotifications';
import { offlineStorage } from '@/lib/offlineStorage';

interface TimerState {
  timeLeft: number | null;
  isActive: boolean;
  startTime: number | null;
  totalElapsed: number;
  type: 'workout' | 'rest' | 'custom';
}

interface TimerSession {
  id: string;
  type: 'workout' | 'rest';
  startTime: number;
  endTime?: number;
  duration: number;
  exerciseId?: string;
  workoutId?: string;
}

export function useWorkoutTimer() {
  const [timerState, setTimerState] = useState<TimerState>({
    timeLeft: null,
    isActive: false,
    startTime: null,
    totalElapsed: 0,
    type: 'custom'
  });
  
  const [sessions, setSessions] = useState<TimerSession[]>([]);
  const [currentSession, setCurrentSession] = useState<TimerSession | null>(null);
  
  const { showNotification } = useNotifications();

  // Load timer state from localStorage on mount
  useEffect(() => {
    const loadTimerState = async () => {
      try {
        const savedState = localStorage.getItem('workoutTimerState');
        const savedSessions = localStorage.getItem('workoutTimerSessions');
        
        if (savedState) {
          const state = JSON.parse(savedState);
          const elapsed = state.startTime ? Date.now() - state.startTime : 0;
          const remaining = Math.max(0, state.timeLeft - Math.floor(elapsed / 1000));
          
          if (remaining > 0 && state.isActive) {
            setTimerState({
              ...state,
              timeLeft: remaining,
              totalElapsed: state.totalElapsed + elapsed
            });
          } else {
            // Timer expired while app was closed
            if (state.isActive) {
              await handleTimerComplete(state);
            }
          }
        }
        
        if (savedSessions) {
          setSessions(JSON.parse(savedSessions));
        }
      } catch (error) {
        console.error('[WorkoutTimer] Failed to load timer state:', error);
      }
    };

    loadTimerState();
  }, []);

  // Save timer state to localStorage whenever it changes
  useEffect(() => {
    if (timerState.isActive && timerState.timeLeft !== null) {
      const stateToSave = {
        ...timerState,
        timestamp: Date.now()
      };
      localStorage.setItem('workoutTimerState', JSON.stringify(stateToSave));
    } else {
      localStorage.removeItem('workoutTimerState');
    }
  }, [timerState]);

  // Save sessions to localStorage
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('workoutTimerSessions', JSON.stringify(sessions));
    } else {
      localStorage.removeItem('workoutTimerSessions');
    }
  }, [sessions]);

  // Timer effect with background support
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerState.isActive && timerState.timeLeft !== null && timerState.timeLeft > 0) {
      interval = setInterval(() => {
        setTimerState((prev) => {
          if (prev.timeLeft === null || prev.timeLeft <= 1) {
            // Timer completed
            handleTimerComplete(prev);
            return {
              ...prev,
              isActive: false,
              timeLeft: null
            };
          }
          
          const newTimeLeft = prev.timeLeft - 1;
          const elapsed = prev.startTime ? Date.now() - prev.startTime : 0;
          
          // Show notification at specific intervals
          if (newTimeLeft === 10 || newTimeLeft === 5 || newTimeLeft === 3) {
            showNotification({
              title: 'Timer Warning',
              body: `${newTimeLeft} seconds remaining!`,
              icon: '/icons/timer-192.png',
              badge: '/icons/badge-72.png',
              tag: 'timer-warning',
              vibrate: [100]
            });
          }
          
          return {
            ...prev,
            timeLeft: newTimeLeft,
            totalElapsed: elapsed
          };
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerState.isActive, timerState.timeLeft, showNotification]);

  const handleTimerComplete = async (state: TimerState) => {
    try {
      // Update current session
      if (currentSession) {
        const completedSession = {
          ...currentSession,
          endTime: Date.now()
        };
        
        const updatedSessions = [...sessions.filter(s => s.id !== currentSession.id), completedSession];
        setSessions(updatedSessions);
        
        // Save to offline storage for sync
        await offlineStorage.addToSyncQueue({
          type: 'workout',
          action: 'create',
          data: completedSession
        });
      }

      // Show completion notification
      const message = state.type === 'rest' 
        ? 'Rest time is over. Ready for the next set?' 
        : 'Timer completed!';
        
      await showNotification({
        title: state.type === 'rest' ? 'Rest Complete' : 'Timer Complete',
        body: message,
        icon: state.type === 'rest' ? '/icons/workout-192.png' : '/icons/timer-192.png',
        badge: '/icons/badge-72.png',
        tag: `timer-complete-${state.type}`,
        requireInteraction: state.type === 'rest',
        actions: state.type === 'rest' ? [
          { action: 'continue', title: 'Continue Workout' },
          { action: 'extend', title: 'Extend Rest' }
        ] : [],
        vibrate: [200, 100, 200]
      });

      // Clean up
      setCurrentSession(null);
      localStorage.removeItem('workoutTimerState');
      
    } catch (error) {
      console.error('[WorkoutTimer] Failed to handle timer completion:', error);
    }
  };

  const startTimer = useCallback(async (seconds: number, type: TimerState['type'] = 'custom', metadata?: {
    exerciseId?: string;
    workoutId?: string;
  }) => {
    const session: TimerSession = {
      id: crypto.randomUUID(),
      type,
      startTime: Date.now(),
      duration: seconds,
      exerciseId: metadata?.exerciseId,
      workoutId: metadata?.workoutId
    };

    setCurrentSession(session);
    setTimerState({
      timeLeft: seconds,
      isActive: true,
      startTime: Date.now(),
      totalElapsed: 0,
      type
    });

    // Start background sync if available
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('timer-sync');
      } catch (error) {
        console.log('[WorkoutTimer] Background sync not available');
      }
    }
  }, []);

  const pauseTimer = useCallback(() => {
    setTimerState(prev => ({
      ...prev,
      isActive: false
    }));
  }, []);

  const resumeTimer = useCallback(() => {
    if (timerState.timeLeft !== null && timerState.timeLeft > 0) {
      setTimerState(prev => ({
        ...prev,
        isActive: true,
        startTime: Date.now() - (prev.totalElapsed || 0)
      }));
    }
  }, [timerState.timeLeft]);

  const stopTimer = useCallback(async () => {
    // Complete current session if active
    if (currentSession && timerState.isActive) {
      const completedSession = {
        ...currentSession,
        endTime: Date.now()
      };
      
      const updatedSessions = [...sessions.filter(s => s.id !== currentSession.id), completedSession];
      setSessions(updatedSessions);
      
      // Save to offline storage
      await offlineStorage.addToSyncQueue({
        type: 'workout',
        action: 'create',
        data: completedSession
      });
    }

    setTimerState({
      timeLeft: null,
      isActive: false,
      startTime: null,
      totalElapsed: 0,
      type: 'custom'
    });
    setCurrentSession(null);
    localStorage.removeItem('workoutTimerState');
  }, [currentSession, sessions, timerState.isActive]);

  const addTime = useCallback((seconds: number) => {
    setTimerState(prev => ({
      ...prev,
      timeLeft: (prev.timeLeft || 0) + seconds
    }));
  }, []);

  const getFormattedTime = useCallback((seconds?: number) => {
    const time = seconds !== undefined ? seconds : timerState.timeLeft;
    if (time === null) return '00:00';
    
    const minutes = Math.floor(time / 60);
    const secs = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [timerState.timeLeft]);

  const getTotalWorkoutTime = useCallback(() => {
    return sessions.reduce((total, session) => {
      const duration = session.endTime 
        ? session.endTime - session.startTime
        : Date.now() - session.startTime;
      return total + duration;
    }, 0);
  }, [sessions]);

  const clearSessions = useCallback(async () => {
    setSessions([]);
    setCurrentSession(null);
    localStorage.removeItem('workoutTimerSessions');
  }, []);

  return {
    // Timer state
    timeLeft: timerState.timeLeft,
    isActive: timerState.isActive,
    type: timerState.type,
    totalElapsed: timerState.totalElapsed,
    
    // Timer controls
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    addTime,
    
    // Utilities
    getFormattedTime,
    getTotalWorkoutTime,
    
    // Session management
    sessions,
    currentSession,
    clearSessions
  };
}

export function useRestTimer(defaultRestTime: number = 60) {
  const timer = useWorkoutTimer();
  const [totalRestTime, setTotalRestTime] = useState(0);

  const startRest = useCallback(
    async (customTime?: number, metadata?: { exerciseId?: string; workoutId?: string }) => {
      const restTime = customTime || defaultRestTime;
      setTotalRestTime(prev => prev + restTime);
      
      await timer.startTimer(restTime, 'rest', metadata);
      
      // Show rest start notification
      await (async () => {
        try {
          const { showNotification } = await import('./useNotifications');
          await showNotification().showNotification({
            title: 'Rest Time',
            body: `Take a ${Math.floor(restTime / 60)} minute break!`,
            icon: '/icons/timer-192.png',
            badge: '/icons/badge-72.png',
            tag: 'rest-start'
          });
        } catch (error) {
          console.log('[RestTimer] Notification not available');
        }
      })();
    },
    [timer, defaultRestTime],
  );

  const skipRest = useCallback(() => {
    timer.stopTimer();
  }, [timer]);

  const addRestTime = useCallback(
    (seconds: number) => {
      timer.addTime(seconds);
      setTotalRestTime(prev => prev + seconds);
    },
    [timer],
  );

  const extendRest = useCallback(
    async (additionalSeconds: number) => {
      addRestTime(additionalSeconds);
      
      // Show extension notification
      try {
        const { showNotification } = await import('./useNotifications');
        await showNotification().showNotification({
          title: 'Rest Extended',
          body: `Added ${Math.floor(additionalSeconds / 60)} minute${additionalSeconds >= 120 ? 's' : ''} to your rest!`,
          icon: '/icons/timer-192.png',
          badge: '/icons/badge-72.png',
          tag: 'rest-extended'
        });
      } catch (error) {
        console.log('[RestTimer] Notification not available');
      }
    },
    [addRestTime],
  );

  return {
    ...timer,
    startRest,
    skipRest,
    addRestTime,
    extendRest,
    totalRestTime
  };
}

// Hook for workout timer statistics
export function useWorkoutTimerStats() {
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalWorkoutTime: 0,
    averageSessionTime: 0,
    longestSession: 0,
    thisWeek: 0,
    thisMonth: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const sessions = JSON.parse(localStorage.getItem('workoutTimerSessions') || '[]');
        
        if (sessions.length === 0) {
          setStats({
            totalWorkouts: 0,
            totalWorkoutTime: 0,
            averageSessionTime: 0,
            longestSession: 0,
            thisWeek: 0,
            thisMonth: 0
          });
          return;
        }

        const now = Date.now();
        const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);
        
        let totalTime = 0;
        let longestTime = 0;
        let weekTime = 0;
        let monthTime = 0;

        sessions.forEach((session: TimerSession) => {
          const duration = session.endTime 
            ? session.endTime - session.startTime
            : now - session.startTime;
          
          totalTime += duration;
          longestTime = Math.max(longestTime, duration);
          
          if (session.startTime >= oneWeekAgo) {
            weekTime += duration;
          }
          
          if (session.startTime >= oneMonthAgo) {
            monthTime += duration;
          }
        });

        setStats({
          totalWorkouts: sessions.length,
          totalWorkoutTime: totalTime,
          averageSessionTime: Math.floor(totalTime / sessions.length),
          longestSession: longestTime,
          thisWeek: weekTime,
          thisMonth: monthTime
        });
      } catch (error) {
        console.error('[WorkoutTimerStats] Failed to load stats:', error);
      }
    };

    loadStats();
  }, []);

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  return {
    ...stats,
    formatDuration
  };
}