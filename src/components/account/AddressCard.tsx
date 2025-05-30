
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Star } from 'lucide-react';
import { Address } from './AddressSection';

interface AddressCardProps {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}) => {
  return (
    <Card className={`relative ${address.is_default ? 'ring-2 ring-boutique-accent' : ''}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-boutique-charcoal">{address.label}</h3>
            {address.is_default && (
              <Badge variant="secondary" className="bg-boutique-accent text-white">
                <Star className="h-3 w-3 mr-1" />
                Default
              </Badge>
            )}
          </div>
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-1 text-sm text-boutique-grey">
          <p className="font-medium text-boutique-charcoal">
            {address.first_name} {address.last_name}
          </p>
          <p>{address.address}</p>
          <p>
            {address.city}, {address.state} {address.zip_code}
          </p>
          <p>{address.country}</p>
          {address.phone && <p>Phone: {address.phone}</p>}
        </div>

        {!address.is_default && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <Button
              variant="outline"
              size="sm"
              onClick={onSetDefault}
              className="w-full"
            >
              Set as Default
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AddressCard;
