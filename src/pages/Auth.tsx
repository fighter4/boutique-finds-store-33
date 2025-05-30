
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/auth/AuthForm';

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading, initialized } = useAuth();

  useEffect(() => {
    // Redirect to home if user is already authenticated
    if (initialized && !loading && user) {
      navigate('/', { replace: true });
    }
  }, [user, loading, initialized, navigate]);

  // Show loading state while checking authentication
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-boutique-accent mx-auto"></div>
          <p className="mt-4 text-boutique-grey">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render form if user is already authenticated
  if (user) {
    return null;
  }

  return <AuthForm />;
};

export default Auth;
