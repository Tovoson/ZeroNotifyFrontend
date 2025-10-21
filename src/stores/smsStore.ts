import { create } from "zustand";
import type { SmsState } from "../types/smsType";
import toast from "react-hot-toast";
import { notifs } from "../data/datas";

export const SmsStore = create<SmsState>((set, get) => ({
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
  handleSubmit: async (e) => {
    e.preventDefault();
    set({ loading: true });

    const { expediteur, destinataires, contenu, smsType, datePlanifiee } =
      get();

    const payload = {
      expediteur: expediteur || "ZeroNotify",
      destinataires: destinataires.filter((d) => d.trim() !== ""),
      contenu,
      utilisateurId: 1,
      ...(smsType === "planifie" && datePlanifiee && { datePlanifiee }),
    };

    try {
      // Simuler l'envoi (remplacez par votre API)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("SMS envoyé:")
      console.log("SMS envoyé:", payload);
      //alert("SMS envoyé avec succès !");

      // Reset form
      set({ destinataires: [""], contenu: "", datePlanifiee: "" });
    } catch (error) {
      alert("Erreur lors de l'envoi");
    } finally {
      set({ loading: false });
    }
  },
  handleImportCSV : (e) => {
      const file = e.target.files?.[0];

      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const csv = event.target?.result;
          const lines = csv
            ?.split("\n")
            .map(({ line }: any) => line.trim())
            .filter(({ line }: any) => line);
          set({destinataires: lines});
        };
        reader.readAsText(file);
      }
    },
    reInitialiser: () => set({contenu: "", destinataires: [""], datePlanifiee:"", expediteur: ""}),
    setNotifications: (newNotif) => {
      const {notifications} = get()
      set({
        notifications: [newNotif, ...notifications].slice(0, 10)
      });
}
}));