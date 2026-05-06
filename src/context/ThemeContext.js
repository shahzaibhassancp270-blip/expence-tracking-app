import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleDark = () => setIsDark(prev => !prev);

  const theme = {
    isDark,
    colors: {
      background: isDark ? '#121212' : '#F8F9FA',
      surface: isDark ? '#1E1E1E' : '#FFFFFF',
      text: isDark ? '#FFFFFF' : '#212121',
      textSecondary: isDark ? '#B0B0B0' : '#757575',
      border: isDark ? '#333333' : '#E0E0E0',
      primary: '#00BFA5',
      secondary: '#00796B',
      error: '#FF5252',
      success: '#4CAF50',
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
