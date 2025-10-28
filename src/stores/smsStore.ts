import { create } from "zustand";
import type { SmsState } from "../types/smsType";
import toast from "react-hot-toast";
import { notifs } from "../data/datas";
import api from "../utils/api";

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
  handleImportCSV: (e) => {
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
