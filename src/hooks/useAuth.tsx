// src/hooks/useAuth.tsx
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import { AuthError, Session, User } from '@supabase/supabase-js';
import { useToast } from './use-toast'; // Corrected import path

// Define a type for the auth context value
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
  signInWithPassword: (email?: string, password?: string) => Promise<void>;
  signUp: (email?: string, password?: string) => Promise<void>;
  signOut: () => Promise<void>;
  // Add other methods like signInWithOAuth if you implement them
}

export const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true); // Start true to handle initial session check
  const [error, setError] = useState<AuthError | null>(null);
  const { toast } = useToast(); // This should now correctly get the toast function

  useEffect(() => {
    setLoading(true);
    const getSession = async () => {
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Error getting session:', sessionError);
        setError(sessionError);
        toast({ title: "Session Error", description: sessionError.message, variant: "destructive" });
      }
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setLoading(true);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setError(null); // Clear previous errors on auth state change
        setLoading(false);
        // You could add toasts for specific events like SIGNED_IN, SIGNED_OUT here if desired
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [toast]); // toast is a dependency

  const signInWithPassword = useCallback(async (email?: string, password?: string) => {
    if (!email || !password) {
        const errMessage = "Email and password are required.";
        toast({ title: "Login Error", description: errMessage, variant: "destructive" });
        setError({ name: "CredentialsMissing", message: errMessage } as AuthError); // Cast to AuthError like
        throw new Error(errMessage);
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        console.error('Sign in error:', signInError);
        toast({ title: "Login Error", description: signInError.message, variant: "destructive" });
        setError(signInError);
        throw signInError;
      }
      if (data.session) {
         toast({ title: "Login Successful", description: "Welcome back!" });
      }
      // Session and user state will be updated by onAuthStateChange listener
    } catch (catchedError: any) {
      // Ensure error is always set if catch block is reached
      if (!error && !(catchedError instanceof AuthError && catchedError.message === "Email and password are required.")) { // Avoid double setting if already set
          setError(catchedError as AuthError);
      }
      throw catchedError; // Re-throw to be caught in AuthForm
    } finally {
      setLoading(false);
    }
  }, [toast, error]);

  const signUp = useCallback(async (email?: string, password?: string) => {
    if (!email || !password) {
        const errMessage = "Email and password are required for signup.";
        toast({ title: "Signup Error", description: errMessage, variant: "destructive" });
        setError({ name: "CredentialsMissing", message: errMessage } as AuthError);
        throw new Error(errMessage);
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        // options: {
        //   emailRedirectTo: `${window.location.origin}/welcome` // Example redirect
        // }
      });

      if (signUpError) {
        console.error('Sign up error:', signUpError);
        toast({ title: "Signup Error", description: signUpError.message, variant: "destructive" });
        setError(signUpError);
        throw signUpError;
      }
      
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        const message = "User already registered. If you haven't confirmed your email, please check your inbox.";
        toast({ title: "Signup Info", description: message });
      } else if (data.session) {
        toast({ title: "Signup Successful", description: "Welcome!" });
      } else if (data.user) {
        toast({ title: "Signup Successful", description: "Please check your email to verify your account." });
      }
      // User and session state will be updated by onAuthStateChange
    } catch (catchedError: any) {
       if (!error && !(catchedError instanceof AuthError && catchedError.message === "Email and password are required for signup.")) {
          setError(catchedError as AuthError);
      }
      throw catchedError;
    } finally {
      setLoading(false);
    }
  }, [toast, error]);

  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      console.error('Sign out error:', signOutError);
      toast({ title: "Sign Out Error", description: signOutError.message, variant: "destructive" });
      setError(signOutError);
    } else {
      toast({ title: "Signed Out", description: "You have been successfully signed out." });
    }
    setLoading(false);
  }, [toast]);

  return {
    user,
    session,
    loading,
    error,
    signInWithPassword,
    signUp,
    signOut,
  };
};


