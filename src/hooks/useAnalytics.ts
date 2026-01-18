import { useMemo } from 'react';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface WorkoutLog {
  id: string;
  completed_at: string;
  duration_minutes: number;
  difficulty_rating: number;
  exercise_logs: Array<{
    reps: number;
    weight: number;
    completed: boolean;
    exercises?: {
      name: string;
    };
  }>;
}

interface StudentAnalyticsData {
  weeklyProgress: Array<{ day: string; workouts: number; volume: number }>;
  monthlyVolume: Array<{ name: string; value: number }>;
  personalRecords: Array<{ exercise: string; weight: number; reps: number; date: string }>;
  weightProgression: Array<{ name: string; weight: number; volume: number }>;
  exerciseDistribution: Array<{ name: string; value: number }>;
  adherenceData: Array<{ name: string; workouts: number; target: number }>;
}

export function useStudentAnalytics(logs: WorkoutLog[]): StudentAnalyticsData {
  return useMemo(() => {
    if (!logs || logs.length === 0) {
      return {
        weeklyProgress: [],
        monthlyVolume: [],
        personalRecords: [],
        weightProgression: [],
        exerciseDistribution: [],
        adherenceData: []
      };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // 1. Weekly Progress (Last 7 days)
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const weeklyProgress = weekDays.map(day => {
      const dayLogs = logs.filter(log => {
        const logDate = new Date(log.completed_at);
        return logDate.toDateString() === day.toDateString();
      });

      const dayVolume = dayLogs.reduce((total, log) => {
        const volume = log.exercise_logs?.reduce((sum, exLog) => {
          return sum + ((exLog.weight || 0) * (exLog.reps || 0));
        }, 0) || 0;
        return total + volume;
      }, 0);

      return {
        day: format(day, 'EEE', { locale: ptBR }),
        workouts: dayLogs.length,
        volume: Math.round(dayVolume)
      };
    });

    // 2. Monthly Volume (Last 4 weeks)
    const monthlyVolume = Array.from({ length: 4 }, (_, i) => {
      const weekStart = subDays(now, (i + 1) * 7);
      const weekEnd = subDays(now, i * 7);
      
      const weekLogs = logs.filter(log => {
        const logDate = new Date(log.completed_at);
        return logDate >= weekStart && logDate <= weekEnd;
      });

      const volume = weekLogs.reduce((total, log) => {
        const weekVolume = log.exercise_logs?.reduce((sum, exLog) => {
          return sum + ((exLog.weight || 0) * (exLog.reps || 0));
        }, 0) || 0;
        return total + weekVolume;
      }, 0);

      return {
        name: `${format(weekStart, 'dd/MM')} - ${format(weekEnd, 'dd/MM')}`,
        value: Math.round(volume / 1000 * 10) / 10 // Convert to tons, 1 decimal
      };
    }).reverse();

    // 3. Personal Records (Top 5 heaviest weights)
    const recordsMap = new Map<string, { weight: number; reps: number; date: string }>();
    
    logs.forEach(log => {
      log.exercise_logs?.forEach(exLog => {
        if (exLog.completed && exLog.weight > 0) {
          const exerciseName = exLog.exercises?.name || 'Exercício';
          const current = recordsMap.get(exerciseName);
          
          if (!current || exLog.weight > current.weight) {
            recordsMap.set(exerciseName, {
              weight: exLog.weight,
              reps: exLog.reps,
              date: log.completed_at
            });
          }
        }
      });
    });

    const personalRecords = Array.from(recordsMap.entries())
      .map(([exercise, data]) => ({
        exercise,
        weight: data.weight,
        reps: data.reps,
        date: data.date
      }))
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 5);

    // 4. Weight Progression (Last 8 weeks)
    const weightProgression = Array.from({ length: 8 }, (_, i) => {
      const weekStart = subDays(now, (i + 1) * 7);
      const weekEnd = subDays(now, i * 7);
      
      const weekLogs = logs.filter(log => {
        const logDate = new Date(log.completed_at);
        return logDate >= weekStart && logDate <= weekEnd;
      });

      const totalWeight = weekLogs.reduce((total, log) => {
        const weight = log.exercise_logs?.reduce((sum, exLog) => {
          return sum + (exLog.weight || 0);
        }, 0) || 0;
        return total + weight;
      }, 0);

      const avgWeight = weekLogs.length > 0 ? totalWeight / weekLogs.length : 0;

      return {
        name: format(weekStart, 'dd/MM'),
        weight: Math.round(avgWeight * 10) / 10,
        volume: Math.round(totalWeight)
      };
    }).reverse();

    // 5. Exercise Distribution (Top exercises)
    const exerciseCount = new Map<string, number>();
    
    logs.forEach(log => {
      log.exercise_logs?.forEach(exLog => {
        if (exLog.completed) {
          const exerciseName = exLog.exercises?.name || 'Exercício';
          exerciseCount.set(exerciseName, (exerciseCount.get(exerciseName) || 0) + 1);
        }
      });
    });

    const exerciseDistribution = Array.from(exerciseCount.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    // 6. Adherence Data (Weekly target vs actual)
    const adherenceData = Array.from({ length: 4 }, (_, i) => {
      const weekStart = subDays(now, (i + 1) * 7);
      const weekEnd = subDays(now, i * 7);
      
      const weekLogs = logs.filter(log => {
        const logDate = new Date(log.completed_at);
        return logDate >= weekStart && logDate <= weekEnd;
      });

      return {
        name: format(weekStart, 'dd/MM'),
        workouts: weekLogs.length,
        target: 4 // Target: 4 workouts per week
      };
    }).reverse();

    return {
      weeklyProgress,
      monthlyVolume,
      personalRecords,
      weightProgression,
      exerciseDistribution,
      adherenceData
    };
  }, [logs]);
}

export function useTrainerAnalytics(students: StudentRecord[], logs: WorkoutLog[]): StudentAnalyticsData {
  return useMemo(() => {
    if (!students.length || !logs.length) {
      return {
        weeklyProgress: [],
        monthlyVolume: [],
        personalRecords: [],
        weightProgression: [],
        exerciseDistribution: [],
        adherenceData: []
      };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filter logs for current month
    const monthLogs = logs.filter(log => {
      const date = new Date(log.completed_at);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    // 1. Weekly Progress for all students
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const weeklyProgress = weekDays.map(day => {
      const dayLogs = monthLogs.filter(log => {
        const logDate = new Date(log.completed_at);
        return logDate.toDateString() === day.toDateString();
      });

      return {
        day: format(day, 'EEE', { locale: ptBR }),
        workouts: dayLogs.length,
        volume: dayLogs.reduce((total, log) => {
          const volume = log.exercise_logs?.reduce((sum, exLog) => {
            return sum + ((exLog.weight || 0) * (exLog.reps || 0));
          }, 0) || 0;
          return total + volume;
        }, 0)
      };
    });

    // 2. Student Engagement
    const monthlyVolume = Array.from({ length: 4 }, (_, i) => {
      const weekStart = subDays(now, (i + 1) * 7);
      const weekEnd = subDays(now, i * 7);
      
      const weekLogs = logs.filter(log => {
        const logDate = new Date(log.completed_at);
        return logDate >= weekStart && logDate <= weekEnd;
      });

      const volume = weekLogs.reduce((total, log) => {
        const weekVolume = log.exercise_logs?.reduce((sum, exLog) => {
          return sum + ((exLog.weight || 0) * (exLog.reps || 0));
        }, 0) || 0;
        return total + weekVolume;
      }, 0);

      return {
        name: `${format(weekStart, 'dd/MM')} - ${format(weekEnd, 'dd/MM')}`,
        value: Math.round(volume / 1000 * 10) / 10
      };
    }).reverse();

    // 3. Personal Records across all students
    const recordsMap = new Map<string, { weight: number; reps: number; date: string }>();
    
    logs.forEach(log => {
      log.exercise_logs?.forEach(exLog => {
        if (exLog.completed && exLog.weight > 0) {
          const exerciseName = exLog.exercises?.name || 'Exercício';
          const current = recordsMap.get(exerciseName);
          
          if (!current || exLog.weight > current.weight) {
            recordsMap.set(exerciseName, {
              weight: exLog.weight,
              reps: exLog.reps,
              date: log.completed_at
            });
          }
        }
      });
    });

    const personalRecords = Array.from(recordsMap.entries())
      .map(([exercise, data]) => ({
        exercise,
        weight: data.weight,
        reps: data.reps,
        date: data.date
      }))
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 5);

    // 4. Weight Progression
    const weightProgression = Array.from({ length: 8 }, (_, i) => {
      const weekStart = subDays(now, (i + 1) * 7);
      const weekEnd = subDays(now, i * 7);
      
      const weekLogs = logs.filter(log => {
        const logDate = new Date(log.completed_at);
        return logDate >= weekStart && logDate <= weekEnd;
      });

      const totalWeight = weekLogs.reduce((total, log) => {
        const weight = log.exercise_logs?.reduce((sum, exLog) => {
          return sum + (exLog.weight || 0);
        }, 0) || 0;
        return total + weight;
      }, 0);

      const avgWeight = weekLogs.length > 0 ? totalWeight / weekLogs.length : 0;

      return {
        name: format(weekStart, 'dd/MM'),
        weight: Math.round(avgWeight * 10) / 10,
        volume: Math.round(totalWeight)
      };
    }).reverse();

    // 5. Exercise Distribution
    const exerciseCount = new Map<string, number>();
    
    logs.forEach(log => {
      log.exercise_logs?.forEach(exLog => {
        if (exLog.completed) {
          const exerciseName = exLog.exercises?.name || 'Exercício';
          exerciseCount.set(exerciseName, (exerciseCount.get(exerciseName) || 0) + 1);
        }
      });
    });

    const exerciseDistribution = Array.from(exerciseCount.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    // 6. Student Adherence
    const adherenceData = Array.from({ length: 4 }, (_, i) => {
      const weekStart = subDays(now, (i + 1) * 7);
      const weekEnd = subDays(now, i * 7);
      
      const weekLogs = logs.filter(log => {
        const logDate = new Date(log.completed_at);
        return logDate >= weekStart && logDate <= weekEnd;
      });

      return {
        name: format(weekStart, 'dd/MM'),
        workouts: weekLogs.length,
        target: students.length * 4 // Target: 4 workouts per student per week
      };
    }).reverse();

    return {
      weeklyProgress,
      monthlyVolume,
      personalRecords,
      weightProgression,
      exerciseDistribution,
      adherenceData
    };
  }, [students, logs]);
}