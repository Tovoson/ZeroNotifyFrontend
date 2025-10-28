import { create } from "zustand";
import type { HistoriqueState } from "../types/historiqueTypes";
import { historiqueData } from "../data/datas";
import api from "../utils/api";

export const useHistoriqueStore = create<HistoriqueState>((set, get) => ({
  isLoading: false,
  allSms: historiqueData,

  setIsLoading: (isLoading) => set({ isLoading }),
  getAllSms: async (userId) => {

    try {
      const response = await api.get(`/sms/get-all-sms/${userId}`);

      set({allSms: response.data.data})
    } catch (error) {
      
    }
    return;
  },
}));
