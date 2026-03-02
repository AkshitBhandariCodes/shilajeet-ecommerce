'use client';

import { motion } from 'framer-motion';

interface TwoRaisinsValidationProps {
  isValidated: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function TwoRaisinsValidation({ 
  isValidated, 
  size = 'md',
  showLabel = true 
}: TwoRaisinsValidationProps) {
  if (!isValidated) return null;

  const sizeClasses = {
    sm: 'text-lg gap-1 px-2 py-1 text-xs',
    md: 'text-2xl gap-2 px-3 py-2 text-sm',
    lg: 'text-3xl gap-3 px-4 py-3 text-base'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex items-center ${sizeClasses[size]} bg-gradient-to-r from-primary-400/15 to-primary-400/5 border border-primary-400/40 rounded-lg w-fit`}
    >
      
      
    </motion.div>
  );
}
