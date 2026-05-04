"use client";

import { useRef, useState, type ReactNode } from "react";

type SwipeableRowProps = {
  children: ReactNode;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  className?: string;
};

const THRESHOLD = 80;

export function SwipeableRow({ children, onSwipeLeft, onSwipeRight, className }: SwipeableRowProps) {
  const startX = useRef(0);
  const startY = useRef(0);
  const currentX = useRef(0);
  const swiping = useRef(false);
  const [offsetX, setOffsetX] = useState(0);

  function handleTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    currentX.current = 0;
    swiping.current = false;
  }

  function handleTouchMove(e: React.TouchEvent) {
    const dx = e.touches[0].clientX - startX.current;
    const dy = e.touches[0].clientY - startY.current;

    // Lock direction on first significant move
    if (!swiping.current && Math.abs(dx) < 10 && Math.abs(dy) < 10) return;

    if (!swiping.current) {
      // If vertical scroll dominates, bail out
      if (Math.abs(dy) > Math.abs(dx)) return;
      swiping.current = true;
    }

    currentX.current = dx;
    setOffsetX(dx);
  }

  function handleTouchEnd() {
    if (!swiping.current) return;

    const dx = currentX.current;

    if (dx < -THRESHOLD) {
      onSwipeLeft();
    } else if (dx > THRESHOLD) {
      onSwipeRight();
    }

    swiping.current = false;
    currentX.current = 0;
    setOffsetX(0);
  }

  const bgColor = offsetX > 30 ? "rgba(239,68,68,0.25)" : offsetX < -30 ? "rgba(34,197,94,0.25)" : "transparent";

  return (
    <div
      className={className}
      style={{ backgroundColor: bgColor, transition: offsetX === 0 ? "background-color 0.2s" : "none" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: offsetX === 0 ? "transform 0.2s" : "none",
        }}
      >
        {children}
      </div>
    </div>
  );
}
