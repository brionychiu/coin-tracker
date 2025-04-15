import Image from 'next/image';

export default function FullscreenLoading() {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70">
      <Image
        src="/Loading-1.gif"
        alt="Loading..."
        width={160}
        height={160}
        className="animate-pulse drop-shadow-[0_0_10px_white]"
      />
    </div>
  );
}
