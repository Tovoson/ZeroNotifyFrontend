import { create } from "zustand";
import type { SmsState } from "../types/smsType";
import toast from "react-hot-toast";
import { notifs } from "../data/datas";
import api from "../utils/api";
import * as XLSX from 'xlsx';

export const useSmsStore = create<SmsState>((set, get) => ({
  smsType: "simple",
  destinataires: [],
  expediteur: "",
  contenu: "",
  datePlanifiee: "",
  loading: false,
  notifications: notifs,

  setSmsType: (smsType) => set({ smsType }),
  setDestinataires: (destinataires) => set({ destinataires }),
  setExpediteur: (expediteur) => set({ expediteur }),
  setContenu: (contenu) => set({ contenu }),
  setDatePlanifiee: (datePlanifiee) => set({ datePlanifiee }),
  setLoading: (loading) => set({ loading }),

  ajouterDestinataire: () => {
    const { destinataires } = get();
    set({ destinataires: [...destinataires, ""] });
  },
  supprimerDestinataire: (index) => {
    const { destinataires } = get();
    const nouveaux = destinataires.filter((_, i) => i !== index);

    set({ destinataires: nouveaux.length > 0 ? nouveaux : [""] });
  },
  updateDestinataire: (index, value) => {
    const { destinataires } = get();
    const nouveaux = [...destinataires];
    nouveaux[index] = value;

    set({ destinataires: nouveaux });
  },
  caractereRestants: () => {
    const { contenu } = get();

    return 160 - (contenu.length % 160 || 160);
  },
  segmentsSMS: () => {
    const { contenu } = get();

    return Math.ceil(contenu.length / 160);
  },
  handleSubmit: async (e, userId) => {
    e.preventDefault();
    set({ loading: true });

    const { expediteur, destinataires, contenu, smsType, datePlanifiee } =
      get();

    const payload = {
      expediteur: expediteur || "ZeroNotify",
      destinataires: destinataires.filter((d) => d.trim() !== ""),
      contenu,
      utilisateurId: userId,
      ...(smsType === "planifie" && datePlanifiee && { datePlanifiee }),
    };

    try {
      // Simuler l'envoi (remplacez par votre API)
      const response = await api.post('/sms/send-sms', payload)
      console.log("SMS envoyé:", response.data);
      toast.success("SMS envoyé:"+response.data.message);
      //alert("SMS envoyé avec succès !");

      // Reset form
      set({ destinataires: [""], contenu: "", datePlanifiee: "" });
    } catch (error) {
      alert("Erreur lors de l'envoi");
    } finally {
      set({ loading: false });
    }
  },
  handleImportFile: (e) => {
  const file = e.target.files?.[0];
  console.log('1. Fichier sélectionné:', file)

  if (file) {
    const reader = new FileReader();

    reader.onload = (event) => {
      const arrayBuffer = event.target?.result;

      if (arrayBuffer instanceof ArrayBuffer) {
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convertir en JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Extraire les numéros (colonne B)
        const phoneNumbers = jsonData
          .slice(1) // Ignorer l'en-tête
          .map((row: any) => {
            console.log('Row:', row);
            return row[0]; // Colonne A
          })
          .filter((num) => {
            return num;
          })
          .map((num) => String(num).trim());
        
        set({ destinataires: phoneNumbers });
      } else {
        console.error('Pas un ArrayBuffer!');
      }
    };
    
    reader.onerror = (error) => {
      console.error('Erreur FileReader:', error);
    };
    
    reader.readAsArrayBuffer(file);
    console.log('10. Lecture lancée');
  }
},
  reInitialiser: () =>
    set({
      contenu: "",
      destinataires: [""],
      datePlanifiee: "",
      expediteur: "",
    }),
  setNotifications: (newNotif) => {
    const { notifications } = get();
    set({
      notifications: [newNotif, ...notifications].slice(0, 10),
    });
  },
  ajouterDestinataires: (phones: string[]) => {
    set((state) => ({
      destinataires: [
        ...state.destinataires.filter((d) => d.trim()),
        ...phones,
      ],
    }));
  },
}));
