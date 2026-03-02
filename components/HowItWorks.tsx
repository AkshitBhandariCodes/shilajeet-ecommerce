'use client';

import { motion } from 'framer-motion';
import { ShoppingCart, Package, Truck, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: <ShoppingCart className="w-8 h-8" />,
    title: 'Order',
    description: 'Browse our premium TruBlk™ collection and add your favorite products to cart'
  },
  {
    icon: <Package className="w-8 h-8" />,
    title: 'Lab Tested',
    description: 'Every batch is FSSAI approved, 3rd-party lab verified for purity and safety'
  },
  {
    icon: <Truck className="w-8 h-8" />,
    title: 'Delivery',
    description: 'Fast and secure delivery to your doorstep with tracking'
  },
  {
    icon: <CheckCircle className="w-8 h-8" />,
    title: 'Experience',
    description: 'Feel the difference with clinically validated, globally compliant Shilajit'
  }
];

export default function HowItWorks() {
  return (
    <></>
  );
}
