import { DarkModeProvider } from '@/js/shared/context/DarkModeContext';
import '@/css/tailwind.css';
import React from 'react';

interface PanelDefaultLayoutProps {
  children: React.ReactNode;
}

export default function PanelDefaultLayout({ children }: PanelDefaultLayoutProps) {
  return (
    <DarkModeProvider>
      {children}
    </DarkModeProvider>
  );
}
