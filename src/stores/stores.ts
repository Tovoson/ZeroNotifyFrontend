import {create} from 'zustand'
import type { States } from '../types/types'

export const stores = create<States>((set, get) => ({
  sidebarOpen: true,
  activeMenu: "dashboard", 
  
  setActiveMenu: (activeMenu) => set({activeMenu}),
  setSidebarOpen: (sidebarOpen: boolean) => set({sidebarOpen}),

}));