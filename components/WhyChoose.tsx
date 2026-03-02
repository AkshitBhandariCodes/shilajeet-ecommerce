'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Zap, Leaf, FlaskConical } from 'lucide-react';

interface BenefitItem {
  emoji?: string;
  icon?: React.ReactNode;
  title: string;
  description: string;
}

const defaultBenefits: BenefitItem[] = [
  {
    icon: <CheckCircle className="w-12 h-12" />,
    title: 'Pure & Potent Formulations',
    description: 'Our TruBlk™ Shilajit embodies the finest expression of Shilajit - contain high fulvic acid, maximum bioavailability, and zero unnecessary fillers.'
  },
  {
    icon: <Leaf className="w-12 h-12" />,
    title: 'Authentic Himalayan Sourcing',
    description: 'We source Shilajit from the untouched high-altitude Himalayan regions, ensuring purity, strength, and natural energy.'
  },
  {
    icon: <FlaskConical className="w-12 h-12" />,
    title: 'Lab-Tested for Safety',
    description: 'Every batch is FSSAI approved, 3rd-party lab verified and tested for heavy metals, ensuring total safety.'
  },
  {
    icon: <Zap className="w-12 h-12" />,
    title: 'GMP, HACCP & FDA-Compliant',
    description: 'Every batch of TruBlk™ undergoes exhaustive screening for heavy metals, solvent residues, microbial contaminants, and adulterants. Manufactured in GMP- and ISO-certified facilities.'
  }
];

interface WhyChooseProps {
  productName?: string;
  whyChooseData?: Array<{
    emoji?: string;
    title: string;
    description: string;
  }>;
}

export default function WhyChoose({ productName = 'Agnishila TruBlk™', whyChooseData }: WhyChooseProps) {
  const benefits: BenefitItem[] = whyChooseData || defaultBenefits;

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-400/5 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 uppercase tracking-wider">
            Why Choose {productName}?
          </h2>
          <div className="w-24 h-1 bg-primary-400 mx-auto"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-jet-900 border border-white/20 p-8 relative overflow-hidden group hover:border-primary-400/50 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-primary-400/30 group-hover:border-t-primary-400/50 transition-all"></div>
              
              <div className="text-primary-400 mb-6">
                {benefit.emoji ? (
                  <span className="text-5xl">{benefit.emoji}</span>
                ) : (
                  benefit.icon
                )}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">
                {benefit.title}
              </h3>
              
              <p className="text-gray-300 leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
