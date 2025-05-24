'use client';

import Image from 'next/image';

interface FullscreenLoadingProps {
  gifSrc?: string;
  message?: string;
}

export const FullscreenLoading = ({
  gifSrc = '/loading-1.gif',
  message = '資料載入中...',
}: FullscreenLoadingProps) => {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-400/40 backdrop-blur-sm" />
      <div className="relative z-10 flex flex-col items-center space-y-2">
        <Image
          src={gifSrc}
          alt={message}
          width={300}
          height={300}
          className="animate-pulse drop-shadow-[0_0_10px_white]"
          unoptimized
        />
        <p className="text-xl font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
          {message}
        </p>
      </div>
    </div>
  );
};
