// Edge Function para processamento de analytics
// Processa dados de treino e gera relatórios avançados

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

interface WorkoutLog {
  id: string;
  student_id: string;
  completed_at: string;
  duration_minutes: number;
  exercise_logs: Array<{
    reps: number;
    weight: number;
    completed: boolean;
    exercises?: {
      name: string;
    };
  }>;
}

interface AnalyticsRequest {
  type: 'workout_analytics' | 'student_progress' | 'trainer_summary';
  student_id?: string;
  trainer_id?: string;
  date_range?: {
    start: string;
    end: string;
  };
}

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'false'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const requestData: AnalyticsRequest = await req.json();
    const { type, student_id, trainer_id, date_range } = requestData;

    // Mock data for demonstration - in real implementation, fetch from Supabase
    const mockWorkoutLogs: WorkoutLog[] = [
      {
        id: '1',
        student_id: student_id || 'student-1',
        completed_at: '2024-01-15T10:00:00Z',
        duration_minutes: 45,
        exercise_logs: [
          {
            reps: 10,
            weight: 80,
            completed: true,
            exercises: { name: 'Supino Reto' }
          },
          {
            reps: 12,
            weight: 60,
            completed: true,
            exercises: { name: 'Agachamento' }
          }
        ]
      },
      {
        id: '2',
        student_id: student_id || 'student-1',
        completed_at: '2024-01-12T14:30:00Z',
        duration_minutes: 50,
        exercise_logs: [
          {
            reps: 8,
            weight: 90,
            completed: true,
            exercises: { name: 'Supino Reto' }
          }
        ]
      }
    ];

    let analytics = {};

    switch (type) {
      case 'workout_analytics':
        analytics = processWorkoutAnalytics(mockWorkoutLogs);
        break;
      case 'student_progress':
        analytics = processStudentProgress(mockWorkoutLogs);
        break;
      case 'trainer_summary':
        analytics = processTrainerSummary(mockWorkoutLogs);
        break;
      default:
        throw new Error('Invalid analytics type');
    }

    return new Response(JSON.stringify({ data: analytics }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    const errorResponse = {
      error: {
        code: 'ANALYTICS_ERROR',
        message: error.message
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

function processWorkoutAnalytics(logs: WorkoutLog[]) {
  const totalWorkouts = logs.length;
  const totalVolume = logs.reduce((sum, log) => {
    return sum + log.exercise_logs.reduce((logSum, exLog) => {
      return logSum + (exLog.weight * exLog.reps);
    }, 0);
  }, 0);

  const averageDuration = logs.reduce((sum, log) => sum + log.duration_minutes, 0) / totalWorkouts;

  // Calculate personal records
  const personalRecords = new Map<string, { weight: number; reps: number; date: string }>();
  
  logs.forEach(log => {
    log.exercise_logs.forEach(exLog => {
      if (exLog.completed && exLog.weight > 0) {
        const exerciseName = exLog.exercises?.name || 'Exercício';
        const current = personalRecords.get(exerciseName);
        
        if (!current || exLog.weight > current.weight) {
          personalRecords.set(exerciseName, {
            weight: exLog.weight,
            reps: exLog.reps,
            date: log.completed_at
          });
        }
      }
    });
  });

  // Weekly progression
  const weeklyData = Array.from({ length: 4 }, (_, i) => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
    const weekEnd = new Date();
    weekEnd.setDate(weekEnd.getDate() - i * 7);
    
    const weekLogs = logs.filter(log => {
      const logDate = new Date(log.completed_at);
      return logDate >= weekStart && logDate <= weekEnd;
    });

    const weekVolume = weekLogs.reduce((sum, log) => {
      return sum + log.exercise_logs.reduce((logSum, exLog) => {
        return logSum + (exLog.weight * exLog.reps);
      }, 0);
    }, 0);

    return {
      week: `${weekStart.toLocaleDateString('pt-BR')} - ${weekEnd.toLocaleDateString('pt-BR')}`,
      workouts: weekLogs.length,
      volume: Math.round(weekVolume)
    };
  });

  return {
    summary: {
      total_workouts: totalWorkouts,
      total_volume: Math.round(totalVolume),
      average_duration: Math.round(averageDuration),
      personal_records_count: personalRecords.size
    },
    personal_records: Array.from(personalRecords.entries()).map(([exercise, data]) => ({
      exercise,
      weight: data.weight,
      reps: data.reps,
      date: data.date
    })),
    weekly_progression: weeklyData.reverse()
  };
}

function processStudentProgress(logs: WorkoutLog[]) {
  const monthlyProgress = {
    this_month: 0,
    last_month: 0,
    growth_rate: 0
  };

  const now = new Date();
  const thisMonth = now.getMonth();
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;

  const thisMonthLogs = logs.filter(log => {
    const date = new Date(log.completed_at);
    return date.getMonth() === thisMonth && date.getFullYear() === now.getFullYear();
  });

  const lastMonthLogs = logs.filter(log => {
    const date = new Date(log.completed_at);
    return date.getMonth() === lastMonth && 
           (thisMonth === 0 ? date.getFullYear() === now.getFullYear() - 1 : date.getFullYear() === now.getFullYear());
  });

  monthlyProgress.this_month = thisMonthLogs.length;
  monthlyProgress.last_month = lastMonthLogs.length;
  
  if (lastMonthLogs.length > 0) {
    monthlyProgress.growth_rate = Math.round(
      ((thisMonthLogs.length - lastMonthLogs.length) / lastMonthLogs.length) * 100
    );
  }

  // Streak calculation
  const streak = calculateStreak(logs);

  return {
    monthly_progress: monthlyProgress,
    streak,
    consistency_score: calculateConsistencyScore(logs),
    strength_progression: calculateStrengthProgression(logs)
  };
}

function processTrainerSummary(logs: WorkoutLog[]) {
  const totalStudents = new Set(logs.map(log => log.student_id)).size;
  const activeStudents = totalStudents; // Mock - all students are active
  
  const averageWorkoutsPerStudent = totalStudents > 0 ? logs.length / totalStudents : 0;
  
  const engagementScore = calculateEngagementScore(logs);

  const topExercises = calculateTopExercises(logs);

  return {
    overview: {
      total_students: totalStudents,
      active_students: activeStudents,
      total_workouts: logs.length,
      average_workouts_per_student: Math.round(averageWorkoutsPerStudent * 10) / 10
    },
    engagement_score: engagementScore,
    top_exercises: topExercises,
    weekly_summary: generateWeeklySummary(logs)
  };
}

function calculateStreak(logs: WorkoutLog[]): number {
  if (logs.length === 0) return 0;
  
  const sortedLogs = logs
    .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());
  
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  for (const log of sortedLogs) {
    const logDate = new Date(log.completed_at);
    logDate.setHours(0, 0, 0, 0);
    
    if (logDate.getTime() === currentDate.getTime()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (logDate.getTime() < currentDate.getTime()) {
      break;
    }
  }
  
  return streak;
}

function calculateConsistencyScore(logs: WorkoutLog[]): number {
  if (logs.length === 0) return 0;
  
  // Calculate how consistent the workout frequency is
  const intervals = [];
  
  for (let i = 1; i < logs.length; i++) {
    const prevDate = new Date(logs[i - 1].completed_at);
    const currDate = new Date(logs[i].completed_at);
    const diffDays = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
    intervals.push(Math.abs(diffDays));
  }
  
  if (intervals.length === 0) return 0;
  
  const averageInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
  const targetInterval = 2; // Target: every 2 days
  
  // Score decreases as the average interval deviates from target
  const score = Math.max(0, 100 - (Math.abs(averageInterval - targetInterval) * 10));
  
  return Math.round(score);
}

function calculateStrengthProgression(logs: WorkoutLog[]) {
  const exerciseProgress = new Map<string, Array<{ date: string; weight: number }>>();
  
  logs.forEach(log => {
    log.exercise_logs.forEach(exLog => {
      if (exLog.completed && exLog.weight > 0) {
        const exerciseName = exLog.exercises?.name || 'Exercício';
        
        if (!exerciseProgress.has(exerciseName)) {
          exerciseProgress.set(exerciseName, []);
        }
        
        exerciseProgress.get(exerciseName)!.push({
          date: log.completed_at,
          weight: exLog.weight
        });
      }
    });
  });
  
  return Array.from(exerciseProgress.entries()).map(([exercise, data]) => ({
    exercise,
    progression: data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }));
}

function calculateEngagementScore(logs: WorkoutLog[]): number {
  if (logs.length === 0) return 0;
  
  // Factors: frequency, consistency, improvement
  const recentLogs = logs.filter(log => {
    const logDate = new Date(log.completed_at);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return logDate >= thirtyDaysAgo;
  });
  
  const frequency = Math.min(100, (recentLogs.length / 15) * 100); // Max 100% for 15+ workouts in 30 days
  const consistency = calculateConsistencyScore(logs);
  const improvement = calculateImprovementScore(logs);
  
  return Math.round((frequency + consistency + improvement) / 3);
}

function calculateImprovementScore(logs: WorkoutLog[]): number {
  if (logs.length < 2) return 0;
  
  // Compare recent workouts with older ones
  const sortedLogs = logs.sort((a, b) => new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime());
  
  const midPoint = Math.floor(sortedLogs.length / 2);
  const recentLogs = sortedLogs.slice(midPoint);
  const olderLogs = sortedLogs.slice(0, midPoint);
  
  const recentAvgWeight = recentLogs.reduce((sum, log) => {
    const avgWeight = log.exercise_logs.reduce((logSum, exLog) => {
      return logSum + exLog.weight;
    }, 0) / log.exercise_logs.length;
    return sum + avgWeight;
  }, 0) / recentLogs.length;
  
  const olderAvgWeight = olderLogs.reduce((sum, log) => {
    const avgWeight = log.exercise_logs.reduce((logSum, exLog) => {
      return logSum + exLog.weight;
    }, 0) / log.exercise_logs.length;
    return sum + avgWeight;
  }, 0) / olderLogs.length;
  
  if (olderAvgWeight === 0) return 0;
  
  const improvementRate = ((recentAvgWeight - olderAvgWeight) / olderAvgWeight) * 100;
  
  return Math.min(100, Math.max(0, 50 + improvementRate));
}

function calculateTopExercises(logs: WorkoutLog[]) {
  const exerciseCount = new Map<string, number>();
  
  logs.forEach(log => {
    log.exercise_logs.forEach(exLog => {
      if (exLog.completed) {
        const exerciseName = exLog.exercises?.name || 'Exercício';
        exerciseCount.set(exerciseName, (exerciseCount.get(exerciseName) || 0) + 1);
      }
    });
  });
  
  return Array.from(exerciseCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([exercise, count]) => ({ exercise, count }));
}

function generateWeeklySummary(logs: WorkoutLog[]) {
  const weeks = Array.from({ length: 4 }, (_, i) => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
    const weekEnd = new Date();
    weekEnd.setDate(weekEnd.getDate() - i * 7);
    
    const weekLogs = logs.filter(log => {
      const logDate = new Date(log.completed_at);
      return logDate >= weekStart && logDate <= weekEnd;
    });
    
    return {
      week: `${weekStart.toLocaleDateString('pt-BR')} - ${weekEnd.toLocaleDateString('pt-BR')}`,
      workouts: weekLogs.length,
      unique_students: new Set(weekLogs.map(log => log.student_id)).size,
      total_volume: weekLogs.reduce((sum, log) => {
        return sum + log.exercise_logs.reduce((logSum, exLog) => {
          return logSum + (exLog.weight * exLog.reps);
        }, 0);
      }, 0)
    };
  });
  
  return weeks.reverse();
}