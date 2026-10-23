"use client";

import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/** WebKit (Safari, every iOS browser) cannot draw the alpha channel of VP9 WebM, so it gets the still. */
function canPlayAlphaWebm(): boolean {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) return false;
  if (/AppleWebKit/.test(ua) && !/Chrome|Chromium|Edg|OPR|Firefox/.test(ua)) return false;
  return true;
}

/** A transparent looping clip (VP9 + alpha) with a transparent still as poster and fallback. */
export function AlphaVideo({ src, poster, alt, className = "" }: { src: string; poster: string; alt: string; className?: string }) {
  const [still, setStill] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion() || !canPlayAlphaWebm()) setStill(true);
  }, []);

  if (still) return <img src={poster} alt={alt} draggable={false} className={className} />;
  return (
    <video autoPlay muted loop playsInline poster={poster} aria-label={alt} className={className}>
      <source src={src} type="video/webm" />
    </video>
  );
}
