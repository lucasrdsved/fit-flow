import { LoginForm } from '@/components/auth/LoginForm';
import { AuthLayout } from '@/components/layout/AuthLayout';

export default function Login() {
  return (
    <AuthLayout
      title="Área do Aluno"
      description="Entre para acessar seus treinos e evoluir"
    >
      <LoginForm onSuccess={() => {}} />
      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground">
          Ainda não tem acesso? Fale com seu Personal Trainer.
        </p>
      </div>
    </AuthLayout>
  );
}