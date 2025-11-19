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
      set({ allSms: response.data.data });
    } catch (error) {
      console.error("Erreur lors de la récupération des SMS:", error);
    }
  },

  // Nouvelle fonction pour annuler un SMS planifié
  cancelScheduledSms: async (smsId: number) => {
    try {
      set({ isLoading: true });
      const response = await api.delete(`/sms/cancel-scheduled/${smsId}`);
      
      // Mettre à jour la liste locale
      const updatedSms = get().allSms.filter(sms => sms.id !== smsId);
      set({ allSms: updatedSms });
      
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'annulation du SMS:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));