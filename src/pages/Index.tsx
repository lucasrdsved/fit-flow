import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Dumbbell, Users, Eye, EyeOff, Loader2, Zap } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();
  const { signIn, signUp, mockLogin, user, userType } = useAuth();
  const { toast } = useToast();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedType, setSelectedType] = useState<'personal' | 'student'>('student');

  // Redirect if already logged in
  if (user && userType) {
    const redirectPath = userType === 'personal' ? '/trainer' : '/student';
    navigate(redirectPath, { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            variant: 'destructive',
            title: 'Erro no login',
            description: error.message || 'Verifique suas credenciais',
          });
        } else {
          toast({
            title: 'Login realizado!',
            description: 'Redirecionando...',
          });
        }
      } else {
        const { error } = await signUp(email, password, name, selectedType);
        if (error) {
          toast({
            variant: 'destructive',
            title: 'Erro no cadastro',
            description: error.message || 'Tente novamente',
          });
        } else {
          toast({
            title: 'Cadastro realizado!',
            description: 'Verifique seu email para confirmar a conta.',
          });
        }
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Algo deu errado. Tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMockLogin = (type: 'personal' | 'student') => {
    mockLogin(type);
    toast({
      title: `Login rápido como ${type === 'personal' ? 'Personal' : 'Aluno'}`,
      description: 'Usando dados de demonstração',
    });
    navigate(type === 'personal' ? '/trainer' : '/student');
  };

  return (
    <div className="bg-gradient-hero dark min-h-screen">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -left-20 top-1/2 h-60 w-60 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-40 w-40 rounded-full bg-energy/10 blur-2xl" />
      </div>

      <div className="relative flex min-h-screen flex-col">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-6"
        >
          <div className="flex items-center gap-3">
            <div className="bg-gradient-primary flex h-12 w-12 items-center justify-center rounded-xl shadow-glow">
              <Dumbbell className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl font-bold text-foreground">FitCoach</span>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="container mx-auto flex flex-1 items-center justify-center px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <div className="mb-8 text-center">
              <h1 className="mb-3 font-display text-3xl font-bold text-foreground md:text-4xl">
                {isLogin ? 'Bem-vindo de volta' : 'Criar conta'}
              </h1>
              <p className="text-muted-foreground">
                {isLogin ? 'Entre para acessar seus treinos' : 'Cadastre-se para começar'}
              </p>
            </div>

            {/* Login/Signup Form */}
            <div className="rounded-2xl border border-border/50 bg-card/50 p-6 shadow-lg backdrop-blur-xl">
              {!isLogin && (
                <Tabs
                  value={selectedType}
                  onValueChange={(v) => setSelectedType(v as 'personal' | 'student')}
                  className="mb-6"
                >
                  <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                    <TabsTrigger
                      value="student"
                      className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                    >
                      <Dumbbell className="mr-2 h-4 w-4" />
                      Aluno
                    </TabsTrigger>
                    <TabsTrigger
                      value="personal"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Personal
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">
                      Nome completo
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border-border/50 bg-muted/50"
                      required={!isLogin}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-border/50 bg-muted/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">
                    Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-border/50 bg-muted/50 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="bg-gradient-primary w-full hover:opacity-90"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isLogin ? 'Entrar' : 'Cadastrar'}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Login Buttons - Discrete at bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="container mx-auto px-4 py-6"
        >
          <div className="flex flex-col items-center gap-3">
            <p className="flex items-center gap-1 text-xs text-muted-foreground/60">
              <Zap className="h-3 w-3" />
              Acesso rápido para demonstração
            </p>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMockLogin('personal')}
                className="text-xs text-muted-foreground/70 hover:bg-primary/10 hover:text-primary"
              >
                <Users className="mr-1 h-3 w-3" />
                Demo Personal
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMockLogin('student')}
                className="text-xs text-muted-foreground/70 hover:bg-accent/10 hover:text-accent"
              >
                <Dumbbell className="mr-1 h-3 w-3" />
                Demo Aluno
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
