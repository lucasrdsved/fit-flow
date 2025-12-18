import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Dumbbell, 
  TrendingUp, 
  User
} from "lucide-react";
import { motion } from "framer-motion";

const studentNavItems = [
  { icon: Home, label: "Início", href: "/student" },
  { icon: Dumbbell, label: "Treino", href: "/student/workout" },
  { icon: TrendingUp, label: "Progresso", href: "/student/progress" },
  { icon: User, label: "Perfil", href: "/student/profile" },
];

export function StudentBottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong safe-bottom">
      <div className="flex items-center justify-around px-2 py-1">
        {studentNavItems.map((item) => {
          const isActive = location.pathname === item.href ||
            (item.href !== "/student" && location.pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all duration-200 min-w-[64px]",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/10 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <item.icon className={cn(
                "h-6 w-6 mb-0.5 relative z-10 transition-transform",
                isActive && "scale-110"
              )} />
              <span className={cn(
                "text-[10px] font-medium relative z-10",
                isActive && "font-semibold"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
