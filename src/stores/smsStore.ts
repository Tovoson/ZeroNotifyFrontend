import { create } from "zustand";
import type { SmsState } from "../types/smsType";
import toast from "react-hot-toast";
import { notifs } from "../data/datas";
import api from "../utils/api";
import * as XLSX from "xlsx";
import { useTemplateStore } from "./useTemplateStore";

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
  setContenu: (contenu) => set({ contenu: contenu }),
  setDatePlanifiee: (datePlanifiee) => set({ datePlanifiee }),
  setLoading: (loading) => set({ loading }),
  quotaSms: 0,
  detailsError: {},
  showCreateModal: false,

  setQuotaSms: (quotaSms) => set({ quotaSms }),
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
  caractereRestants: (template: string) => {
    const { contenu } = get();

    if (template && template.length > 0) {
      return 160 - (template.length % 160 || 160);
    }

    return 160 - (contenu.length % 160 || 160);
  },
  segmentsSMS: () => {
    const { contenu } = get();

    return Math.ceil(contenu.length / 160);
  },
  handleSubmit: async (e) => {
    e.preventDefault();
    set({ loading: true });

    const { expediteur, destinataires, contenu, smsType, datePlanifiee } =
      get();
    const { isUseTemplate, useTemplate, reInitializeTemplate } =
      useTemplateStore.getState();

    const finalContenu = isUseTemplate ? useTemplate.contenuTemplate : contenu;

    try {
      if (isUseTemplate) {
        const payload = {
          expediteur: expediteur || "ZeroNotify",
          destinataires: destinataires.filter((d) => d.trim() !== ""),
          contenu: finalContenu,
          templateId: useTemplate.id,
          ...(smsType === "planifie" && datePlanifiee && { datePlanifiee }),
        };

        const responseTemplate = await api.post(
          "/sms/send-using-template",
          payload
        );
        toast.success("SMS envoyé:" + responseTemplate.data.message);
        console.log(responseTemplate.data.message);
      } else {

        const payload = {
          expediteur: expediteur || "ZeroNotify",
          destinataires: destinataires.filter((d) => d.trim() !== ""),
          contenu: contenu,
          templateId: null,
          ...(smsType === "planifie" && datePlanifiee && { datePlanifiee }),
        };

        const response = await api.post("/sms/send-sms", payload);

        toast.success("SMS envoyé:" + response.data.message);
        console.log(response.data.message);
      }

      // Reset form
      set({ destinataires: [""], contenu: "", datePlanifiee: "" });
      reInitializeTemplate();
    } catch (error) {
      console.log(error.response.data.details || error.message);
      set({ detailsError: error.response.data.details });
      set({ showCreateModal: true });
    } finally {
      set({ loading: false });
    }
  },
  handleImportFile: (e) => {
    const file = e.target.files?.[0];
    console.log("1. Fichier sélectionné:", file);

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const arrayBuffer = event.target?.result;

        if (arrayBuffer instanceof ArrayBuffer) {
          const workbook = XLSX.read(arrayBuffer, { type: "array" });

          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];

          // Convertir en JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          // Extraire les numéros (colonne B)
          const phoneNumbers = jsonData
            .slice(1) // Ignorer l'en-tête
            .map((row: any) => {
              console.log("Row:", row);
              return row[0]; // Colonne A
            })
            .filter((num) => {
              return num;
            })
            .map((num) => String(num).trim());

          set({ destinataires: phoneNumbers });
        } else {
          console.error("Pas un ArrayBuffer!");
        }
      };

      reader.onerror = (error) => {
        console.error("Erreur FileReader:", error);
      };

      reader.readAsArrayBuffer(file);
      console.log("10. Lecture lancée");
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
  getQuotaSms: async () => {
    try {
      const response = await api.get("/sms/quota");
      console.log("Quota SMS récupéré:", response.data.data.messageRestant);
      set({ quotaSms: response.data.data.messageRestant });
    } catch (error) {
      console.error("Erreur lors de la récupération du quota SMS:", error);
    }
  },
  setShowCreateModal: (show) => set({ showCreateModal: show }),
}));
