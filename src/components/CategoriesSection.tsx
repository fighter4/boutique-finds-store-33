
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useCategories } from '@/hooks/useCategories';

const CategoriesSection = () => {
  const { categories, loading, error } = useCategories();

  // Default images for categories
  const categoryImages = {
    'dresses': "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    't-shirts': "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    'accessories': "https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    'jeans': "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  };

  if (loading) {
    return (
      <section className="py-16 bg-boutique-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-medium text-boutique-charcoal mb-4">
              Shop by Category
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-64 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-boutique-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-600">Error loading categories: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-boutique-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-medium text-boutique-charcoal mb-4">
            Shop by Category
          </h2>
          <p className="text-boutique-grey font-body max-w-2xl mx-auto">
            Explore our carefully organized collections designed to suit every style and occasion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.slice(0, 3).map((category) => (
            <Card key={category.id} className="group cursor-pointer border-0 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative overflow-hidden">
                <img
                  src={category.image_url || categoryImages[category.slug as keyof typeof categoryImages] || categoryImages['t-shirts']}
                  alt={category.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
                
                <CardContent className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-heading font-medium mb-2 group-hover:text-boutique-accent transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-200 font-body text-sm mb-2">
                    {category.description}
                  </p>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
