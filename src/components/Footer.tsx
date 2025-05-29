
import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  return (
    <footer className="bg-boutique-charcoal text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-heading font-bold text-boutique-accent">
              Modern Boutique
            </h3>
            <p className="text-gray-300 font-body">
              Curating premium fashion that defines modern elegance and timeless sophistication for the contemporary lifestyle.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-boutique-accent p-2">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-boutique-accent p-2">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-boutique-accent p-2">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-heading font-medium">Quick Links</h4>
            <ul className="space-y-2 font-body">
              <li><a href="#" className="text-gray-300 hover:text-boutique-accent transition-colors">New Arrivals</a></li>
              <li><a href="#" className="text-gray-300 hover:text-boutique-accent transition-colors">Best Sellers</a></li>
              <li><a href="#" className="text-gray-300 hover:text-boutique-accent transition-colors">Sale</a></li>
              <li><a href="#" className="text-gray-300 hover:text-boutique-accent transition-colors">Gift Cards</a></li>
              <li><a href="#" className="text-gray-300 hover:text-boutique-accent transition-colors">Size Guide</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg font-heading font-medium">Customer Service</h4>
            <ul className="space-y-2 font-body">
              <li><a href="#" className="text-gray-300 hover:text-boutique-accent transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-boutique-accent transition-colors">Shipping Info</a></li>
              <li><a href="#" className="text-gray-300 hover:text-boutique-accent transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="text-gray-300 hover:text-boutique-accent transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-300 hover:text-boutique-accent transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-heading font-medium">Stay Connected</h4>
            <p className="text-gray-300 font-body text-sm">
              Subscribe to our newsletter for exclusive offers and style updates.
            </p>
            <div className="flex space-x-2">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 font-body"
              />
              <Button className="bg-boutique-accent hover:bg-boutique-accent/90 text-white px-4">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-gray-300 font-body text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>hello@modernboutique.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>New York, NY</span>
              </div>
            </div>
            <p className="text-gray-400 font-body text-sm">
              © 2024 Modern Boutique. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
