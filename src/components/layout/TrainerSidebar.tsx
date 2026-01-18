import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  Settings,
  Dumbbell,
  ChevronLeft,
  BarChart3,
  MessageCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useMessages } from '@/hooks/useMessages';

const trainerNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/trainer' },
  { icon: Users, label: 'Alunos', href: '/trainer/students' },
  { icon: ClipboardList, label: 'Planos', href: '/trainer/plans' },
  { icon: BarChart3, label: 'Analytics', href: '/trainer/analytics' },
  { icon: MessageCircle, label: 'Mensagens', href: '/trainer/messages' },
  { icon: Calendar, label: 'Agenda', href: '/trainer/calendar' },
  { icon: Dumbbell, label: 'Exercícios', href: '/trainer/exercises' },
  { icon: Settings, label: 'Config', href: '/trainer/settings' },
];

interface TrainerSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function TrainerSidebar({ collapsed = false, onToggle }: TrainerSidebarProps) {
  const location = useLocation();
  const { conversations } = useMessages();

  // Calculate unread messages count
  const unreadCount = conversations.reduce((total, conv) => total + conv.unread_count, 0);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r border-border bg-sidebar transition-all duration-300',
        collapsed ? 'w-[72px]' : 'w-64',
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <Link to="/trainer" className="flex items-center gap-3">
          <div className="bg-gradient-primary flex h-10 w-10 items-center justify-center rounded-xl">
            <Dumbbell className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-display text-lg font-bold"
            >
              FitCoach
            </motion.span>
          )}
        </Link>
        {onToggle && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onToggle}
            className={cn(
              collapsed && 'absolute -right-3 rounded-full border border-border bg-card',
            )}
          >
            <ChevronLeft
              className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')}
            />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-3">
        {trainerNavItems.map((item) => {
          const isActive =
            location.pathname === item.href ||
            (item.href !== '/trainer' && location.pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              )}
            >
              <item.icon
                className={cn('h-5 w-5 shrink-0', isActive && 'text-primary-foreground')}
              />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 }}
                >
                  {item.label}
                </motion.span>
              )}
              {item.href === '/trainer/messages' && unreadCount > 0 && !collapsed && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-2 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-white"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-border p-3">
        <div
          className={cn(
            'flex items-center gap-3 rounded-lg p-2',
            collapsed ? 'justify-center' : '',
          )}
        >
          <div className="bg-gradient-accent flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-accent-foreground">
            PT
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">Personal Trainer</p>
              <p className="truncate text-xs text-muted-foreground">trainer@fitcoach.app</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
