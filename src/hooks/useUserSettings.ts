import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useOfflineStorage } from '@/lib/offlineStorage';

export interface UserSettings {
  id?: string;
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  language: 'pt-BR' | 'en-US';
  workout_reminder: boolean;
  workout_reminder_time: string; // HH:mm format
  message_notifications: boolean;
  achievement_notifications: boolean;
  weekly_report: boolean;
  offline_mode: boolean;
  auto_sync: boolean;
  rest_timer_sound: boolean;
  workout_rest_time_default: number; // seconds
  weight_unit: 'kg' | 'lb';
  privacy_mode: boolean;
  created_at?: string;
  updated_at?: string;
}

export function useUserSettings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { offlineStorage } = useOfflineStorage();

  // Fetch user settings
  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['user-settings', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Update settings
  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: Partial<UserSettings>) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          ...newSettings,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-settings'] });
    },
  });

  // Get default settings
  const getDefaultSettings = (): UserSettings => ({
    user_id: user?.id || '',
    theme: 'system',
    language: 'pt-BR',
    workout_reminder: true,
    workout_reminder_time: '18:00',
    message_notifications: true,
    achievement_notifications: true,
    weekly_report: false,
    offline_mode: true,
    auto_sync: true,
    rest_timer_sound: true,
    workout_rest_time_default: 60,
    weight_unit: 'kg',
    privacy_mode: false,
  });

  // Update a specific setting
  const updateSetting = async <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) => {
    await updateSettingsMutation.mutateAsync({ [key]: value } as Partial<UserSettings>);
  };

  // Apply theme setting
  const applyTheme = (theme: 'light' | 'dark' | 'system') => {
    const root = document.documentElement;
    
    switch (theme) {
      case 'light': {
        root.classList.remove('dark');
        root.classList.add('light');
        break;
      }
      case 'dark': {
        root.classList.remove('light');
        root.classList.add('dark');
        break;
      }
      case 'system': {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.toggle('dark', prefersDark);
        root.classList.toggle('light', !prefersDark);
        break;
      }
    }
  };

  // Initialize settings
  useEffect(() => {
    if (settings?.theme) {
      applyTheme(settings.theme);
    }
  }, [settings?.theme]);

  return {
    settings: settings || getDefaultSettings(),
    isLoading,
    error,
    updateSetting,
    updateSettings: updateSettingsMutation.mutateAsync,
    isUpdating: updateSettingsMutation.isPending,
    applyTheme,
  };
}

export function useThemeSettings() {
  const { settings, updateSetting } = useUserSettings();

  const toggleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(settings.theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    updateSetting('theme', themes[nextIndex]);
  };

  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    updateSetting('theme', theme);
  };

  return {
    theme: settings.theme,
    toggleTheme,
    setTheme,
  };
}