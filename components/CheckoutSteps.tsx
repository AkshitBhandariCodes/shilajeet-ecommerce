'use client';

import { motion } from 'framer-motion';
import { User, MapPin, CreditCard, CheckCircle } from 'lucide-react';

type CheckoutStep = 'auth' | 'address' | 'payment' | 'confirmation';

interface CheckoutStepsProps {
  currentStep: CheckoutStep;
}

const steps = [
  { id: 'auth', label: 'Sign In', icon: User },
  { id: 'address', label: 'Address', icon: MapPin },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'confirmation', label: 'Confirmation', icon: CheckCircle },
];

export default function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="bg-jet-900 border border-white/20 p-8 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-0 h-0 border-r-[20px] border-r-transparent border-b-[20px] border-b-primary-400/30"></div>
      
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.id === currentStep;
          const isCompleted = index < currentStepIndex;
          const isAccessible = index <= currentStepIndex;

          return (
            <div key={step.id} className="flex items-center">
              {/* Step Circle */}
              <motion.div
                className={`
                  relative w-12 h-12 border-2 flex items-center justify-center
                  ${isCompleted 
                    ? 'bg-primary-400 border-primary-400' 
                    : isActive 
                      ? 'border-primary-400 bg-transparent' 
                      : 'border-white/20 bg-transparent'
                  }
                `}
                animate={{
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <Icon 
                  size={20} 
                  className={`
                    ${isCompleted 
                      ? 'text-black' 
                      : isActive 
                        ? 'text-primary-400' 
                        : 'text-gray-400'
                    }
                  `} 
                />
                
                {isActive && (
                  <motion.div
                    className="absolute inset-0 border-2 border-primary-400"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                )}
              </motion.div>

              {/* Step Label */}
              <div className="ml-3">
                <div className={`
                  text-sm font-bold uppercase tracking-wider
                  ${isAccessible ? 'text-white' : 'text-gray-500'}
                `}>
                  {step.label}
                </div>
                <div className={`
                  text-xs uppercase tracking-wider
                  ${isCompleted 
                    ? 'text-primary-400' 
                    : isActive 
                      ? 'text-primary-400' 
                      : 'text-gray-500'
                  }
                `}>
                  {isCompleted ? 'Completed' : isActive ? 'Current' : 'Pending'}
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-6">
                  <div className="relative h-0.5 bg-white/20">
                    <motion.div
                      className="absolute inset-0 bg-primary-400"
                      initial={{ width: '0%' }}
                      animate={{ 
                        width: index < currentStepIndex ? '100%' : '0%' 
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}