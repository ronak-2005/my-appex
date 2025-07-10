import SideNav from '@/components/SideNav';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function StartLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <div className="flex-1 overflow-y-auto bg-black text-white">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
