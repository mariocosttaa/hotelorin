import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { useToast } from '../hooks/useToast';

interface ToastMessage {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

interface PageProps {
  toast?: ToastMessage;
  [key: string]: any;
}

export default function DefaultToastManager() {
  const toast = useToast();

  // Try to get dark mode context, but don't fail if it's not available
  let isDarkMode = false;
  try {
    const { useDarkMode } = require('../context/DarkModeContext');
    const darkModeHook = useDarkMode();
    isDarkMode = darkModeHook?.isDarkMode || false;
  } catch (error) {
    // If DarkModeContext is not available, default to light mode
    isDarkMode = false;
  }

  const { toast: pageToast } = usePage<PageProps>().props;

  useEffect(() => {
    if (pageToast?.type && pageToast?.message) {
      toast[pageToast.type](pageToast.message, isDarkMode);
    }
  }, [pageToast, isDarkMode]);

  return null;
};
