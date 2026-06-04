"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface AdminContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

const AdminContext = createContext<AdminContextType>({
  sidebarOpen: false,
  toggleSidebar: () => {},
  closeSidebar: () => {},
});

export function AdminProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar: () => setSidebarOpen((v) => !v),
        closeSidebar: () => setSidebarOpen(false),
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
