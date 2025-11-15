'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

type ImageWithFallbackProps = Omit<ImageProps, 'onError'> & {
  fallbackSrc?: string;
};

export function ImageWithFallback({
  src,
  fallbackSrc = '/placeholder.jpg',
  alt,
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return <Image {...props} src={imgSrc} alt={alt} onError={() => setImgSrc(fallbackSrc)} />;
}
