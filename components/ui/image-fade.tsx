"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

export default function ImageWithFade(props: ImageProps & { className?: string }){
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${props.className ?? ''}`}>
      {!loaded && <div className="absolute inset-0 skeleton-glass" />}
      <Image
        {...props}
        className={`transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} ${props.className ?? ''}`}
        onLoadingComplete={() => setLoaded(true)}
        loading={props.loading ?? 'lazy'}
      />
    </div>
  );
}
