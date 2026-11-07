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
  quotaSms: 0,
  detailsError: {},
  showCreateModal: false,
  destinatairesDynamique: [],
  showProgress: false,
  progressPercent: 0,
  progressEnvoyes: 0,
  progressEchecs: 0,
  progressTotal: 0,
  progressStatus: "idle",

  setSmsType: (smsType) => set({ smsType }),
  setDestinataires: (destinataires) => set({ destinataires }),
  setExpediteur: (expediteur) => set({ expediteur }),
  setContenu: (contenu) => set({ contenu: contenu }),
  setDatePlanifiee: (datePlanifiee) => set({ datePlanifiee }),
  setLoading: (loading) => set({ loading }),

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

    const {
      expediteur,
      destinataires,
      contenu,
      smsType,
      datePlanifiee,
      destinatairesDynamique,
      reInitialiser,
    } = get();
    const { isUseTemplate, useTemplate, reInitializeTemplate } =
      useTemplateStore.getState();

    try {
      //  Afficher la barre de progression
      const total = isUseTemplate 
        ? destinatairesDynamique.length 
        : destinataires.length;

      set({
        showProgress: true,
        progressStatus: "loading",
        progressPercent: 0,
        progressEnvoyes: 0,
        progressEchecs: 0,
        progressTotal: total,
      });

      let response;

      //Si template existe
      if (isUseTemplate) {
        const payload = {
          expediteur: expediteur || "ZeroNotify",
          destinataires: destinatairesDynamique,
          templateId: useTemplate.id,
          ...(smsType === "planifie" && datePlanifiee && { datePlanifiee }),
        };

        response = await api.post("/sms/send-using-template", payload);
      } else {
        const dest = destinatairesDynamique.map(
          (destinataire) => destinataire.numero
        );

        const payload = {
          expediteur: expediteur || "ZeroNotify",
          destinataires:
            destinataires.length === 1
              ? destinataires
              : dest.filter((d) => d.trim() !== ""),
          contenu: contenu,
          templateId: null,
          ...(smsType === "planifie" && datePlanifiee && { datePlanifiee }),
        };

        response = await api.post("/sms/send-sms", payload);
      }

      const data = response.data.data;
      const percent = Math.round((data.soumis / data.totalDestinataires) * 100);

      set({
        progressPercent: percent,
        progressEnvoyes: data.soumis || 0,
        progressEchecs: data.echecsInsertion || 0,
        progressStatus: "success",
      });

      toast.success(response.data.message);

      // Fermer après 2 secondes
      setTimeout(() => {
        set({ showProgress: false });
        set({ destinataires: [""], contenu: "", datePlanifiee: "" });
        reInitializeTemplate();
      }, 2000);

      set({ destinataires: [""], contenu: "", datePlanifiee: "" });
      reInitializeTemplate();
      reInitialiser();
      set({ loading: false });
    } catch (error: any) {
      console.error("Erreur envoi SMS:", error);

      //  Afficher l'erreur
      set({
        progressStatus: "error",
        progressPercent: 0,
      });

      toast.error(error.response?.data?.message || "Erreur lors de l'envoi");

      // Fermer après 3 secondes
      setTimeout(() => {
        set({ showProgress: false });
      }, 3000);
    } finally {
      set({ loading: false });
    }
  },

  handleImportFile: (e) => {
    //const { loading } = get();
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          set({ loading: true });
          //console.log(loading);

          const arrayBuffer = event.target?.result;

          if (arrayBuffer instanceof ArrayBuffer) {
            const workbook = XLSX.read(arrayBuffer, { type: "array" });

            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];

            // Convertir en JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            const headers: any = jsonData[0];

            // Extraire les numéros (colonne B)
            const structuredData = jsonData
              .slice(1) // Ignorer l'en-tête
              .map((row: any) => {
                const rowData: { [key: string]: any } = {};

                row.forEach((value: any, index: number) => {
                  const headerName = String(headers[index]).trim();

                  rowData[headerName] = String(value).trim();
                });

                return rowData;
              })
              .filter((row) => {
                return row && row["numero"];
              });

            set({ destinatairesDynamique: structuredData });

            //console.log("10. Fichier importé:", structuredData);
            //console.log(loading);
          } else {
            console.error("Pas un ArrayBuffer!");
          }
        } catch (error) {
          console.log(error);
        } finally {
          set({ loading: false });
        }
      };

      reader.onerror = (error) => {
        set({ loading: false });
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
      destinatairesDynamique: [],
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
