'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HorizontalScroll({ 
  children, 
  className,
  showArrows = true,
  showProgress = true,
  keyboardNav = true,
  itemWidth = 300,
  gap = 24,
  title,
  subtitle,
  actionButton
}) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHoveringLeft, setIsHoveringLeft] = useState(false);
  const [isHoveringRight, setIsHoveringRight] = useState(false);
  const autoScrollRef = useRef(null);

  // Check scroll position and calculate progress
  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    
    // Calculate scroll progress (0 to 100)
    const maxScroll = scrollWidth - clientWidth;
    const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
    setScrollProgress(progress);
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [children]);

  // Smooth scroll function
  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = itemWidth + gap;
    const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    
    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  // Auto-scroll on edge hover (like Netflix)
  useEffect(() => {
    if (isHoveringLeft || isHoveringRight) {
      const direction = isHoveringLeft ? -1 : 1;
      autoScrollRef.current = setInterval(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollLeft += direction * 3;
          checkScroll();
        }
      }, 16); // 60fps
    } else {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
        autoScrollRef.current = null;
      }
    }

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [isHoveringLeft, isHoveringRight]);

  // Keyboard navigation
  useEffect(() => {
    if (!keyboardNav) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' && canScrollLeft) {
        scroll('left');
      } else if (e.key === 'ArrowRight' && canScrollRight) {
        scroll('right');
      }
    };

    // Only add listener when container is in view
    const container = scrollContainerRef.current;
    if (container) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            window.addEventListener('keydown', handleKeyDown);
          } else {
            window.removeEventListener('keydown', handleKeyDown);
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(container);

      return () => {
        observer.disconnect();
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [keyboardNav, canScrollLeft, canScrollRight]);

  // Mouse drag to scroll
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.scrollBehavior = 'auto';
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    scrollContainerRef.current.style.scrollBehavior = 'smooth';
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    scrollContainerRef.current.style.scrollBehavior = 'smooth';
  };

  return (
    <div className={cn("relative group", className)}>
      
      {/* Header */}
      {(title || actionButton) && (
        <div className="flex items-center justify-between mb-6 px-4">
          {title && (
            <div>
              {typeof title === 'string' ? (
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {title}
                </h2>
              ) : (
                title
              )}
              {subtitle && (
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          )}
          {actionButton && (
            <div className="hidden md:block">
              {actionButton}
            </div>
          )}
        </div>
      )}

      {/* Scroll Container */}
      <div className="relative">
        
        {/* Left Edge Hover Zone (for auto-scroll) */}
        {canScrollLeft && (
          <div
            className="absolute left-0 top-0 bottom-0 w-20 z-20 hidden lg:block"
            onMouseEnter={() => setIsHoveringLeft(true)}
            onMouseLeave={() => setIsHoveringLeft(false)}
          />
        )}

        {/* Right Edge Hover Zone (for auto-scroll) */}
        {canScrollRight && (
          <div
            className="absolute right-0 top-0 bottom-0 w-20 z-20 hidden lg:block"
            onMouseEnter={() => setIsHoveringRight(true)}
            onMouseLeave={() => setIsHoveringRight(false)}
          />
        )}

        {/* Left Arrow */}
        {showArrows && canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 glass-strong rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg opacity-0 group-hover:opacity-100"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Scrollable Content */}
        <div className="px-4">
          <div
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            className={cn(
              "flex gap-6 overflow-x-auto scrollbar-hide",
              isDragging ? "cursor-grabbing select-none" : "cursor-grab"
            )}
            style={{
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              scrollBehavior: 'smooth'
            }}
          >
            {children}
          </div>
        </div>

        {/* Right Arrow */}
        {showArrows && canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 glass-strong rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg opacity-0 group-hover:opacity-100"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Gradient Fade Edges */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white dark:from-dark-950 to-transparent pointer-events-none z-10" />
        )}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white dark:from-dark-950 to-transparent pointer-events-none z-10" />
        )}
      </div>

      {/* Scroll Progress Indicator */}
      {showProgress && (canScrollLeft || canScrollRight) && (
        <div className="mt-4 px-4">
          <div className="h-1 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden max-w-xs mx-auto opacity-0 group-hover:opacity-100 transition-opacity">
            <div
              className="h-full bg-gradient-primary transition-all duration-300"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Keyboard Hint (appears briefly on first hover) */}
      {keyboardNav && (canScrollLeft || canScrollRight) && (
        <div className="absolute top-2 right-4 opacity-0 group-hover:opacity-60 transition-opacity pointer-events-none">
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <kbd className="px-2 py-1 bg-white dark:bg-dark-800 rounded text-xs font-mono border border-gray-300 dark:border-dark-600">←</kbd>
            <kbd className="px-2 py-1 bg-white dark:bg-dark-800 rounded text-xs font-mono border border-gray-300 dark:border-dark-600">→</kbd>
            <span className="hidden lg:inline">to navigate</span>
          </p>
        </div>
      )}
    </div>
  );
}