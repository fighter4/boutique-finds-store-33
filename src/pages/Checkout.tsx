
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import ShippingForm from '@/components/checkout/ShippingForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import OrderConfirmation from '@/components/checkout/OrderConfirmation';

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, totalPrice } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });
  const [orderId, setOrderId] = useState<string | null>(null);

  // Redirect if not authenticated or cart is empty
  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (items.length === 0) {
      navigate('/cart');
      return;
    }
  }, [user, items, navigate]);

  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleOrderComplete = (newOrderId: string) => {
    setOrderId(newOrderId);
    setCurrentStep(3);
  };

  if (!user || items.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CheckoutSteps currentStep={currentStep} />
        
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <ShippingForm
                shippingAddress={shippingAddress}
                setShippingAddress={setShippingAddress}
                onNext={handleNextStep}
              />
            )}
            {currentStep === 2 && (
              <OrderSummary
                shippingAddress={shippingAddress}
                onPrev={handlePrevStep}
                onOrderComplete={handleOrderComplete}
              />
            )}
            {currentStep === 3 && orderId && (
              <OrderConfirmation orderId={orderId} />
            )}
          </div>
          
          {currentStep < 3 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h3 className="text-lg font-heading font-semibold text-boutique-charcoal mb-4">
                  Order Summary
                </h3>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={item.variant.image_urls?.[0] || '/placeholder.svg'}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-boutique-charcoal truncate">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-boutique-grey">
                          {item.variant.size && `Size: ${item.variant.size}`}
                          {item.variant.size && item.variant.color && ' • '}
                          {item.variant.color && `Color: ${item.variant.color}`}
                        </p>
                        <p className="text-sm text-boutique-grey">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-boutique-charcoal">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 mt-6 pt-6">
                  <div className="flex justify-between text-base font-medium text-boutique-charcoal">
                    <p>Subtotal</p>
                    <p>${totalPrice.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-sm text-boutique-grey mt-2">
                    <p>Shipping</p>
                    <p>Free</p>
                  </div>
                  <div className="flex justify-between text-lg font-heading font-bold text-boutique-charcoal mt-4 pt-4 border-t border-gray-200">
                    <p>Total</p>
                    <p>${totalPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
