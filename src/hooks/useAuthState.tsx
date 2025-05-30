
import { useState, useEffect } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
}

interface AuthActions {
  signUp: (email: string, password: string, userData?: any) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

export const useAuthState = (): AuthState & AuthActions => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    initialized: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          toast({
            title: "Authentication Error",
            description: "Failed to retrieve session",
            variant: "destructive",
          });
        }

        if (mounted) {
          setAuthState({
            user: session?.user ?? null,
            session,
            loading: false,
            initialized: true,
          });
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) {
          setAuthState(prev => ({
            ...prev,
            loading: false,
            initialized: true,
          }));
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (mounted) {
          setAuthState({
            user: session?.user ?? null,
            session,
            loading: false,
            initialized: true,
          });

          // Show success messages for certain events
          if (event === 'SIGNED_IN') {
            toast({
              title: "Welcome!",
              description: "You have been signed in successfully.",
            });
          } else if (event === 'SIGNED_OUT') {
            toast({
              title: "Signed out",
              description: "You have been signed out successfully.",
            });
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast]);

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) {
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error: error.message };
      }

      if (data.user && !data.session) {
        toast({
          title: "Check your email",
          description: "Please check your email for a confirmation link.",
        });
      }

      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        title: "Sign Up Failed",
        description: message,
        variant: "destructive",
      });
      return { success: false, error: message };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        title: "Sign In Failed",
        description: message,
        variant: "destructive",
      });
      return { success: false, error: message };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Sign Out Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        title: "Sign Out Failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=reset`,
      });

      if (error) {
        toast({
          title: "Password Reset Failed",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error: error.message };
      }

      toast({
        title: "Password Reset Sent",
        description: "Check your email for password reset instructions.",
      });
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        title: "Password Reset Failed",
        description: message,
        variant: "destructive",
      });
      return { success: false, error: message };
    }
  };

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };
};
