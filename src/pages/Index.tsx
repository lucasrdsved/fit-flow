import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dumbbell, Users, TrendingUp, Zap } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-hero dark">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute top-1/2 -left-20 h-60 w-60 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-40 w-40 rounded-full bg-energy/10 blur-2xl" />
        </div>

        <div className="relative container mx-auto px-4 py-8">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-16"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
                <Dumbbell className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-display text-2xl font-bold text-foreground">
                FitCoach
              </span>
            </div>
          </motion.header>

          {/* Hero Content */}
          <div className="max-w-4xl mx-auto text-center py-16 lg:py-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
                <Zap className="h-4 w-4" />
                PWA Offline-First
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 leading-tight"
            >
              Gestão de Treinos
              <br />
              <span className="text-gradient-primary">
                Simples e Poderosa
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              Plataforma completa para personal trainers gerenciarem alunos, 
              planos de treino e acompanharem o progresso. Funciona offline 
              durante os treinos.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/trainer">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  <Users className="mr-2 h-5 w-5" />
                  Sou Personal Trainer
                </Button>
              </Link>
              <Link to="/student">
                <Button variant="hero-accent" size="xl" className="w-full sm:w-auto">
                  <Dumbbell className="mr-2 h-5 w-5" />
                  Sou Aluno
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto pb-16"
          >
            {[
              {
                icon: Users,
                title: "Gestão de Alunos",
                description: "Cadastre alunos, atribua planos e acompanhe o progresso individual.",
                gradient: "bg-gradient-primary",
              },
              {
                icon: Dumbbell,
                title: "Treino Offline",
                description: "Alunos registram séries, peso e reps mesmo sem internet.",
                gradient: "bg-gradient-accent",
              },
              {
                icon: TrendingUp,
                title: "Métricas & PRs",
                description: "Visualize volume, frequência, recordes pessoais e evolução.",
                gradient: "bg-gradient-to-r from-energy to-energy/70",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                className="group relative p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300"
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
