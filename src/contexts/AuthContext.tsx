import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

type UserType = 'personal' | 'student' | null;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userType: UserType;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, name: string, userType: 'personal' | 'student') => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  mockLogin: (type: 'personal' | 'student') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userType, setUserType] = useState<UserType>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserType = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', userId)
      .single();
    
    if (data) {
      setUserType(data.user_type as UserType);
    }
  }, []);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer Supabase calls with setTimeout
          setTimeout(() => {
            fetchUserType(session.user.id);
          }, 0);
        } else {
          setUserType(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserType(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchUserType]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, name: string, type: 'personal' | 'student') => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name,
            user_type: type,
          },
        },
      });

      if (error) return { error };

      // Create profile after successful signup
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name,
            user_type: type,
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserType(null);
  };

  // Mock login for development/testing
  const mockLogin = (type: 'personal' | 'student') => {
    setUserType(type);
    // Create a mock user for development
    setUser({
      id: 'mock-user-id',
      email: type === 'personal' ? 'personal@fitcoach.com' : 'aluno@fitcoach.com',
      app_metadata: {},
      user_metadata: { name: type === 'personal' ? 'Carlos Trainer' : 'Maria Aluna' },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as User);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        userType,
        loading,
        signIn,
        signUp,
        signOut,
        mockLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
