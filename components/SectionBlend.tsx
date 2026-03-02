'use client';

interface SectionBlendProps {
  position: 'top' | 'bottom' | 'both';
  height?: 'sm' | 'md' | 'lg' | 'xl';
  intensity?: 'light' | 'medium' | 'heavy';
  className?: string;
}

const heightClasses = {
  sm: 'h-32',
  md: 'h-48', 
  lg: 'h-64',
  xl: 'h-80'
};

const intensityStyles = {
  light: {
    primary: 'rgba(0,0,0,0.6)',
    secondary: 'rgba(0,0,0,0.3)',
    tertiary: 'rgba(0,0,0,0.1)'
  },
  medium: {
    primary: 'rgba(0,0,0,0.8)',
    secondary: 'rgba(0,0,0,0.5)',
    tertiary: 'rgba(0,0,0,0.2)'
  },
  heavy: {
    primary: 'rgba(0,0,0,0.9)',
    secondary: 'rgba(0,0,0,0.7)',
    tertiary: 'rgba(0,0,0,0.4)'
  }
};

export default function SectionBlend({ 
  position, 
  height = 'lg', 
  intensity = 'medium',
  className = '' 
}: SectionBlendProps) {
  const heightClass = heightClasses[height];
  const colors = intensityStyles[intensity];

  const topBlendStyle = {
    background: `
      linear-gradient(to bottom, 
        ${colors.primary} 0%, 
        ${colors.secondary} 25%, 
        ${colors.tertiary} 50%, 
        rgba(0,0,0,0.05) 75%, 
        transparent 100%
      ),
      radial-gradient(ellipse 200% 120% at 50% 0%, 
        ${colors.secondary} 0%, 
        ${colors.tertiary} 30%, 
        rgba(0,0,0,0.05) 60%, 
        transparent 100%
      )
    `
  };

  const bottomBlendStyle = {
    background: `
      linear-gradient(to bottom, 
        transparent 0%, 
        rgba(0,0,0,0.05) 25%, 
        ${colors.tertiary} 50%, 
        ${colors.secondary} 75%, 
        ${colors.primary} 100%
      ),
      radial-gradient(ellipse 200% 120% at 50% 100%, 
        ${colors.secondary} 0%, 
        ${colors.tertiary} 30%, 
        rgba(0,0,0,0.05) 60%, 
        transparent 100%
      )
    `
  };

  return (
    <>
      {(position === 'top' || position === 'both') && (
        <>
          {/* Primary top blend */}
          <div 
            className={`absolute top-0 left-0 right-0 ${heightClass} gradient-feather z-10 ${className} pointer-events-none`}
            style={topBlendStyle}
          />
          
          {/* Secondary feathered edge */}
          <div 
            className="absolute top-0 left-0 right-0 h-32 z-9 pointer-events-none"
            style={{
              background: `
                linear-gradient(to bottom, 
                  ${colors.secondary} 0%, 
                  ${colors.tertiary} 25%, 
                  rgba(0,0,0,0.08) 50%, 
                  rgba(0,0,0,0.03) 75%, 
                  transparent 100%
                )
              `,
              filter: 'blur(1px)'
            }}
          />
        </>
      )}

      {(position === 'bottom' || position === 'both') && (
        <>
          {/* Primary bottom blend */}
          <div 
            className={`absolute bottom-0 left-0 right-0 ${heightClass} gradient-feather z-15 ${className} pointer-events-none`}
            style={bottomBlendStyle}
          />
          
          {/* Secondary feathered edge */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-32 z-14 pointer-events-none"
            style={{
              background: `
                linear-gradient(to bottom, 
                  transparent 0%, 
                  rgba(0,0,0,0.03) 25%, 
                  rgba(0,0,0,0.08) 50%, 
                  ${colors.tertiary} 75%, 
                  ${colors.secondary} 100%
                )
              `,
              filter: 'blur(1px)'
            }}
          />
        </>
      )}
    </>
  );
}