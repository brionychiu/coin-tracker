'use client';

import Image from 'next/image';

interface FullscreenLoadingProps {
  gifSrc?: string;
  alt?: string;
}

export const FullscreenLoading = ({
  gifSrc = '/loading-1.gif',
  alt = '資料載入中...',
}: FullscreenLoadingProps) => {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-400/40 backdrop-blur-sm" />
      <div className="relative z-10">
        <Image
          src={gifSrc}
          alt={alt}
          width={160}
          height={160}
          className="animate-pulse drop-shadow-[0_0_10px_white]"
        />
      </div>
    </div>
  );
};
