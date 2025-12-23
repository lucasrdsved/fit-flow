import { Link } from 'react-router-dom';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { AuthLayout } from '@/components/layout/AuthLayout';

export default function SignUp() {
  return (
    <AuthLayout
      title="Criar conta"
      description="Cadastre-se para começar sua jornada"
    >
      <SignUpForm onSuccess={() => {}} />
      <div className="mt-4 text-center">
        <Link
          to="/auth/login"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Já tem conta? Entre
        </Link>
      </div>
    </AuthLayout>
  );
}
