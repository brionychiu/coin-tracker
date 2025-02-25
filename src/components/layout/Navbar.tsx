import icon from '@/assets/images/icon.png';
import AuthModal from '@/components/modal/Auth';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-system-02 fixed left-0 top-0 z-50 w-full shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center">
          <div className="px-2">
            <Image
              className="rounded-md"
              src={icon}
              alt="Logo Icon"
              width={32}
              height={40}
              priority={true}
            />
          </div>
          <div className="ml-2 flex flex-col">
            <span className="text-base font-bold">開心記帳</span>
            <span className="text-xs">邁向快樂理財之路</span>
          </div>
        </Link>
        <div className="flex space-x-4">
          <AuthModal />
        </div>
      </div>
    </nav>
  );
}
