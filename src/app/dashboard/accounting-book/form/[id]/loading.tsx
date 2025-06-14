import Image from 'next/image';

export default function FormLoadingPage() {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70">
      <Image
        src="/Loading-1.gif"
        alt="Loading..."
        width={240}
        height={240}
        priority
        className="animate-pulse drop-shadow-[0_0_10px_white]"
      />
    </div>
  );
}
