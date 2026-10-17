import React from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Volume2, VolumeX } from 'lucide-react';

export function HeaderControls({
  currentPage,
  totalPages,
  soundEnabled,
  isFullscreen,
  onToggleSound,
  onToggleFullscreen,
}: {
  currentPage: number;
  totalPages: number;
  soundEnabled: boolean;
  isFullscreen: boolean;
  onToggleSound: () => void;
  onToggleFullscreen: () => void;
}) {
  return (
    <header
      style={{
        width: '100%',
        maxWidth: '860px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '10px',
        zIndex: 20,
      }}
    >
      <span
        style={{
          fontSize: '11px',
          fontFamily: 'monospace',
          color: '#AAA',
          backgroundColor: 'rgba(255,255,255,0.06)',
          padding: '6px 14px',
          borderRadius: '9999px',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {`${currentPage + 1}–${currentPage + 2} / ${totalPages}`}
      </span>

      <button
        type="button"
        onClick={onToggleSound}
        style={{
          padding: '8px',
          borderRadius: '9999px',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#DDD',
          cursor: 'pointer',
        }}
      >
        {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </button>

      <button
        type="button"
        onClick={onToggleFullscreen}
        style={{
          padding: '8px',
          borderRadius: '9999px',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#DDD',
          cursor: 'pointer',
        }}
      >
        {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
      </button>
    </header>
  );
}

export function FooterControls({
  currentPage,
  totalPages,
  isFlipping,
  onPrev,
  onNext,
  onSelectSpread,
}: {
  currentPage: number;
  totalPages: number;
  isFlipping: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSelectSpread: (spreadIndex: number) => void;
}) {
  const totalSpreads = Math.ceil(totalPages / 2);

  return (
    <footer
      style={{
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '8px 18px',
        backgroundColor: 'rgba(20, 20, 24, 0.85)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '9999px',
      }}
    >
      <button
        type="button"
        onClick={onPrev}
        disabled={currentPage === 0 || isFlipping}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '11px',
          color: currentPage === 0 ? '#444' : '#CCC',
          background: 'none',
          border: 'none',
          cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
          textTransform: 'uppercase',
        }}
      >
        <ChevronLeft size={16} /> Prev
      </button>

      <div style={{ display: 'flex', gap: '6px' }}>
        {Array.from({ length: totalSpreads }).map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectSpread(idx * 2)}
            style={{
              height: '6px',
              width: currentPage === idx * 2 ? '22px' : '6px',
              borderRadius: '9999px',
              backgroundColor: currentPage === idx * 2 ? '#FFF' : 'rgba(255,255,255,0.25)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0,
            }}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={currentPage >= totalPages - 2 || isFlipping}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '11px',
          color: currentPage >= totalPages - 2 ? '#444' : '#CCC',
          background: 'none',
          border: 'none',
          cursor: currentPage >= totalPages - 2 ? 'not-allowed' : 'pointer',
          textTransform: 'uppercase',
        }}
      >
        Next <ChevronRight size={16} />
      </button>
    </footer>
  );
}