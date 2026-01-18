import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface PushSubscriptionData {
  id: string;
  user_id: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function usePushSubscription() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<PushSubscriptionData | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Check if push notifications are supported
    setIsSupported('serviceWorker' in navigator && 'PushManager' in window);
    setPermission('Notification' in window ? Notification.permission : 'denied');

    // Load existing subscription
    loadExistingSubscription();
  }, [user?.id, loadExistingSubscription]);

  const loadExistingSubscription = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading subscription:', error);
        return;
      }

      if (data) {
        setSubscription(data);
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
    }
  };

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      throw new Error('This browser does not support notifications');
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      throw new Error('Notifications have been denied');
    }

    const permission = await Notification.requestPermission();
    setPermission(permission);
    
    if (permission === 'granted') {
      toast({
        title: 'Notificações ativadas! 🔔',
        description: 'Você receberá lembretes e atualizações importantes.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Permissão negada',
        description: 'Você não receberá notificações push.',
      });
    }

    return permission;
  };

  const subscribe = async (): Promise<PushSubscriptionData | null> => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    if (!isSupported) {
      throw new Error('Push notifications are not supported in this browser');
    }

    try {
      // Request permission
      const permission = await requestPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission not granted');
      }

      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      // Get VAPID key from environment or config
      const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY || 
        'BEl62iUYgUivxIkv69yViEuiBIa40HI80NQDIXmZ8nBHY8lTqKQd2C1z5k8x9z7K3x5k2m3n4p5q6r7s8t9u0v1w2x3y4z5';

      // Subscribe to push notifications
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      // Save subscription to database
      const { data, error } = await supabase
        .from('push_subscriptions')
        .upsert({
          user_id: user.id,
          endpoint: pushSubscription.endpoint,
          keys: {
            p256dh: arrayBufferToBase64(pushSubscription.getKey('p256dh')!),
            auth: arrayBufferToBase64(pushSubscription.getKey('auth')!)
          },
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setSubscription(data);
      
      toast({
        title: 'Inscrição realizada! ✅',
        description: 'Você receberá notificações do FitFlow.',
      });

      return data;
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        variant: 'destructive',
        title: 'Erro na inscrição',
        description: 'Não foi possível se inscrever nas notificações.',
      });
      return null;
    }
  };

  const unsubscribe = async (): Promise<boolean> => {
    if (!user?.id || !subscription) {
      return false;
    }

    try {
      // Update database to mark as inactive
      const { error } = await supabase
        .from('push_subscriptions')
        .update({ is_active: false })
        .eq('id', subscription.id);

      if (error) {
        throw error;
      }

      // Unsubscribe from push manager
      const registration = await navigator.serviceWorker.ready;
      const pushSubscription = await registration.pushManager.getSubscription();
      
      if (pushSubscription) {
        await pushSubscription.unsubscribe();
      }

      setSubscription(null);
      
      toast({
        title: 'Inscrição cancelada',
        description: 'Você não receberá mais notificações push.',
      });

      return true;
    } catch (error) {
      console.error('Unsubscribe error:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao cancelar',
        description: 'Não foi possível cancelar as notificações.',
      });
      return false;
    }
  };

  const sendTestNotification = async (): Promise<void> => {
    try {
      if (!subscription) {
        throw new Error('No active subscription');
      }

      // Call edge function to send test notification
      const { error } = await supabase.functions.invoke('send-notification', {
        body: {
          subscriptionId: subscription.id,
          title: 'Teste do FitFlow! 🎉',
          body: 'Se receber esta notificação, as notificações estão funcionando corretamente.',
          data: { test: true }
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Notificação enviada! 📱',
        description: 'Verifique suas notificações.',
      });
    } catch (error) {
      console.error('Test notification error:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao enviar',
        description: 'Não foi possível enviar a notificação de teste.',
      });
    }
  };

  return {
    subscription,
    isSupported,
    permission,
    subscribe,
    unsubscribe,
    sendTestNotification,
    refreshSubscription: loadExistingSubscription,
  };
}

// Utility functions
function urlBase64ToUint8Array(base64String: string): Uint8Array {
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

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}