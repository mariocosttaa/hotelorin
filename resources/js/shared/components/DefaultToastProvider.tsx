import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DefaultToastManager from './DefaultToastManager';

export default function DefaultToastProvider({ children }: { children: React.ReactNode }) {
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

  return (
    <>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme={isDarkMode ? 'dark' : 'light'}
      />
      <DefaultToastManager />
    </>
  );
};
