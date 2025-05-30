
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Lock } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { ShippingAddress } from '@/pages/Checkout';

interface PaymentFormProps {
  shippingAddress: ShippingAddress;
  onPaymentSuccess: (orderId: string) => void;
  onBack: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  shippingAddress,
  onPaymentSuccess,
  onBack,
}) => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
  });

  const handleCardChange = (field: string, value: string) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handlePayment = async () => {
    if (!user) return;

    // Basic validation
    if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv || !cardDetails.nameOnCard) {
      toast({
        title: 'Missing payment details',
        description: 'Please fill in all payment fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsProcessing(true);

      // Create order first
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: totalPrice,
          shipping_address: shippingAddress as any,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        price_at_purchase: item.product.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Process payment
      const { data: paymentData, error: paymentError } = await supabase.functions.invoke('process-payment', {
        body: {
          amount: totalPrice,
          orderId: order.id,
          customerEmail: shippingAddress.email,
          customerName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        },
      });

      if (paymentError) throw paymentError;

      // Simulate payment success (in real implementation, you'd use Stripe Elements)
      // For demo purposes, we'll assume payment succeeded
      const paymentSucceeded = true;

      if (paymentSucceeded) {
        // Update order status
        await supabase
          .from('orders')
          .update({ status: 'processing' })
          .eq('id', order.id);

        // Send confirmation email
        await supabase.functions.invoke('send-order-confirmation', {
          body: {
            orderId: order.id,
            customerEmail: shippingAddress.email,
            customerName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
          },
        });

        // Clear cart
        await clearCart();

        toast({
          title: 'Payment successful!',
          description: 'Your order has been placed and confirmation email sent.',
        });

        onPaymentSuccess(order.id);
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment failed',
        description: 'Please try again or contact support.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="nameOnCard">Name on Card</Label>
            <Input
              id="nameOnCard"
              type="text"
              value={cardDetails.nameOnCard}
              onChange={(e) => handleCardChange('nameOnCard', e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              type="text"
              value={cardDetails.cardNumber}
              onChange={(e) => handleCardChange('cardNumber', formatCardNumber(e.target.value))}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="text"
                value={cardDetails.expiryDate}
                onChange={(e) => handleCardChange('expiryDate', formatExpiryDate(e.target.value))}
                placeholder="MM/YY"
                maxLength={5}
              />
            </div>
            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                type="text"
                value={cardDetails.cvv}
                onChange={(e) => handleCardChange('cvv', e.target.value.replace(/\D/g, ''))}
                placeholder="123"
                maxLength={4}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Lock className="h-4 w-4" />
          Your payment information is secure and encrypted
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            Back to Review
          </Button>
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="bg-boutique-accent hover:bg-boutique-accent/90"
          >
            {isProcessing ? 'Processing...' : `Pay $${totalPrice.toFixed(2)}`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
