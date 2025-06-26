import { toast, ToastOptions } from 'react-toastify';

type ToastType = 'success' | 'error' | 'warning' | 'info';

const getDefaultOptions = (isDarkMode: boolean, duration?: number): ToastOptions => ({
  position: 'top-right',
  autoClose: duration || 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: isDarkMode ? 'dark' : 'light',
  style: {
    background: isDarkMode ? '#1f2937' : '#ffffff',
    color: isDarkMode ? '#f9fafb' : '#111827',
    border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
  },
});

export const useToast = () => {
  // We'll get the dark mode state from the context when needed
  const showToast = (message: string, type: ToastType = 'info', isDarkMode: boolean = false, duration?: number) => {
    const options = getDefaultOptions(isDarkMode, duration);

    // Add type-specific styling
    if (type === 'success') {
      options.style = {
        ...options.style,
        borderLeft: `4px solid ${isDarkMode ? '#10b981' : '#10b981'}`,
      };
    } else if (type === 'error') {
      options.style = {
        ...options.style,
        borderLeft: `4px solid ${isDarkMode ? '#ef4444' : '#ef4444'}`,
      };
    } else if (type === 'warning') {
      options.style = {
        ...options.style,
        borderLeft: `4px solid ${isDarkMode ? '#f59e0b' : '#f59e0b'}`,
      };
    } else if (type === 'info') {
      options.style = {
        ...options.style,
        borderLeft: `4px solid ${isDarkMode ? '#3b82f6' : '#3b82f6'}`,
      };
    }

    toast[type](message, options);
  };

  return {
    success: (message: string, isDarkMode: boolean = false, duration?: number) => showToast(message, 'success', isDarkMode, duration),
    error: (message: string, isDarkMode: boolean = false, duration?: number) => showToast(message, 'error', isDarkMode, duration),
    warning: (message: string, isDarkMode: boolean = false, duration?: number) => showToast(message, 'warning', isDarkMode, duration),
    info: (message: string, isDarkMode: boolean = false, duration?: number) => showToast(message, 'info', isDarkMode, duration),
  };
};
