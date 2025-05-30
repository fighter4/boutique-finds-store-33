
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { ShippingAddress } from '@/pages/Checkout';

interface OrderSummaryProps {
  shippingAddress: ShippingAddress;
  onPrev: () => void;
  onOrderComplete: (orderId: string) => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  shippingAddress,
  onPrev,
  onOrderComplete,
}) => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handlePlaceOrder = async () => {
    if (!user) return;

    try {
      setIsPlacingOrder(true);

      // Create order - cast shippingAddress to Json type
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

      // Clear cart
      await clearCart();

      // Show success message
      toast({
        title: 'Order placed successfully!',
        description: `Your order #${order.id.slice(0, 8)} has been placed.`,
      });

      onOrderComplete(order.id);
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: 'Error placing order',
        description: 'Please try again or contact support.',
        variant: 'destructive',
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-heading font-bold text-boutique-charcoal mb-6">
          Review Your Order
        </h2>

        {/* Shipping Address */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-boutique-charcoal mb-3">
            Shipping Address
          </h3>
          <Card>
            <CardContent className="p-4">
              <p className="font-medium">{shippingAddress.firstName} {shippingAddress.lastName}</p>
              <p>{shippingAddress.address}</p>
              <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
              <p>{shippingAddress.country}</p>
              {shippingAddress.phone && <p>Phone: {shippingAddress.phone}</p>}
              <p>Email: {shippingAddress.email}</p>
            </CardContent>
          </Card>
        </div>

        {/* Order Items */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-boutique-charcoal mb-3">
            Order Items
          </h3>
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={item.variant.image_urls?.[0] || '/placeholder.svg'}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-boutique-charcoal">{item.product.name}</h4>
                      <div className="text-sm text-boutique-grey">
                        {item.variant.size && `Size: ${item.variant.size}`}
                        {item.variant.size && item.variant.color && ' • '}
                        {item.variant.color && `Color: ${item.variant.color}`}
                      </div>
                      <div className="text-sm text-boutique-grey">
                        Quantity: {item.quantity}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-boutique-charcoal">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-boutique-grey">
                        ${item.product.price} each
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Order Total */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-boutique-grey">Subtotal</span>
            <span className="font-medium">${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-boutique-grey">Shipping</span>
            <span className="font-medium">Free</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-boutique-grey">Tax</span>
            <span className="font-medium">$0.00</span>
          </div>
          <Separator className="my-3" />
          <div className="flex justify-between items-center">
            <span className="text-lg font-heading font-bold text-boutique-charcoal">Total</span>
            <span className="text-lg font-heading font-bold text-boutique-charcoal">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onPrev}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shipping
          </Button>
          <Button
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
            className="bg-boutique-accent hover:bg-boutique-accent/90 px-8"
          >
            {isPlacingOrder ? (
              'Placing Order...'
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Place Order
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
