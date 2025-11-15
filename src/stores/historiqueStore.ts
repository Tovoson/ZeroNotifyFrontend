import { create } from "zustand";
import type { HistoriqueState } from "../types/historiqueTypes";
import api from "../utils/api";

export const useHistoriqueStore = create<HistoriqueState>((set, get) => ({
  isLoading: false,
  allSms: [],

  setIsLoading: (isLoading) => set({ isLoading }),
  getAllSms: async () => {

    try {
      const response = await api.get("/sms/get-all-sms");

      set({allSms: response.data.data})
    } catch (error) {
      
    }
    return;
  },
}));
