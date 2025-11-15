import { create } from "zustand";
import type { States } from "../types/types";
import { persist } from "zustand/middleware";

export const useStores = create(
  persist<States>(
    (set) => ({
      sidebarOpen: true,
      activeMenu: "dashboard",

      setActiveMenu: (activeMenu) => set({ activeMenu }),
      setSidebarOpen: (sidebarOpen: boolean) => set({ sidebarOpen }),
      syncActiveMenuFromURL: () => {
        const path = window.location.pathname;
        const menuMap: Record<string, string> = {
          "/dashboard": "dashboard",
          "/contact": "contact",
          "/send-sms": "sms",
          "/history": "history",
          "/template": "template",
          "/service": "service",
          "/parametre": "parametre",
        };

        const menuId = menuMap[path] || "dashboard";
        set({ activeMenu: menuId });
      },
    }),
    {
      name: "app-store", // Nom du stockage
    }
  )
);
