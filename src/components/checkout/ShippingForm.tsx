
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShippingAddress } from '@/pages/Checkout';

interface ShippingFormProps {
  shippingAddress: ShippingAddress;
  setShippingAddress: (address: ShippingAddress) => void;
  onNext: () => void;
}

const ShippingForm: React.FC<ShippingFormProps> = ({
  shippingAddress,
  setShippingAddress,
  onNext,
}) => {
  const handleChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress({
      ...shippingAddress,
      [field]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const requiredFields: (keyof ShippingAddress)[] = [
      'firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode'
    ];
    
    const isValid = requiredFields.every(field => shippingAddress[field].trim() !== '');
    
    if (isValid) {
      onNext();
    } else {
      alert('Please fill in all required fields');
    }
  };

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-heading font-bold text-boutique-charcoal mb-6">
        Shipping Information
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              type="text"
              value={shippingAddress.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              type="text"
              value={shippingAddress.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={shippingAddress.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={shippingAddress.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="address">Street Address *</Label>
          <Input
            id="address"
            type="text"
            value={shippingAddress.address}
            onChange={(e) => handleChange('address', e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              type="text"
              value={shippingAddress.city}
              onChange={(e) => handleChange('city', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="state">State *</Label>
            <Select value={shippingAddress.state} onValueChange={(value) => handleChange('state', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="zipCode">ZIP Code *</Label>
            <Input
              id="zipCode"
              type="text"
              value={shippingAddress.zipCode}
              onChange={(e) => handleChange('zipCode', e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            type="text"
            value={shippingAddress.country}
            onChange={(e) => handleChange('country', e.target.value)}
            readOnly
            className="bg-gray-50"
          />
        </div>

        <div className="flex justify-end pt-6">
          <Button
            type="submit"
            className="bg-boutique-accent hover:bg-boutique-accent/90 px-8"
          >
            Continue to Review
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ShippingForm;
