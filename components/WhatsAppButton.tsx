'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show button after component mounts (client-side only)
    setIsVisible(true);
  }, []);

  if (!isVisible) return null;

  const whatsappNumber = '918448893545'; // Agnishila WhatsApp number
  const whatsappMessage = 'Hi Agnishila! I would like to know more about your products.';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-40 group"
      aria-label="Chat with us on WhatsApp"
    >
      <div className="relative">
        {/* Animated background pulse */}
        <div className="absolute inset-0 bg-green-500 rounded-full animate-pulse opacity-75"></div>
        
        {/* Main button */}
        <div className="relative w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer">
          <Image
            src="/whatsapp.png"
            alt="WhatsApp"
            width={28}
            height={28}
            className="w-7 h-7"
          />
        </div>

        {/* Tooltip */}
        <div className="absolute left-16 bottom-0 bg-black/90 text-white text-xs font-bold px-3 py-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Chat with us
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-black/90"></div>
        </div>
      </div>
    </a>
  );
}
