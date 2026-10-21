'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Volume2, VolumeX } from 'lucide-react';
import { usePaperSound } from '../hooks/usePaperSound';
import { PORTFOLIO_PAGES } from '../data/portfolio';

export default function FlipBookPortfolio() {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const { playFlipSound, FLIP_DURATION } = usePaperSound(soundEnabled);
  const totalPages = PORTFOLIO_PAGES.length;

  // 1. Preload all images into the browser cache right on mount
  useEffect(() => {
    PORTFOLIO_PAGES.forEach((page) => {
      if (page?.imageUrl) {
        const img = new Image();
        img.src = encodeURI(page.imageUrl);
      }
    });
  }, []);

  const turnNext = useCallback(() => {
    if (isFlipping || currentPage >= totalPages - 1) return;
    setIsFlipping(true);
    setFlipDirection('next');
    playFlipSound();

    setTimeout(() => {
      setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
      setIsFlipping(false);
      setFlipDirection(null);
    }, FLIP_DURATION);
  }, [isFlipping, currentPage, totalPages, playFlipSound, FLIP_DURATION]);

  const turnPrev = useCallback(() => {
    if (isFlipping || currentPage <= 0) return;
    setIsFlipping(true);
    setFlipDirection('prev');
    playFlipSound();

    setTimeout(() => {
      setCurrentPage((prev) => Math.max(prev - 1, 0));
      setIsFlipping(false);
      setFlipDirection(null);
    }, FLIP_DURATION);
  }, [isFlipping, currentPage, playFlipSound, FLIP_DURATION]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        turnNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        turnPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [turnNext, turnPrev]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const firstTouch = e.touches[0];
    touchStartX.current = firstTouch.clientX;
    touchStartY.current = firstTouch.clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 45) {
      if (deltaX < 0) turnNext();
      else turnPrev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: '100vh',
        width: '100%',
        background: 'radial-gradient(ellipse at 50% 30%, #4a0d4e 0%, #200424 60%, #110214 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 16px',
        userSelect: 'none',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background-color: #110214 !important;
        }
        @keyframes singlePageFlipNext {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(-180deg); }
        }
        @keyframes singlePageFlipPrev {
          0% { transform: rotateY(-180deg); }
          100% { transform: rotateY(0deg); }
        }
        .flip-page-next {
          transform-origin: left center !important;
          animation: singlePageFlipNext ${FLIP_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
        }
        .flip-page-prev {
          transform-origin: left center !important;
          animation: singlePageFlipPrev ${FLIP_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
        }
        .preserve-purple-face {
          -webkit-backface-visibility: hidden !important;
          backface-visibility: hidden !important;
          background-color: #2b0630 !important;
        }
      `}</style>

      {/* Hidden container so the browser keeps all images decoded and cached */}
      <div style={{ display: 'none' }} aria-hidden="true">
        {PORTFOLIO_PAGES.map((page) =>
          page.imageUrl ? (
            <img key={page.id} src={encodeURI(page.imageUrl)} alt={page.alt || ''} />
          ) : (
            <div key={page.id} style={{ color: '#fff' }}>{page.title}</div>
          )
        )}
      </div>

      {/* Top Controls */}
      <header
        style={{
          width: '100%',
          maxWidth: '750px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '12px',
          zIndex: 20,
        }}
      >
        <span
          style={{
            fontSize: '12px',
            fontFamily: 'monospace',
            color: '#F2D7F7',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '6px 14px',
            borderRadius: '9999px',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {`${currentPage + 1} / ${totalPages}`}
        </span>

        <button
          type="button"
          onClick={() => setSoundEnabled(!soundEnabled)}
          style={{
            padding: '8px',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            color: '#F2D7F7',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
          }}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>

        <button
          type="button"
          onClick={() => {
            if (!document.fullscreenElement) {
              containerRef.current?.requestFullscreen?.();
              setIsFullscreen(true);
            } else {
              document.exitFullscreen?.();
              setIsFullscreen(false);
            }
          }}
          style={{
            padding: '8px',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            color: '#F2D7F7',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
          }}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </header>

      {/* Main Single Page Stage */}
      <main
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '780px',
          aspectRatio: '21 / 14.8',
          maxHeight: '75vh',
          perspective: '2000px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 'auto 0',
          touchAction: 'pan-y',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: '10px',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7), 0 0 45px rgba(175, 40, 200, 0.25)',
            transformStyle: 'preserve-3d',
            backgroundColor: '#2b0630',
            overflow: 'hidden',
          }}
        >
          {/* Base Active Page */}
          <RenderPortfolioPage
            page={PORTFOLIO_PAGES[flipDirection === 'next' ? currentPage + 1 : currentPage]}
          />

          {/* 3D Animated Flip Leaf */}
          {isFlipping && (
            <div
              className={flipDirection === 'next' ? 'flip-page-next' : 'flip-page-prev'}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                zIndex: 40,
                pointerEvents: 'none',
                transformStyle: 'preserve-3d',
                backgroundColor: '#2b0630',
              }}
            >
              <div className="preserve-purple-face" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                <RenderPortfolioPage
                  page={PORTFOLIO_PAGES[flipDirection === 'next' ? currentPage : currentPage - 1]}
                />
              </div>

              <div className="preserve-purple-face" style={{ position: 'absolute', inset: 0, transform: 'rotateY(180deg)', overflow: 'hidden' }}>
                <RenderPortfolioPage
                  page={PORTFOLIO_PAGES[flipDirection === 'next' ? currentPage + 1 : currentPage]}
                />
              </div>
            </div>
          )}

          {/* Hotspots */}
          <div
            onClick={turnPrev}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              width: '20%',
              cursor: currentPage > 0 ? 'pointer' : 'default',
              zIndex: 30,
            }}
          />
          <div
            onClick={turnNext}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              width: '20%',
              cursor: currentPage < totalPages - 1 ? 'pointer' : 'default',
              zIndex: 30,
            }}
          />
        </div>
      </main>

      {/* Footer Navigation */}
      <footer
        style={{
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '8px 20px',
          backgroundColor: 'rgba(38, 7, 43, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          borderRadius: '9999px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
        }}
      >
        <button
          type="button"
          onClick={turnPrev}
          disabled={currentPage === 0 || isFlipping}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '14px',
            color: currentPage === 0 ? 'rgba(255, 255, 255, 0.25)' : '#F5D8FF',
            background: 'none',
            border: 'none',
            cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          <ChevronLeft size={16} /> صفحه ی قبل
        </button>

        <div style={{ display: 'flex', gap: '6px' }}>
          {PORTFOLIO_PAGES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (idx !== currentPage && !isFlipping) {
                  playFlipSound();
                  setCurrentPage(idx);
                }
              }}
              style={{
                height: '6px',
                width: currentPage === idx ? '22px' : '6px',
                borderRadius: '9999px',
                backgroundColor: currentPage === idx ? '#FFD54F' : 'rgba(255, 255, 255, 0.25)',
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
          onClick={turnNext}
          disabled={currentPage >= totalPages - 1 || isFlipping}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '14px',
            color: currentPage >= totalPages - 1 ? 'rgba(255, 255, 255, 0.25)' : '#F5D8FF',
            background: 'none',
            border: 'none',
            cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          صقحه ی بعد <ChevronRight size={16} />
        </button>
      </footer>
    </div>
  );
}

function SingleImagePage({ page }: { page?: { imageUrl?: string; alt?: string; title?: string } }) {
  if (!page?.imageUrl) return null;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #a832a8 0%, #68176e 50%, #430c48 100%)',
      }}
    >
      <img
        src={encodeURI(page.imageUrl)}
        alt={page.alt}
        decoding="async"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

// 2. Separate component dedicated ONLY to title/text pages
function SingleTitlePage({ page }: { page: { title?: string } }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #4a0d4e 0%, #200424 60%, #110214 100%)',
        padding: '32px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          // border: '1px solid rgba(255, 255, 255, 0.15)',
          // borderRadius: '16px',
          padding: '40px',
          width: '85%',
          height: '80%',
          // background: 'rgba(255, 255, 255, 0.04)',
          // backdropFilter: 'blur(8px)',
        }}
      >
        <h6
          style={{
            color: '#FDF4FF',
            fontSize: '1.7rem',
            fontWeight: 800,
            margin: 0,
            textAlign: 'center',
            letterSpacing: '1.5px',
          }}
        >
          {page.title}
        </h6>
        <div
          style={{
            width: '48px',
            height: '3px',
            borderRadius: '9999px',
            backgroundColor: '#FFD54F',
          }}
        />
      </div>
    </div>
  );
}

// 3. Dispatcher component that selects the correct function
function RenderPortfolioPage({
  page,
}: {
  page?: { imageUrl?: string | undefined; alt?: string; title?: string | undefined };
}) {
  if (!page) return null;

  if (page.imageUrl) {
    return <SingleImagePage page={{ imageUrl: page.imageUrl, alt: page.alt }} />;
  }

  return <SingleTitlePage page={{ title: page.title }} />;
}

