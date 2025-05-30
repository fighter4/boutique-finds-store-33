// src/components/auth/ForgotPasswordForm.tsx
import React, { useState } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';

interface ForgotPasswordFormProps {
  onSuccess?: () => void; // Optional callback for successful email submission
  onToggleToLogin?: () => void; // Optional callback to toggle back to login form
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSuccess, onToggleToLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handlePasswordResetRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Ensure the redirectTo URL is exactly where your ResetPasswordPage is served.
    // It must also be listed in your Supabase project's "Redirect URLs" settings.
    const redirectTo = `${window.location.origin}/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo,
    });

    setLoading(false);
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      setMessage(`Error: ${error.message}`);
    } else {
      toast({
        title: 'Check your email',
        description: 'A password reset link has been sent to your email address if an account exists.',
      });
      setMessage('If an account with this email exists, a password reset link has been sent.');
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Forgot Password</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you a link to reset your password.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handlePasswordResetRequest}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-forgot">Email</Label> {/* Changed htmlFor to avoid conflict if used elsewhere */}
            <Input
              id="email-forgot"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          {message && <p className={`text-sm ${message.startsWith('Error:') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
          {onToggleToLogin && (
             <Button variant="link" type="button" onClick={onToggleToLogin} className="w-full">
                Back to Login
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};

export default ForgotPasswordForm;
