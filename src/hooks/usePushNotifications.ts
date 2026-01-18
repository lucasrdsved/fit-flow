import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface PushNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, any>;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  requireInteraction?: boolean;
  silent?: boolean;
}

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

class PushNotificationManager {
  private vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa40HI80NQDIXmZ8nBHY8lTqKQd2C1z5k8x9z7K3x5k2m3n4p5q6r7s8t9u0v1w2x3y4z5'; // Mock VAPID key - replace with real one
  private swRegistration: ServiceWorkerRegistration | null = null;

  async init(): Promise<boolean> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push messaging is not supported');
      return false;
    }

    try {
      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      this.swRegistration = registration;

      // Request notification permission
      const permission = await this.requestPermission();
      if (permission !== 'granted') {
        console.warn('Notification permission not granted');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
      return false;
    }
  }

  private async requestPermission(): Promise<NotificationPermission> {
    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        return await Notification.requestPermission();
      }
      return Notification.permission;
    }
    return 'denied';
  }

  async subscribe(): Promise<PushSubscription | null> {
    if (!this.swRegistration) {
      console.error('Service worker not registered');
      return null;
    }

    try {
      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
      });

      // Send subscription to server
      await this.sendSubscriptionToServer(subscription);

      return subscription.toJSON() as PushSubscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  }

  async unsubscribe(): Promise<boolean> {
    if (!this.swRegistration) return false;

    try {
      const subscription = await this.swRegistration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        // Notify server about unsubscription
        await this.removeSubscriptionFromServer(subscription.endpoint);
      }
      return true;
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
      return false;
    }
  }

  async showNotification(options: PushNotificationOptions): Promise<void> {
    if (!this.swRegistration) {
      // Fallback to native notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(options.title, {
          body: options.body,
          icon: options.icon,
          badge: options.badge,
          tag: options.tag,
          data: options.data,
          requireInteraction: options.requireInteraction,
          silent: options.silent
        });
      }
      return;
    }

    const registration = this.swRegistration;
    
    await registration.showNotification(options.title, {
      body: options.body,
      icon: options.icon || '/icon-192x192.png',
      badge: options.badge || '/icon-72x72.png',
      tag: options.tag,
      data: options.data,
      actions: options.actions,
      requireInteraction: options.requireInteraction,
      silent: options.silent,
      vibrate: [100, 50, 100],
      timestamp: Date.now()
    });
  }

  async scheduleWorkoutReminder(hour: number = 18, minute: number = 0): Promise<void> {
    const now = new Date();
    const reminderTime = new Date();
    reminderTime.setHours(hour, minute, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    const timeUntilReminder = reminderTime.getTime() - now.getTime();

    setTimeout(() => {
      this.showNotification({
        title: 'Hora do Treino! 💪',
        body: 'Está na hora de fazer seu treino diário. Vamos malhar?',
        tag: 'workout-reminder',
        requireInteraction: true,
        data: { type: 'workout_reminder' }
      });
    }, timeUntilReminder);
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    try {
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription,
          userAgent: navigator.userAgent
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send subscription to server');
      }
    } catch (error) {
      console.error('Error sending subscription to server:', error);
    }
  }

  private async removeSubscriptionFromServer(endpoint: string): Promise<void> {
    try {
      await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ endpoint }),
      });
    } catch (error) {
      console.error('Error removing subscription from server:', error);
    }
  }

  getCurrentSubscription(): Promise<PushSubscription | null> {
    if (!this.swRegistration) return Promise.resolve(null);

    return this.swRegistration.pushManager.getSubscription().then(subscription => {
      return subscription ? (subscription.toJSON() as PushSubscription) : null;
    });
  }

  isSupported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  }

  getPermissionStatus(): NotificationPermission {
    return 'Notification' in window ? Notification.permission : 'denied';
  }
}

// Singleton instance
export const pushNotificationManager = new PushNotificationManager();

// React Hook for Push Notifications
export function usePushNotifications() {
  const { toast } = useToast();
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    setIsSupported(pushNotificationManager.isSupported());
    setPermission(pushNotificationManager.getPermissionStatus());

    // Check current subscription status
    pushNotificationManager.getCurrentSubscription().then(subscription => {
      setIsSubscribed(!!subscription);
    });
  }, []);

  const initialize = async (): Promise<boolean> => {
    const success = await pushNotificationManager.init();
    if (success) {
      setPermission('granted');
      toast({
        title: 'Notificações ativadas! 🔔',
        description: 'Você receberá lembretes de treino e atualizações.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Falha ao ativar notificações',
        description: 'Seu navegador pode não suportar notificações push.',
      });
    }
    return success;
  };

  const subscribe = async (): Promise<boolean> => {
    try {
      const subscription = await pushNotificationManager.subscribe();
      setIsSubscribed(!!subscription);
      
      if (subscription) {
        toast({
          title: 'Inscrição concluída! ✅',
          description: 'Você receberá notificações do FitFlow.',
        });
        return true;
      } else {
        toast({
          variant: 'destructive',
          title: 'Falha na inscrição',
          description: 'Não foi possível se inscrever nas notificações.',
        });
        return false;
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        variant: 'destructive',
        title: 'Erro na inscrição',
        description: 'Ocorreu um erro ao se inscrever nas notificações.',
      });
      return false;
    }
  };

  const unsubscribe = async (): Promise<boolean> => {
    try {
      const success = await pushNotificationManager.unsubscribe();
      setIsSubscribed(false);
      
      if (success) {
        toast({
          title: 'Inscrição cancelada',
          description: 'Você não receberá mais notificações do FitFlow.',
        });
      }
      return success;
    } catch (error) {
      console.error('Unsubscription error:', error);
      return false;
    }
  };

  const scheduleWorkoutReminder = (hour: number = 18, minute: number = 0): void => {
    pushNotificationManager.scheduleWorkoutReminder(hour, minute);
    toast({
      title: 'Lembrete agendado! ⏰',
      description: `Lembrete de treino definido para ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}.`,
    });
  };

  const showCustomNotification = async (options: PushNotificationOptions): Promise<void> => {
    await pushNotificationManager.showNotification(options);
  };

  return {
    isSupported,
    isSubscribed,
    permission,
    initialize,
    subscribe,
    unsubscribe,
    scheduleWorkoutReminder,
    showCustomNotification,
  };
}