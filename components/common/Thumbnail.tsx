import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

export default function Thumbnail({
  imageName,
  className,
  ...props
}: { imageName: string; className?: string } & Omit<ImageProps, 'src' | 'alt'>) {
  const [imageSrc, setImageSrc] = useState<string>(`/thumbnail/${imageName}`);

  return (
    <Image
      src={imageSrc}
      alt={'썸네일 이미지'}
      width={600}
      height={300}
      className={className}
      onError={() => setImageSrc('/thumbnail/default_thumbnail.jpeg')}
      {...props}
    />
  );
}
