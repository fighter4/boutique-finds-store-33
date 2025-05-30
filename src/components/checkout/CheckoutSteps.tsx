
import React from 'react';
import { Check } from 'lucide-react';

interface CheckoutStepsProps {
  currentStep: number;
}

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ currentStep }) => {
  const steps = [
    { id: 1, name: 'Shipping', description: 'Enter your shipping address' },
    { id: 2, name: 'Review', description: 'Review your order details' },
    { id: 3, name: 'Payment', description: 'Enter payment information' },
    { id: 4, name: 'Complete', description: 'Order confirmation' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <nav aria-label="Progress">
        <ol className="flex items-center">
          {steps.map((step, stepIdx) => (
            <li key={step.id} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''} flex-1`}>
              {stepIdx !== steps.length - 1 && (
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className={`h-0.5 w-full ${currentStep > step.id ? 'bg-boutique-accent' : 'bg-gray-200'}`} />
                </div>
              )}
              <div className="relative flex items-center justify-center">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    currentStep > step.id
                      ? 'bg-boutique-accent text-white'
                      : currentStep === step.id
                      ? 'bg-boutique-accent text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <div className="ml-4 min-w-0 flex flex-col">
                  <span
                    className={`text-sm font-medium ${
                      currentStep >= step.id ? 'text-boutique-charcoal' : 'text-gray-500'
                    }`}
                  >
                    {step.name}
                  </span>
                  <span className="text-sm text-boutique-grey">{step.description}</span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default CheckoutSteps;
