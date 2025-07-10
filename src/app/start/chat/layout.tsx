import { SidebarProvider } from '@/components/ui/sidebar';
import SideNav from '@/components/SideNav';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
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
