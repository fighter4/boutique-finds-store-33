
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const CategoriesSection = () => {
  const categories = [
    {
      name: "Women's Fashion",
      description: "Elegant pieces for the modern woman",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      count: "120+ items"
    },
    {
      name: "Men's Collection",
      description: "Sophisticated styles for gentlemen",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      count: "80+ items"
    },
    {
      name: "Accessories",
      description: "Perfect finishing touches",
      image: "https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      count: "50+ items"
    }
  ];

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
          {categories.map((category, index) => (
            <Card key={index} className="group cursor-pointer border-0 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative overflow-hidden">
                <img
                  src={category.image}
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
                  <span className="text-xs font-body font-medium text-boutique-accent">
                    {category.count}
                  </span>
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
