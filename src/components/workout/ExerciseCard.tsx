import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  order_index: number;
  rest_time: number | null;
  notes?: string;
  video_url?: string;
}

interface ExerciseCardProps {
  exercise: Exercise;
  isActive?: boolean;
  isCompleted?: boolean;
}

export function ExerciseCard({ exercise, isActive = false, isCompleted = false }: ExerciseCardProps) {
  const cardVariant = isCompleted ? 'exercise-completed' : isActive ? 'exercise-active' : 'exercise-inactive';

  return (
    <Card variant={cardVariant} className="mb-4">
      <CardContent className="p-4">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h3 className="mb-1 font-display text-lg font-semibold text-foreground">
              {exercise.name}
            </h3>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{exercise.sets} séries</span>
              <span>•</span>
              <span>{exercise.reps} reps</span>
              <span>•</span>
              <span>{exercise.rest_time || 60}s descanso</span>
            </div>
          </div>
          {isCompleted && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/20">
              <Check className="h-4 w-4 text-success" />
            </div>
          )}
        </div>

        {exercise.notes && (
          <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent mb-2">
            💡 {exercise.notes}
          </p>
        )}

        {exercise.video_url && (
          <a
            href={exercise.video_url}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-primary hover:underline"
          >
            Ver vídeo demonstrativo
          </a>
        )}
      </CardContent>
    </Card>
  );
}