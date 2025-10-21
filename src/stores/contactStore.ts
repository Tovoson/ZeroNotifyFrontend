import {create} from 'zustand'
import type { States } from '../types/types'
import type { contactTypes } from '../types/contactType';

export const stores = create<contactTypes>((set, get) => ({
  isLoading: false,
  activeMenu: "dashboard", 
  
  handleImportContactCSV: (e:any) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const result = event.target?.result;

        // Vérifier que c'est bien une string
        if (typeof result === "string") {
          const lines = result
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line); // Filtrer les lignes vides

          set({ destinataires: lines });
        }
      };
      reader.readAsText(file);
    }
  },
}));