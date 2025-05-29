
import React, { useState } from 'react';
import { ShoppingBag, Search, User, Menu, X, Heart, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const navItems = [
    { name: 'New Arrivals', href: '#' },
    { name: 'Women', href: '#' },
    { name: 'Men', href: '#' },
    { name: 'Accessories', href: '#' },
    { name: 'Sale', href: '#' },
  ];

  const handleAuthClick = () => {
    if (user) {
      signOut();
    } else {
      navigate('/auth');
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-boutique-charcoal"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
            <h1 className="text-2xl font-heading font-bold text-boutique-charcoal">
              Modern Boutique
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-boutique-charcoal hover:text-boutique-accent transition-colors duration-200 font-body font-medium"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-boutique-charcoal hover:text-boutique-accent">
              <Search className="h-5 w-5" />
            </Button>
            {user && (
              <Button variant="ghost" size="sm" className="text-boutique-charcoal hover:text-boutique-accent">
                <Heart className="h-5 w-5" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-boutique-charcoal hover:text-boutique-accent"
              onClick={handleAuthClick}
            >
              {user ? <LogOut className="h-5 w-5" /> : <User className="h-5 w-5" />}
            </Button>
            {user && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-boutique-charcoal hover:text-boutique-accent relative"
                onClick={() => navigate('/cart')}
              >
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-boutique-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="py-2 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-boutique-charcoal hover:text-boutique-accent transition-colors duration-200 font-body"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              {!user && (
                <button
                  onClick={() => {
                    navigate('/auth');
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-boutique-charcoal hover:text-boutique-accent transition-colors duration-200 font-body"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
