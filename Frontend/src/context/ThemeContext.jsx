import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Naya Context banayein
const ThemeContext = createContext();

// 2. Provider component banayein
export const ThemeProvider = ({ children }) => {
  // 'theme' state banayein aur default value localStorage se lein (ya 'dark')
  const [theme, setTheme] = useState(() => {
    const localTheme = localStorage.getItem('theme');
    return localTheme || 'dark'; // Default mein dark mode
  });

  // Jab bhi 'theme' state badlega, yeh effect chalega
  useEffect(() => {
    const root = window.document.documentElement; // HTML tag
    
    if (theme === 'dark') {
      root.classList.add('dark'); // HTML tag par 'dark' class add karein
    } else {
      root.classList.remove('dark'); // 'dark' class hata dein
    }
    
    // Nayi theme ko localStorage mein save karein
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Theme ko toggle karne ka function
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Custom hook
export const useTheme = () => useContext(ThemeContext);