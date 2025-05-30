
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Package, Calendar, DollarSign } from 'lucide-react';

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  shipping_address: any;
  order_items: Array<{
    id: string;
    quantity: number;
    price_at_purchase: number;
    product_variants: {
      size: string | null;
      color: string | null;
      image_urls: string[] | null;
      products: {
        name: string;
      };
    };
  }>;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'shipped':
      return 'bg-purple-100 text-purple-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const OrderHistory = () => {
  const { user } = useAuth();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items!fk_order_items_order(
            *,
            product_variants!fk_order_items_variant(
              size,
              color,
              image_urls,
              products!fk_product_variants_product(name)
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Order[];
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
            <p className="text-sm text-gray-400">
              When you place orders, they'll appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                    <div>
                      <p className="font-semibold text-boutique-charcoal">
                        Order #{order.id.slice(0, 8)}
                      </p>
                      <div className="flex items-center text-sm text-boutique-grey mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        {format(new Date(order.created_at), 'MMM dd, yyyy')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                    <div className="flex items-center text-sm font-semibold">
                      <DollarSign className="h-4 w-4 mr-1" />
                      ${order.total_amount.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-boutique-charcoal mb-2">Items</h4>
                    <div className="space-y-2">
                      {order.order_items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={item.product_variants.image_urls?.[0] || '/placeholder.svg'}
                              alt={item.product_variants.products.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-boutique-charcoal truncate">
                              {item.product_variants.products.name}
                            </p>
                            <div className="text-xs text-boutique-grey">
                              {item.product_variants.size && `Size: ${item.product_variants.size}`}
                              {item.product_variants.size && item.product_variants.color && ' • '}
                              {item.product_variants.color && `Color: ${item.product_variants.color}`}
                            </div>
                            <p className="text-xs text-boutique-grey">
                              Qty: {item.quantity} • ${item.price_at_purchase} each
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-boutique-charcoal mb-2">Shipping Address</h4>
                    <div className="text-sm text-boutique-grey">
                      <p className="font-medium text-boutique-charcoal">
                        {order.shipping_address.firstName} {order.shipping_address.lastName}
                      </p>
                      <p>{order.shipping_address.address}</p>
                      <p>
                        {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}
                      </p>
                      <p>{order.shipping_address.country}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderHistory;
