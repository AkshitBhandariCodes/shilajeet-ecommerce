'use client';

import { ReactNode } from 'react';
import SectionBlend from './SectionBlend';

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  background?: 'black' | 'jet' | 'transparent' | 'gradient';
  blendTop?: boolean;
  blendBottom?: boolean;
  blendHeight?: 'sm' | 'md' | 'lg' | 'xl';
  blendIntensity?: 'light' | 'medium' | 'heavy';
  backgroundImage?: string;
  overlay?: boolean;
  overlayIntensity?: 'light' | 'medium' | 'heavy';
}

const backgroundClasses = {
  black: 'bg-black',
  jet: 'bg-jet-950',
  transparent: 'bg-transparent',
  gradient: 'bg-gradient-to-br from-black via-jet-950 to-black'
};

const overlayIntensities = {
  light: 'bg-black/20',
  medium: 'bg-black/40',
  heavy: 'bg-black/60'
};

export default function SectionWrapper({
  children,
  className = '',
  background = 'transparent',
  blendTop = true,
  blendBottom = true,
  blendHeight = 'lg',
  blendIntensity = 'medium',
  backgroundImage,
  overlay = false,
  overlayIntensity = 'medium'
}: SectionWrapperProps) {
  const blendPosition = blendTop && blendBottom ? 'both' : blendTop ? 'top' : blendBottom ? 'bottom' : undefined;

  return (
    <section className={`relative overflow-hidden ${backgroundClasses[background]} ${className}`}>
      {/* Background image if provided */}
      {backgroundImage && (
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          {overlay && (
            <div className={`absolute inset-0 ${overlayIntensities[overlayIntensity]}`} />
          )}
        </div>
      )}

      {/* Section blending */}
      {blendPosition && (
        <SectionBlend 
          position={blendPosition} 
          height={blendHeight} 
          intensity={blendIntensity} 
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
}