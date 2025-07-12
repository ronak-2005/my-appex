'use client';

import React, { createContext, useContext, useState } from 'react';
import { MenuIcon } from 'lucide-react';

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

interface SidebarContextType {
  isOpen: boolean;
  toggleSidebar: () => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

const Sidebar: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
}> = ({
  children,
  className = "",
}) => (
  <div className={`flex h-screen text-white ${className}`} style={{ backgroundColor: '#212121' }}>
    {children}
  </div>
);

const SidebarContent: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
}> = ({
  children,
  className = "",
}) => {
  const { isOpen } = useSidebar();
  return (
    <div
      className={`transition-all duration-300 flex flex-col border-r ${
        isOpen ? 'w-64' : 'w-16'
      } ${className}`}
      style={{ 
        backgroundColor: '#181818',
        borderColor: '#2a2a2a',
        height: '100vh'
      }}
    >
      {children}
    </div>
  );
};

const SidebarHeader: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
}> = ({
  children,
  className = "",
}) => (
  <div 
    className={`p-4 border-b flex-shrink-0 ${className}`}
    style={{ borderColor: '#2a2a2a' }}
  >
    {children}
  </div>
);

const SidebarMain: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
}> = ({
  children,
  className = "",
}) => (
  <div className={`flex-1 p-4 min-h-0 ${className}`}>{children}</div>
);

const SidebarFooter: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
}> = ({
  children,
  className = "",
}) => (
  <div 
    className={`p-3 border-t flex-shrink-0 ${className}`}
    style={{ borderColor: '#2a2a2a' }}
  >
    {children}
  </div>
);

const SidebarMenu: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
}> = ({
  children,
  className = "",
}) => (
  <nav className={`space-y-2 ${className}`}>{children}</nav>
);

const SidebarMenuItem: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
}> = ({
  children,
  className = "",
}) => <div className={className}>{children}</div>;

const SidebarMenuButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'purple';
  onClick?: () => void;
}> = ({ 
  children, 
  className = "", 
  variant = "default", 
  onClick
}) => {
  const baseClasses = 'w-full flex items-center justify-start gap-2 py-2 rounded-lg transition-colors text-left';
  const textColor = variant === 'purple' ? '#9333ea' : '#ffffff';

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.backgroundColor = '#2a2a2a'; 
      e.currentTarget.style.textDecorationColor = '#2a2a2a' 
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.backgroundColor = 'transparent'; // purple-600
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${className}`}
      style={{
        color:textColor,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  );
};

const SidebarTrigger: React.FC<{ 
  className?: string; 
  variant?: 'default' | 'logo-hover';
}> = ({
  className = '',
  variant = 'default',
}) => {
  const { isOpen, toggleSidebar } = useSidebar(); // use toggleSidebar directly

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSidebar(); // just toggle it cleanly
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (variant === 'logo-hover') {
      e.currentTarget.style.backgroundColor = '#374151';
      e.currentTarget.style.opacity = '1';
    } else {
      e.currentTarget.style.backgroundColor = '#2a2a2a';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = 'transparent';
    if (variant === 'logo-hover') {
      e.currentTarget.style.opacity = '0';
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-md transition-all duration-200 text-white ${className}`}
      style={{
        opacity: variant === 'logo-hover' ? 0 : 1
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <MenuIcon size={20} />
    </button>
  );
};

export {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarHeader,
  SidebarMain,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
};