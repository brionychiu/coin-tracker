import Navbar from '@/components/layout/Navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="flex w-full overflow-hidden pt-16">
        <main className="mx-6 my-10 w-full">{children}</main>
      </div>
    </>
  );
}
