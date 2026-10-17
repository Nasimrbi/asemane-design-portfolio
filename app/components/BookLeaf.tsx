import React from 'react';
import { PortfolioPage } from '../data/portfolio';


export function PageImage({ page }: { page?: PortfolioPage }) {
  if (!page?.imageUrl) {
    return <div style={{ width: '100%', height: '100%', backgroundColor: '#0f0f12' }} />;
  }

  return (
    <img
      src={encodeURI(page.imageUrl)}
      alt={page.alt}
      loading="lazy"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
        pointerEvents: 'none',
      }}
    />
  );
}

interface CornerCurlProps {
  side: 'left' | 'right';
  isHovered: boolean;
  isDragging: boolean;
  dragProgress: number;
  onMouseDown: (e: React.MouseEvent) => void;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function CornerCurl({
  side,
  isHovered,
  isDragging,
  dragProgress,
  onMouseDown,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: CornerCurlProps) {
  const isLeft = side === 'left';
  const rotation = isLeft ? dragProgress * 15 : -dragProgress * 15;
  const hoverRotation = isLeft ? -6 : 6;

  return (
    <div
      onMouseDown={onMouseDown}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'absolute',
        bottom: 0,
        [isLeft ? 'left' : 'right']: 0,
        width: '70px',
        height: '70px',
        cursor: 'pointer',
        zIndex: 30,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: isLeft ? 'flex-start' : 'flex-end',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          [isLeft ? 'borderTopRightRadius' : 'borderTopLeftRadius']: '8px',
          transition: 'all 0.2s ease-out',
          transformOrigin: isLeft ? 'bottom left' : 'bottom right',
          background: isLeft
            ? 'linear-gradient(45deg, rgba(0,0,0,0.4) 0%, #888 60%, #fff 100%)'
            : 'linear-gradient(-45deg, rgba(0,0,0,0.4) 0%, #888 60%, #fff 100%)',
          boxShadow: isLeft ? '-2px 2px 8px rgba(0,0,0,0.3)' : '2px 2px 8px rgba(0,0,0,0.3)',
          transform: isDragging
            ? `scale(${1 + dragProgress * 0.8}) rotate(${rotation}deg)`
            : isHovered
            ? `scale(1.2) rotate(${hoverRotation}deg)`
            : 'scale(1)',
          opacity: isHovered ? 1 : 0.6,
        }}
      />
    </div>
  );
}