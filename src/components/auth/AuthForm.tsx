// src/components/auth/AuthForm.tsx
import React, { useState } from 'react';
import { supabase } from '../../integrations/supabase/client'; // Direct Supabase client for some operations
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { useAuth } from '../../hooks/useAuth';
import ForgotPasswordForm from './ForgotPasswordForm'; // Import the new form

interface AuthFormProps {
  initialView?: 'login' | 'signup'; // Renamed from 'view' to avoid conflict with state variable
  onSuccess?: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ initialView = 'login', onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentFormView, setCurrentFormView] = useState<'login' | 'signup' | 'forgot_password'>(initialView);
  // Removed local loading state, will use authLoading from useAuth
  const { toast } = useToast();
  const { signInWithPassword, signUp, loading: authLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // setLoading(true); // Use authLoading

    if (currentFormView === 'signup') {
      if (password !== confirmPassword) {
        toast({ title: 'Error', description: 'Passwords do not match.', variant: 'destructive' });
        // setLoading(false);
        return;
      }
      if (password.length < 6) { // Consider making this configurable or align with Supabase policy
        toast({ title: 'Error', description: 'Password should be at least 6 characters.', variant: 'destructive' });
        // setLoading(false);
        return;
      }
      try {
        await signUp(email, password); // signUp should handle toast messages on its own or return status
        // Toast for signup success is often handled after email verification,
        // but a general "Check your email" is good here.
        toast({ title: 'Signup Initiated', description: 'Please check your email to verify your account.' });
        if (onSuccess) onSuccess(); // This might navigate away or close a modal
      } catch (error: any) {
        // useAuth hook should ideally handle its own error toasting
        toast({ title: 'Signup Error', description: error.message || 'An unexpected error occurred.', variant: 'destructive' });
      }
    } else { // login
      try {
        await signInWithPassword(email, password); // signInWithPassword should handle toast
        // Toast for login success is usually handled by useAuth or onSuccess navigation
        // toast({ title: 'Success', description: 'Logged in successfully!' });
        if (onSuccess) onSuccess();
      } catch (error: any) {
        // useAuth hook should ideally handle its own error toasting
        toast({ title: 'Login Error', description: error.message || 'An unexpected error occurred.', variant: 'destructive' });
      }
    }
    // setLoading(false); // authLoading will change
  };

  if (currentFormView === 'forgot_password') {
    return <ForgotPasswordForm 
              onSuccess={() => setCurrentFormView('login')} 
              onToggleToLogin={() => setCurrentFormView('login')} 
           />;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-3xl">{currentFormView === 'login' ? 'Welcome Back!' : 'Create an Account'}</CardTitle>
        <CardDescription>
          {currentFormView === 'login' ? "Sign in to continue." : "Enter your details to get started."}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-auth">Email</Label> {/* Unique htmlFor */}
            <Input
              id="email-auth"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={authLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password-auth">Password</Label> {/* Unique htmlFor */}
            <Input
              id="password-auth"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={authLoading}
            />
          </div>
          {currentFormView === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="confirm-password-auth">Confirm Password</Label> {/* Unique htmlFor */}
              <Input
                id="confirm-password-auth"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={authLoading}
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button type="submit" className="w-full" disabled={authLoading}>
            {authLoading ? 'Processing...' : (currentFormView === 'login' ? 'Sign In' : 'Sign Up')}
          </Button>
          {currentFormView === 'login' && (
            <Button variant="link" type="button" onClick={() => setCurrentFormView('forgot_password')} className="text-sm p-0 h-auto">
              Forgot Password?
            </Button>
          )}
          <Button 
            variant="link" 
            type="button" 
            onClick={() => setCurrentFormView(currentFormView === 'login' ? 'signup' : 'login')} 
            className="w-full"
            disabled={authLoading}
          >
            {currentFormView === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AuthForm;

