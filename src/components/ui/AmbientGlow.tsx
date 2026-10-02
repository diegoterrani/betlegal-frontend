import React from 'react';

interface Blob {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  size: number;
  color: string;
}

interface AmbientGlowProps {
  blobs?: Blob[];
}

/**
 * No-op under the minimalist direction (no ambient glow/blur in a serious,
 * professional layout). Kept as a component so call sites across the app
 * don't need to be touched if a future direction brings decoration back.
 */
export const AmbientGlow: React.FC<AmbientGlowProps> = () => null;
