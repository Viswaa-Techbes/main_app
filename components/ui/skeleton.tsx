"use client";

import React from "react";

export function Skeleton({ className = "", height = 12, radius = 12 }: { className?: string; height?: number | string; radius?: number }) {
  const style: React.CSSProperties = {
    height: typeof height === "number" ? `${height}px` : height,
    borderRadius: `${radius}px`,
  };

  return <div className={`skeleton ${className}`} style={style} aria-hidden />;
}

export default Skeleton;
// single implementation above (client-side skeleton with shimmer)
