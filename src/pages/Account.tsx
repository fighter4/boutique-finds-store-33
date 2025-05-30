
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, MapPin, ShoppingBag, LogOut } from 'lucide-react';
import ProfileSection from '@/components/account/ProfileSection';
import AddressSection from '@/components/account/AddressSection';
import OrderHistory from '@/components/account/OrderHistory';

const Account = () => {
  const navigate = useNavigate();
  const { user, signOut, loading, initialized } = useAuth();

  React.useEffect(() => {
    // Redirect to auth page if user is not authenticated
    if (initialized && !loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, initialized, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Show loading state while checking authentication
  if (!initialized || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-boutique-accent mx-auto"></div>
              <p className="mt-4 text-boutique-grey">Loading your account...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Don't render account content if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-boutique-charcoal">
              My Account
            </h1>
            <p className="text-boutique-grey mt-1">
              Welcome back, {user.user_metadata?.first_name || user.email}
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="addresses" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Addresses
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Order History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileSection />
          </TabsContent>

          <TabsContent value="addresses">
            <AddressSection />
          </TabsContent>

          <TabsContent value="orders">
            <OrderHistory />
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Account;
