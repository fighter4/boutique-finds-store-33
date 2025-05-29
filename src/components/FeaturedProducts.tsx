
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingBag } from 'lucide-react';

const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      name: "Cashmere Wool Blend Coat",
      price: 299,
      originalPrice: 399,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      tag: "Sale"
    },
    {
      id: 2,
      name: "Minimalist Silk Blouse",
      price: 159,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      tag: "New"
    },
    {
      id: 3,
      name: "Tailored Wide-Leg Trousers",
      price: 189,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      tag: "Trending"
    },
    {
      id: 4,
      name: "Organic Cotton Dress",
      price: 129,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      tag: "Sustainable"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-medium text-boutique-charcoal mb-4">
            Featured Products
          </h2>
          <p className="text-boutique-grey font-body max-w-2xl mx-auto">
            Discover our carefully curated selection of premium pieces that embody modern elegance and timeless style.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group border-0 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Product Tag */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 text-xs font-body font-medium rounded-full ${
                    product.tag === 'Sale' ? 'bg-red-100 text-red-800' :
                    product.tag === 'New' ? 'bg-green-100 text-green-800' :
                    product.tag === 'Trending' ? 'bg-boutique-accent/20 text-boutique-accent' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {product.tag}
                  </span>
                </div>

                {/* Hover Actions */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="sm" variant="secondary" className="rounded-full w-10 h-10 p-0">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button size="sm" className="rounded-full w-10 h-10 p-0 bg-boutique-accent hover:bg-boutique-accent/90">
                    <ShoppingBag className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-body font-medium text-boutique-charcoal mb-2 hover:text-boutique-accent transition-colors cursor-pointer">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-heading font-semibold text-boutique-charcoal">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-boutique-grey line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            className="border-boutique-charcoal text-boutique-charcoal hover:bg-boutique-charcoal hover:text-white font-body font-medium px-8 py-3 rounded-none transition-all duration-300"
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
