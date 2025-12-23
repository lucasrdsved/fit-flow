import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useCreateWorkout } from '@/hooks/useTrainerData';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Plus, Save, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const exerciseSchema = z.object({
  name: z.string().min(1, 'Nome do exercício é obrigatório'),
  sets: z
    .string()
    .transform((val) => Number(val))
    .pipe(z.number().min(1, 'Mínimo 1 série')),
  reps: z.string().min(1, 'Repetições são obrigatórias'),
  rest_time: z
    .string()
    .transform((val) => (val ? Number(val) : 0))
    .optional(),
  notes: z.string().optional(),
  video_url: z.string().url('URL inválida').optional().or(z.literal('')),
  order_index: z.number(),
});

const formSchema = z.object({
  title: z.string().min(2, 'Título deve ter pelo menos 2 caracteres'),
  description: z.string().optional(),
  workout_type: z.string().optional(),
  exercises: z.array(exerciseSchema),
});

export default function TrainerPlanEditor() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const createWorkout = useCreateWorkout();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      workout_type: '',
      exercises: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'exercises',
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createWorkout.mutateAsync({
        title: values.title,
        description: values.description,
        workout_type: values.workout_type,
        exercises: values.exercises.map((ex, index) => ({
          name: ex.name,
          sets: Number(ex.sets),
          reps: ex.reps,
          rest_time: ex.rest_time,
          notes: ex.notes,
          video_url: ex.video_url,
          order_index: index,
        })),
      });

      toast({
        title: 'Plano criado com sucesso!',
        description: 'O modelo de treino foi salvo.',
      });

      navigate('/trainer/plans');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar plano',
        description: 'Ocorreu um erro ao tentar salvar os dados.',
      });
    }
  }

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="mb-8">
        <Link
          to="/trainer/plans"
          className="mb-4 inline-flex items-center text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Voltar para Planos
        </Link>
        <h1 className="font-display text-2xl font-bold text-foreground lg:text-3xl">
          Novo Plano de Treino
        </h1>
        <p className="mt-1 text-muted-foreground">
          Crie um modelo de treino para reutilizar com seus alunos.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-4xl space-y-8">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título do Treino</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Treino A - Peito e Tríceps" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Instruções gerais para este treino..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="workout_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Treino</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Hipertrofia, Força, Cardio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Exercícios</h2>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  append({
                    name: '',
                    sets: 3 as any, // Cast for default value matching transform
                    reps: '10-12',
                    rest_time: '60' as any,
                    order_index: fields.length,
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Exercício
              </Button>
            </div>

            {fields.map((field, index) => (
              <Card key={field.id} variant="default">
                <CardContent className="p-4">
                  <div className="mb-4 flex items-start justify-between">
                    <Badge variant="outline" className="mb-2">
                      Exercício {index + 1}
                    </Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name={`exercises.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Exercício</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Supino Reto" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`exercises.${index}.video_url`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL do Vídeo (Opcional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://youtube.com/..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mb-4 grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`exercises.${index}.sets`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Séries</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`exercises.${index}.reps`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Repetições</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: 10-12" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`exercises.${index}.rest_time`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descanso (s)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`exercises.${index}.notes`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Focar na excêntrica" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            ))}

            {fields.length === 0 && (
              <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                Nenhum exercício adicionado. Clique no botão acima para começar.
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="ghost" onClick={() => navigate('/trainer/plans')}>
              Cancelar
            </Button>
            <Button type="submit" size="lg" disabled={createWorkout.isPending}>
              {createWorkout.isPending ? (
                <>Salvando...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Plano
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
