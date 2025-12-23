import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function useLogout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const logout = async () => {
    try {
      await signOut();
      toast({
        title: 'Sessão encerrada',
        description: 'Você foi desconectado com sucesso.',
      });
      navigate('/', { replace: true });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao sair',
        description: 'Ocorreu um problema ao encerrar sua sessão.',
      });
    }
  };

  return { logout };
}
