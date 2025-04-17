import { AppSidebar } from '@/components/layout/AppSidebar';
import Navbar from '@/components/layout/Navbar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Navbar />
      <div className="flex w-full overflow-hidden pt-16">
        <AppSidebar />
        <main className="m-4 w-full">{children}</main>
      </div>
    </SidebarProvider>
  );
}
