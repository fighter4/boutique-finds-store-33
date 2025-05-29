
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export type Product = Tables<'products'> & {
  categories: Tables<'categories'> | null;
  product_variants: Tables<'product_variants'>[];
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(*),
          product_variants(*)
        `)
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProducts(data || []);
      setFeaturedProducts(data?.filter(product => product.featured) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    featuredProducts,
    loading,
    error,
    refetch: fetchProducts
  };
};
