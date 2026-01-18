import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  message_type: 'text' | 'workout_feedback' | 'system';
  workout_log_id?: string;
  attachments?: string[];
}

export interface Conversation {
  id: string;
  participants: string[];
  last_message?: Message;
  unread_count: number;
  updated_at: string;
}

export function useMessages() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get conversations for current user
  const { data: conversations, isLoading: conversationsLoading } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(name, avatar_url),
          receiver:profiles!messages_receiver_id_fkey(name, avatar_url)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group messages into conversations
      const conversationMap = new Map<string, Conversation>();
      
      data?.forEach((message) => {
        const otherUserId = message.sender_id === user.id 
          ? message.receiver_id 
          : message.sender_id;
        
        if (!conversationMap.has(otherUserId)) {
          conversationMap.set(otherUserId, {
            id: otherUserId,
            participants: [user.id, otherUserId],
            unread_count: 0,
            updated_at: message.created_at
          });
        }
        
        const conversation = conversationMap.get(otherUserId)!;
        if (!message.is_read && message.receiver_id === user.id) {
          conversation.unread_count++;
        }
        
        if (!conversation.last_message || 
            new Date(message.created_at) > new Date(conversation.last_message.created_at)) {
          conversation.last_message = message;
        }
      });

      return Array.from(conversationMap.values())
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    },
    enabled: !!user?.id,
  });

  // Get messages for a specific conversation
  const getMessages = useCallback((otherUserId: string) => {
    return useQuery({
      queryKey: ['messages', user?.id, otherUserId],
      queryFn: async () => {
        if (!user?.id) return [];

        const { data, error } = await supabase
          .from('messages')
          .select(`
            *,
            sender:profiles!messages_sender_id_fkey(name, avatar_url),
            receiver:profiles!messages_receiver_id_fkey(name, avatar_url)
          `)
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
          .order('created_at', { ascending: true });

        if (error) throw error;

        return data || [];
      },
      enabled: !!user?.id && !!otherUserId,
    });
  }, [user?.id]);

  // Send a message
  const sendMessageMutation = useMutation({
    mutationFn: async ({ 
      receiverId, 
      content, 
      messageType = 'text',
      workoutLogId 
    }: {
      receiverId: string;
      content: string;
      messageType?: 'text' | 'workout_feedback' | 'system';
      workoutLogId?: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          content,
          message_type: messageType,
          workout_log_id: workoutLogId,
          is_read: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  // Mark messages as read
  const markAsReadMutation = useMutation({
    mutationFn: async (otherUserId: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('receiver_id', user.id)
        .eq('sender_id', otherUserId)
        .eq('is_read', false);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  // Real-time subscription for new messages
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['messages'] });
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  return {
    conversations: conversations || [],
    conversationsLoading,
    sendMessage: sendMessageMutation.mutateAsync,
    markAsRead: markAsReadMutation.mutateAsync,
    isSendingMessage: sendMessageMutation.isPending,
  };
}

// Hook separado para mensagens de uma conversa específica
export function useConversationMessages(otherUserId: string | null) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['messages', user?.id, otherUserId],
    queryFn: async () => {
      if (!user?.id || !otherUserId) return [];

      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(name, avatar_url),
          receiver:profiles!messages_receiver_id_fkey(name, avatar_url)
        `)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return data || [];
    },
    enabled: !!user?.id && !!otherUserId,
  });
}