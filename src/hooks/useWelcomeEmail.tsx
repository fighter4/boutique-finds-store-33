
import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useWelcomeEmail = () => {
  const { user } = useAuth();

  useEffect(() => {
    const sendWelcomeEmail = async () => {
      if (user && user.email) {
        // Check if this is a new user (you might want to add a flag to track this)
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        // Only send welcome email for new users
        if (profile && !profile.created_at) {
          try {
            await supabase.functions.invoke('send-welcome-email', {
              body: {
                email: user.email,
                firstName: profile.first_name || '',
              },
            });
          } catch (error) {
            console.error('Error sending welcome email:', error);
          }
        }
      }
    };

    sendWelcomeEmail();
  }, [user]);
};
