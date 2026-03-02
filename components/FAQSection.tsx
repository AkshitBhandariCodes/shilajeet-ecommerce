'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FAQ {
    question: string;
    answer: string;
}

interface FAQSectionProps {
    faqs?: FAQ[];
    title?: string;
}

const defaultFAQs: FAQ[] = [
    
];

export default function FAQSection({ faqs = defaultFAQs, title = 'Frequently Asked Questions' }: FAQSectionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-20 bg-black relative">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl lg:text-5xl font-bold text-white-to-mauve mb-4 uppercase tracking-wider">
                        {title}
                    </h2>
                    <p className="text-gray-300 text-lg">
                        Find answers to common questions about our products
                    </p>
                </motion.div>

                {/* FAQ List */}
                <div className="space-y-4 mb-16">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="bg-jet-900 border border-white/20 overflow-hidden"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                            >
                                <h3 className="text-lg font-bold text-white pr-8">
                                    {faq.question}
                                </h3>
                                <div className="flex-shrink-0 w-8 h-8 bg-primary-400/20 border border-primary-400/30 flex items-center justify-center">
                                    {openIndex === index ? (
                                        <Minus className="w-5 h-5 text-primary-400" />
                                    ) : (
                                        <Plus className="w-5 h-5 text-primary-400" />
                                    )}
                                </div>
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 pb-6 pt-2 border-t border-white/10">
                                            <p className="text-gray-300 leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
                
                {/* Contact CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="mt-16 bg-jet-900 border border-white/20 p-8 text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-primary-400/30"></div>

                    <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">
                        Still Have Questions?
                    </h3>
                    <p className="text-gray-300 mb-6">
                        Our customer support team is here to help you with any queries
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/contact"
                            className="bg-mauve-gradient text-white px-8 py-3 font-bold uppercase tracking-wider text-sm hover:bg-mauve-shine transition-colors"
                        >
                            Contact Us
                        </a>
                        <a
                            href="mailto:info@agnishila.in"
                            className="border-2 border-primary-400 text-primary-400 px-8 py-3 font-bold uppercase tracking-wider text-sm hover:bg-primary-400 hover:text-white transition-colors"
                        >
                            Email Support
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
