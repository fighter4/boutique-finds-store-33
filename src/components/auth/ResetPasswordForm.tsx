// src/components/auth/ResetPasswordForm.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
// If you're using react-router-dom, it's better to use useNavigate
// import { useNavigate } from 'react-router-dom';

const ResetPasswordForm: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();
  // const navigate = useNavigate(); // Uncomment if using react-router-dom

  useEffect(() => {
    // This handles the session when the user lands on this page after clicking the password reset link.
    // Supabase's JS client automatically handles the access_token from the URL fragment.
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) {
        // User is in password recovery mode.
        // The form below will allow them to set a new password.
        toast({
            title: "Password Recovery",
            description: "You can now set your new password.",
        });
      } else if (event === "SIGNED_IN" && session?.user?.aud === "authenticated") {
        // This might happen if the user was already signed in or the session was recovered.
        // If they are on reset-password page and fully authenticated, perhaps redirect them.
        // For now, we'll just let them proceed with password update if they are in recovery.
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [toast]);


  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      toast({ title: 'Error', description: 'Passwords do not match.', variant: 'destructive' });
      return;
    }
    if (password.length < 6) { // Or your Supabase password policy minimum length
        setError('Password should be at least 6 characters.');
        toast({ title: 'Error', description: 'Password should be at least 6 characters.', variant: 'destructive' });
        return;
    }

    setLoading(true);

    // The user object should be available via session if event was PASSWORD_RECOVERY
    const { error: updateError } = await supabase.auth.updateUser({ password });

    setLoading(false);
    if (updateError) {
      setError(updateError.message);
      toast({
        title: 'Error updating password',
        description: updateError.message,
        variant: 'destructive',
      });
    } else {
      setMessage('Your password has been updated successfully. You will be redirected to login.');
      toast({
        title: 'Password Updated',
        description: 'Your password has been successfully updated.',
      });
      // Redirect to login page after a short delay
      setTimeout(() => {
        // navigate('/auth'); // If using react-router-dom
        window.location.href = '/auth'; // Or your login page route
      }, 3000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-background p-4"> {/* Adjusted min-height */}
        <Card className="w-full max-w-md">
        <CardHeader>
            <CardTitle className="text-2xl">Reset Your Password</CardTitle>
            <CardDescription>
            Enter your new password below.
            </CardDescription>
        </CardHeader>
        <form onSubmit={handlePasswordUpdate}>
            <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>} {/* Use destructive variant color */}
            {message && <p className="text-sm text-green-500">{message}</p>}
            </CardContent>
            <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
            </Button>
            </CardFooter>
        </form>
        </Card>
    </div>
  );
};

export default ResetPasswordForm;
