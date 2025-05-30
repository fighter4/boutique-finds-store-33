import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, ShoppingBag } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/hooks/useProducts';
import { Tables } from '@/integrations/supabase/types';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Tables<'product_variants'> | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            categories(*),
            product_variants(*)
          `)
          .eq('id', id)
          .eq('active', true)
          .single();

        if (error) throw error;

        setProduct(data);
        if (data.product_variants && data.product_variants.length > 0) {
          setSelectedVariant(data.product_variants[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    await addToCart(selectedVariant.id, 1);
  };

  const availableSizes = product?.product_variants
    .filter(v => v.size)
    .map(v => v.size)
    .filter((size, index, arr) => arr.indexOf(size) === index) || [];

  const availableColors = product?.product_variants
    .filter(v => v.color)
    .map(v => v.color)
    .filter((color, index, arr) => arr.indexOf(color) === index) || [];

  const currentImages = selectedVariant?.image_urls || 
    product?.product_variants?.[0]?.image_urls || 
    ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"];

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-200 h-96 rounded-lg"></div>
              <div>
                <div className="bg-gray-200 h-8 rounded mb-4"></div>
                <div className="bg-gray-200 h-6 rounded mb-4 w-1/2"></div>
                <div className="bg-gray-200 h-20 rounded mb-4"></div>
                <div className="bg-gray-200 h-10 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-red-600">{error || 'Product not found'}</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={currentImages[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {currentImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {currentImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index ? 'border-boutique-accent' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-heading font-bold text-boutique-charcoal mb-2">
                {product.name}
              </h1>
              {product.categories && (
                <Badge variant="secondary" className="mb-4">
                  {product.categories.name}
                </Badge>
              )}
              <p className="text-2xl font-heading font-semibold text-boutique-charcoal">
                ${product.price}
              </p>
            </div>

            {product.description && (
              <div>
                <h3 className="font-body font-semibold text-boutique-charcoal mb-2">Description</h3>
                <p className="text-boutique-grey font-body leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div>
                <h3 className="font-body font-semibold text-boutique-charcoal mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedVariant?.size === size ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const variant = product.product_variants.find(v => v.size === size);
                        if (variant) setSelectedVariant(variant);
                      }}
                      className="min-w-[3rem]"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {availableColors.length > 0 && (
              <div>
                <h3 className="font-body font-semibold text-boutique-charcoal mb-3">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color) => (
                    <Button
                      key={color}
                      variant={selectedVariant?.color === color ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const variant = product.product_variants.find(v => v.color === color);
                        if (variant) setSelectedVariant(variant);
                      }}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Status */}
            {selectedVariant && (
              <div>
                {selectedVariant.stock_quantity && selectedVariant.stock_quantity > 0 ? (
                  <p className="text-green-600 font-body">
                    In stock ({selectedVariant.stock_quantity} available)
                  </p>
                ) : (
                  <p className="text-red-600 font-body">Out of stock</p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={!selectedVariant || (selectedVariant.stock_quantity || 0) <= 0}
                className="flex-1 bg-boutique-accent hover:bg-boutique-accent/90"
                size="lg"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" size="lg" className="px-6">
                <Heart className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
