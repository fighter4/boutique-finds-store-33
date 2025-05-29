
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative bg-boutique-primary min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/20 to-gray-900/40">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Fashion Collection"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-fade-in">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-light text-white mb-6 leading-tight">
            Discover Your
            <span className="block font-medium text-boutique-accent">Perfect Style</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 font-body max-w-2xl mx-auto">
            Curated collections of premium clothing that define modern elegance and timeless sophistication.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-boutique-accent hover:bg-boutique-accent/90 text-white font-body font-medium px-8 py-3 rounded-none transition-all duration-300 hover:scale-105"
            >
              Shop New Arrivals
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-boutique-charcoal font-body font-medium px-8 py-3 rounded-none transition-all duration-300"
            >
              View Collections
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
