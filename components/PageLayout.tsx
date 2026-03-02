'use client';

import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import SectionBlend from './SectionBlend';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  showNavbar?: boolean;
  showFooter?: boolean;
  backgroundImage?: string;
  blendTop?: boolean;
  blendBottom?: boolean;
  blendIntensity?: 'light' | 'medium' | 'heavy';
}

export default function PageLayout({
  children,
  className = '',
  showNavbar = true,
  showFooter = true,
  backgroundImage = 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090389/agnishila/bg/vd.jpg',
  blendTop = true,
  blendBottom = true,
  blendIntensity = 'medium'
}: PageLayoutProps) {
  return (
    <main className={`min-h-screen bg-black relative ${className}`}>
      {/* Universal background */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {showNavbar && <Navbar />}
      
      <div className="relative z-10">
        {children}
      </div>

      {showFooter && <Footer />}

      {/* Universal section blending */}
      {(blendTop || blendBottom) && (
        <SectionBlend 
          position={blendTop && blendBottom ? 'both' : blendTop ? 'top' : 'bottom'} 
          height="xl" 
          intensity={blendIntensity} 
        />
      )}
    </main>
  );
}