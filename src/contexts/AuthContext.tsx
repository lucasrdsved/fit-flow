import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type UserType = 'personal' | 'student' | null;

/**
 * Represents the user's profile information.
 */
interface Profile {
  /** Unique identifier for the user. */
  id: string;
  /** The user's full name. */
  name: string;
  /** The type of user: 'personal' (trainer) or 'student'. */
  user_type: string;
}

/**
 * Defines the shape of the authentication context.
 */
interface AuthContextType {
  /** The current authenticated user object from Supabase, or null if not authenticated. */
  user: User | null;
  /** The current authentication session, or null if no session exists. */
  session: Session | null;
  /** The user's profile data, including name and user type. */
  profile: Profile | null;
  /** The type of the current user ('personal' or 'student'). */
  userType: UserType;
  /** Indicates whether the authentication state is currently being loaded. */
  loading: boolean;
  /**
   * Signs in a user with email and password.
   * @param email - The user's email address.
   * @param password - The user's password.
   * @returns A promise resolving to an object containing an error if the sign-in failed.
   */
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  /**
   * Signs up a new user.
   * @param email - The user's email address.
   * @param password - The user's password.
   * @param name - The user's full name.
   * @param userType - The role of the user ('personal' or 'student').
   * @returns A promise resolving to an object containing an error if the sign-up failed.
   */
  signUp: (email: string, password: string, name: string, userType: 'personal' | 'student') => Promise<{ error: Error | null }>;
  /**
   * Signs out the current user.
   * @returns A promise that resolves when the sign-out is complete.
   */
  signOut: () => Promise<void>;
  /**
   * Simulates a login for development purposes without hitting the backend.
   * @param type - The user type to simulate ('personal' or 'student').
   */
  mockLogin: (type: 'personal' | 'student') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provides authentication state and methods to the application.
 *
 * This provider manages the user's session, profile, and authentication actions (sign in, sign up, sign out).
 * It uses Supabase for backend authentication and state management.
 *
 * @param props - The component props.
 * @param props.children - The child components that will have access to the auth context.
 * @returns {JSX.Element} The AuthProvider component.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userType, setUserType] = useState<UserType>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (data && !error) {
        setProfile(data);
        setUserType(data.user_type as UserType);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
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
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
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
        fetchProfile(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

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
      
      const { error } = await supabase.auth.signUp({
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

      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setUser(null);
      setSession(null);
      setProfile(null);
      setUserType(null);
    }
  };

  // Mock login for development/testing
  const mockLogin = (type: 'personal' | 'student') => {
    const mockProfile: Profile = {
      id: 'mock-user-id',
      name: type === 'personal' ? 'Carlos Trainer' : 'Maria Aluna',
      user_type: type,
    };
    
    setProfile(mockProfile);
    setUserType(type);
    setUser({
      id: 'mock-user-id',
      email: type === 'personal' ? 'personal@fitcoach.com' : 'aluno@fitcoach.com',
      app_metadata: {},
      user_metadata: { name: mockProfile.name },
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
        profile,
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

/**
 * Custom hook to access the authentication context.
 *
 * @returns {AuthContextType} The authentication context value.
 * @throws {Error} If used outside of an AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
