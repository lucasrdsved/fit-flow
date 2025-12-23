import { useState, useEffect, useCallback } from 'react';
import { offlineStorage } from '@/lib/offlineStorage';

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  actions?: NotificationAction[];
  data?: any;
  vibrate?: number[];
}

interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  scheduledTime: number;
  options?: NotificationOptions;
  type: 'workout' | 'reminder' | 'achievement';
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [scheduledNotifications, setScheduledNotifications] = useState<ScheduledNotification[]>([]);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    // Check if notifications are supported
    const checkSupport = () => {
      const supported = 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
      setIsSupported(supported);
      
      if (supported) {
        setPermission(Notification.permission);
      }
    };

    checkSupport();

    // Load scheduled notifications from storage
    loadScheduledNotifications();

    // Listen for permission changes
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'notifications' as PermissionName }).then((status) => {
        status.addEventListener('change', () => {
          setPermission(status.state as NotificationPermission);
        });
      });
    }
  }, []);

  const loadScheduledNotifications = async () => {
    try {
      const notifications = await offlineStorage.getPreference('scheduledNotifications') || [];
      setScheduledNotifications(notifications);
    } catch (error) {
      console.error('[Notifications] Failed to load scheduled notifications:', error);
    }
  };

  const saveScheduledNotifications = async (notifications: ScheduledNotification[]) => {
    try {
      await offlineStorage.setPreference('scheduledNotifications', notifications);
      setScheduledNotifications(notifications);
    } catch (error) {
      console.error('[Notifications] Failed to save scheduled notifications:', error);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) {
      console.warn('[Notifications] Notifications not supported');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('[Notifications] Permission request failed:', error);
      return false;
    }
  };

  const showNotification = useCallback(async (options: NotificationOptions): Promise<boolean> => {
    if (!isSupported || permission !== 'granted') {
      console.warn('[Notifications] Permission not granted');
      return false;
    }

    try {
      // Try to use service worker first
      const registration = await navigator.serviceWorker.ready;
      
      if (registration) {
        await registration.showNotification(options.title, {
          body: options.body,
          icon: options.icon || '/icons/workout-192.png',
          badge: options.badge || '/icons/badge-72.png',
          tag: options.tag,
          requireInteraction: options.requireInteraction || false,
          actions: options.actions || [],
          data: options.data || {},
          vibrate: options.vibrate || [100, 50, 100]
        });
      } else {
        // Fallback to direct notification
        new Notification(options.title, {
          body: options.body,
          icon: options.icon || '/icons/workout-192.png',
          badge: options.badge || '/icons/badge-72.png',
          tag: options.tag,
          requireInteraction: options.requireInteraction || false,
          data: options.data || {}
        });
      }

      return true;
    } catch (error) {
      console.error('[Notifications] Failed to show notification:', error);
      return false;
    }
  }, [isSupported, permission]);

  const scheduleWorkoutReminder = async (
    workoutTime: Date,
    workoutName: string,
    leadTimeMinutes: number = 15
  ): Promise<string> => {
    const scheduledTime = workoutTime.getTime() - (leadTimeMinutes * 60 * 1000);
    const now = Date.now();

    if (scheduledTime <= now) {
      // Show immediately if time has passed
      await showNotification({
        title: 'Workout Reminder',
        body: `Time for ${workoutName}!`,
        icon: '/icons/workout-192.png',
        badge: '/icons/badge-72.png',
        tag: 'workout-reminder',
        requireInteraction: true,
        actions: [
          { action: 'start', title: 'Start Workout', icon: '/icons/workout-96.png' },
          { action: 'snooze', title: 'Snooze 10 min' }
        ],
        data: { workoutName, workoutTime: workoutTime.toISOString() }
      });
      return 'immediate';
    }

    const notification: ScheduledNotification = {
      id: crypto.randomUUID(),
      title: 'Workout Reminder',
      body: `Time for ${workoutName}!`,
      scheduledTime,
      type: 'workout',
      options: {
        icon: '/icons/workout-192.png',
        badge: '/icons/badge-72.png',
        tag: 'workout-reminder',
        requireInteraction: true,
        actions: [
          { action: 'start', title: 'Start Workout', icon: '/icons/workout-96.png' },
          { action: 'snooze', title: 'Snooze 10 min' }
        ],
        data: { workoutName, workoutTime: workoutTime.toISOString() }
      }
    };

    const updatedNotifications = [...scheduledNotifications, notification];
    await saveScheduledNotifications(updatedNotifications);

    return notification.id;
  };

  const scheduleProgressReminder = async (type: 'daily' | 'weekly', time: string): Promise<string> => {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const scheduledDate = new Date(now);
    scheduledDate.setHours(hours, minutes, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (scheduledDate <= now) {
      scheduledDate.setDate(scheduledDate.getDate() + 1);
    }

    const notification: ScheduledNotification = {
      id: crypto.randomUUID(),
      title: type === 'daily' ? 'Daily Progress Check' : 'Weekly Progress Review',
      body: type === 'daily' 
        ? 'Don\'t forget to log your workout today!' 
        : 'Time to review your weekly progress!',
      scheduledTime: scheduledDate.getTime(),
      type: 'reminder',
      options: {
        icon: '/icons/progress-96.png',
        badge: '/icons/badge-72.png',
        tag: `progress-${type}`,
        actions: [
          { action: 'view', title: 'View Progress' },
          { action: 'dismiss', title: 'Dismiss' }
        ]
      }
    };

    const updatedNotifications = [...scheduledNotifications, notification];
    await saveScheduledNotifications(updatedNotifications);

    return notification.id;
  };

  const cancelScheduledNotification = async (id: string): Promise<boolean> => {
    const updatedNotifications = scheduledNotifications.filter(n => n.id !== id);
    await saveScheduledNotifications(updatedNotifications);
    return true;
  };

  const cancelAllScheduledNotifications = async (): Promise<boolean> => {
    await saveScheduledNotifications([]);
    return true;
  };

  const showAchievementNotification = async (achievement: {
    title: string;
    description: string;
    icon?: string;
  }): Promise<boolean> => {
    return showNotification({
      title: '🎉 Achievement Unlocked!',
      body: `${achievement.title}: ${achievement.description}`,
      icon: achievement.icon || '/icons/workout-192.png',
      badge: '/icons/badge-72.png',
      tag: 'achievement',
      requireInteraction: false,
      vibrate: [200, 100, 200],
      data: { type: 'achievement', achievement }
    });
  };

  const showWorkoutCompleteNotification = async (workoutData: {
    name: string;
    duration: number;
    exercises: number;
  }): Promise<boolean> => {
    return showNotification({
      title: '💪 Workout Complete!',
      body: `Great job! You completed ${workoutData.name} in ${Math.round(workoutData.duration / 60)} minutes with ${workoutData.exercises} exercises.`,
      icon: '/icons/workout-192.png',
      badge: '/icons/badge-72.png',
      tag: 'workout-complete',
      requireInteraction: false,
      actions: [
        { action: 'view', title: 'View Details' },
        { action: 'share', title: 'Share' }
      ],
      data: { type: 'workout-complete', workoutData }
    });
  };

  // Check and trigger scheduled notifications
  useEffect(() => {
    const interval = setInterval(async () => {
      const now = Date.now();
      const dueNotifications = scheduledNotifications.filter(n => n.scheduledTime <= now);

      if (dueNotifications.length > 0) {
        for (const notification of dueNotifications) {
          await showNotification(notification.options || {
            title: notification.title,
            body: notification.body
          });
        }

        // Remove triggered notifications
        const remainingNotifications = scheduledNotifications.filter(n => n.scheduledTime > now);
        await saveScheduledNotifications(remainingNotifications);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [scheduledNotifications, showNotification]);

  // Push subscription management
  const subscribeToPush = async (): Promise<PushSubscription | null> => {
    if (!isSupported || permission !== 'granted') {
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          // This should be your VAPID public key
          'BMzFTq6L2q0zE5t_3h9K2q7J8s5wF6t1R2v9Y8xZ3wA7B4C5D6E7F8G9H0I1J2K3L4M5N6O7P8Q9R0S1T2U3V4W5X6Y7Z8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4'
        )
      });

      setSubscription(subscription);
      await offlineStorage.setPreference('pushSubscription', subscription);
      
      return subscription;
    } catch (error) {
      console.error('[Notifications] Push subscription failed:', error);
      return null;
    }
  };

  const unsubscribeFromPush = async (): Promise<boolean> => {
    if (!subscription) return true;

    try {
      await subscription.unsubscribe();
      setSubscription(null);
      await offlineStorage.setPreference('pushSubscription', null);
      return true;
    } catch (error) {
      console.error('[Notifications] Push unsubscribe failed:', error);
      return false;
    }
  };

  // Load existing push subscription
  useEffect(() => {
    const loadPushSubscription = async () => {
      try {
        const savedSubscription = await offlineStorage.getPreference('pushSubscription');
        if (savedSubscription) {
          setSubscription(savedSubscription);
        }
      } catch (error) {
        console.error('[Notifications] Failed to load push subscription:', error);
      }
    };

    loadPushSubscription();
  }, []);

  return {
    // Permission and support
    isSupported,
    permission,
    requestPermission,

    // Notification display
    showNotification,

    // Scheduled notifications
    scheduleWorkoutReminder,
    scheduleProgressReminder,
    cancelScheduledNotification,
    cancelAllScheduledNotifications,
    scheduledNotifications,

    // Special notifications
    showAchievementNotification,
    showWorkoutCompleteNotification,

    // Push notifications
    subscribeToPush,
    unsubscribeFromPush,
    subscription
  };
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}

// Hook for notification preferences
export function useNotificationPreferences() {
  const [preferences, setPreferences] = useState({
    workoutReminders: true,
    progressReminders: true,
    achievements: true,
    workoutComplete: true,
    quietHours: { enabled: false, start: '22:00', end: '08:00' }
  });

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const saved = await offlineStorage.getPreference('notificationPreferences');
        if (saved) {
          setPreferences(saved);
        }
      } catch (error) {
        console.error('[Notifications] Failed to load preferences:', error);
      }
    };

    loadPreferences();
  }, []);

  const updatePreferences = async (newPreferences: typeof preferences) => {
    try {
      await offlineStorage.setPreference('notificationPreferences', newPreferences);
      setPreferences(newPreferences);
    } catch (error) {
      console.error('[Notifications] Failed to save preferences:', error);
    }
  };

  const isInQuietHours = (): boolean => {
    if (!preferences.quietHours.enabled) return false;

    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, '0') + ':' + 
                       now.getMinutes().toString().padStart(2, '0');
    
    return currentTime >= preferences.quietHours.start || currentTime <= preferences.quietHours.end;
  };

  return {
    preferences,
    updatePreferences,
    isInQuietHours
  };
}