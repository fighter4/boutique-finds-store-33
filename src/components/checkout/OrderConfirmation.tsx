
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OrderConfirmationProps {
  orderId: string;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ orderId }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="text-center">
        <CardContent className="p-8">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-heading font-bold text-boutique-charcoal mb-2">
              Order Confirmed!
            </h2>
            <p className="text-boutique-grey text-lg">
              Thank you for your purchase. Your order has been placed successfully.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center mb-4">
              <Package className="h-8 w-8 text-boutique-accent mr-3" />
              <div>
                <p className="text-sm text-boutique-grey">Order Number</p>
                <p className="font-heading font-bold text-boutique-charcoal">
                  #{orderId.slice(0, 8).toUpperCase()}
                </p>
              </div>
            </div>
            <p className="text-sm text-boutique-grey">
              You will receive an email confirmation shortly with your order details and tracking information.
            </p>
          </div>

          <div className="space-y-4">
            <div className="text-left">
              <h3 className="font-semibold text-boutique-charcoal mb-2">What happens next?</h3>
              <ul className="text-sm text-boutique-grey space-y-1">
                <li>• We'll send you an email confirmation</li>
                <li>• Your order will be processed within 1-2 business days</li>
                <li>• You'll receive tracking information once shipped</li>
                <li>• Delivery typically takes 3-5 business days</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button 
              variant="outline" 
              onClick={() => navigate('/products')}
              className="flex-1"
            >
              Continue Shopping
            </Button>
            <Button 
              onClick={() => navigate('/')}
              className="flex-1 bg-boutique-accent hover:bg-boutique-accent/90"
            >
              Back to Home
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderConfirmation;
