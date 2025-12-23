import { useCallback } from 'react';
import { Check, Plus, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface SetLog {
  setNumber: number;
  reps: number;
  weight: number;
  completed: boolean;
}

interface SetLoggerProps {
  exerciseId: string;
  sets: SetLog[];
  currentSetIndex: number;
  onSetComplete: (setNumber: number, reps: number, weight: number) => Promise<void>;
  onUpdateSet: (setIndex: number, field: 'reps' | 'weight', delta: number) => void;
  isLogging?: boolean;
}

export function SetLogger({
  exerciseId,
  sets,
  currentSetIndex,
  onSetComplete,
  onUpdateSet,
  isLogging = false,
}: SetLoggerProps) {
  const { toast } = useToast();

  const currentSet = sets[currentSetIndex];
  const isLastSet = currentSetIndex === sets.length - 1;

  const handleCompleteSet = useCallback(async () => {
    if (!currentSet || isLogging) return;

    try {
      await onSetComplete(currentSet.setNumber, currentSet.reps, currentSet.weight);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar série',
        description: 'Sua série não foi salva no banco de dados.',
      });
    }
  }, [currentSet, onSetComplete, isLogging, toast]);

  const updateValue = useCallback(
    (field: 'reps' | 'weight', delta: number) => {
      onUpdateSet(currentSetIndex, field, delta);
    },
    [currentSetIndex, onUpdateSet],
  );

  if (!currentSet) return null;

  return (
    <Card variant="elevated" className="mb-6">
      <CardContent className="p-5">
        <div className="mb-6 text-center">
          <Badge variant="sets" className="mb-2 px-4 py-1 text-lg">
            Série {currentSetIndex + 1} de {sets.length}
          </Badge>
          {!isLastSet && (
            <p className="text-xs text-muted-foreground mt-1">
              Próxima série após completar esta
            </p>
          )}
        </div>

        {/* Reps Counter */}
        <div className="mb-6">
          <p className="mb-3 text-center text-sm text-muted-foreground">Repetições</p>
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon-lg"
              onClick={() => updateValue('reps', -1)}
              disabled={isLogging}
            >
              <Minus className="h-6 w-6" />
            </Button>
            <div className="w-24 text-center">
              <span className="font-display text-5xl font-bold text-foreground">
                {currentSet.reps}
              </span>
            </div>
            <Button
              variant="outline"
              size="icon-lg"
              onClick={() => updateValue('reps', 1)}
              disabled={isLogging}
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Weight Input */}
        <div className="mb-6">
          <p className="mb-3 text-center text-sm text-muted-foreground">Peso (kg)</p>
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon-lg"
              onClick={() => updateValue('weight', -2.5)}
              disabled={isLogging}
            >
              <Minus className="h-6 w-6" />
            </Button>
            <div className="w-24 text-center">
              <span className="font-display text-5xl font-bold text-foreground">
                {currentSet.weight}
              </span>
            </div>
            <Button
              variant="outline"
              size="icon-lg"
              onClick={() => updateValue('weight', 2.5)}
              disabled={isLogging}
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Complete Set Button */}
        <Button
          variant="action"
          size="touch-lg"
          className="w-full"
          onClick={handleCompleteSet}
          disabled={isLogging}
        >
          {isLogging ? (
            'Salvando...'
          ) : (
            <>
              <Check className="mr-2 h-6 w-6" />
              Completar Série
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}