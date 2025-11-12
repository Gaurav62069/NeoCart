import React, { createContext, useState, useContext } from 'react';

// 1. Naya Context banayein
const UIContext = createContext();

// 2. Provider component banayein
export const UIProvider = ({ children }) => {
  // State yeh track karega ki sidebar khula hai ya nahi
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Function jo sidebar kholega (Navbar ise call karega)
  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  // Function jo sidebar band karega (Sidebar khud ise call karega)
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <UIContext.Provider value={{ isSidebarOpen, openSidebar, closeSidebar }}>
      {children}
    </UIContext.Provider>
  );
};

// 3. Custom hook taaki aasani se use kar sakein
export const useUI = () => useContext(UIContext);