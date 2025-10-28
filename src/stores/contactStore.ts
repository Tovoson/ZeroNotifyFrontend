import { create } from "zustand";
import type { newcontact, contactTypes, Contacts } from "../types/contactType";
import { ContactData } from "../data/datas";
import api from "../utils/api";
import toast from "react-hot-toast";

const initialContact: newcontact = {
  nom: "",
  telephone: "",
  groupe: "Clients",
};

const modifdata = {
  id: 1,
  nom: "",
  telephone: "",
  groupe: "",
  updatedAt: "",
};

export const useContactStores = create<contactTypes>((set, get) => ({
  isLoading: false,
  activeMenu: "dashboard",
  newContact: initialContact,
  contacts: ContactData,
  showAddContactModal: false,
  userId: null,
  modifContact: modifdata,
  isEditing: false,
  groupStats: {},

  setNewContact: (newContact) => set({ newContact }),
  setModifContact: (field, value) => {
    set((state) => ({
      modifContact: { ...state.modifContact, [field]: value },
    }));
  },
  setContacts: (contacts) => {
    get().calculateGroupStats();
    set({ contacts })
  } ,
  addNewContact: (field, value) => {
    set((state) => ({
      newContact: { ...state.newContact, [field]: value },
    }));
  },
  addContact: (contact) => {
    set((state) => ({
      contacts: [contact, ...state.contacts],
    }));
  },
  setShowAddContactModal: (showAddContactModal) => set({ showAddContactModal }),
  // Importer contacts depuis CSV
  handleImportContactsCSV: async (e, userId) => {
    const { listerContacts } = get();

    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier l'extension du fichier
    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast.error("Veuillez sélectionner un fichier CSV");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const csv = event.target?.result;
        set({ isLoading: true });

        if (typeof csv !== "string") {
          throw new Error("Le fichier n'est pas au format texte");
        }

        const lines = csv.split("\n").filter((line: string) => line.trim());

        // Ignorer la première ligne (header)
        const dataLines = lines.slice(1);

        const importedContacts = dataLines
          .map((line: string, index: number) => {
            const [nom, telephone, groupe] = line
              .split(",")
              .map((s) => s.trim());
            return {
              //id: Date.now() + index,
              nom: nom || `Contact ${index + 1}`,
              numero: telephone || "",
              groupe: groupe || "Clients",
              //date: new Date().toISOString().split("T")[0],
            };
          })
          .filter((c: any) => c.numero && c.numero.trim() !== "");

        const contact = {
          contacts: importedContacts,
          utilisateurId: userId,
        };

        console.log(contact);

        try {
          const response = await api.post(
            "/contact/creer-campagne-contacts",
            contact
          );
          console.log(response);
          toast.success(
            `${importedContacts.length} contact(s) importé(s) avec succès`
          );

          listerContacts(userId);
        } catch (error) {
          toast.error("erreur lors de l'ajour des contacts importés");
          console.error(error);
        }

        //setContacts([...importedContacts, ...contacts])

        const successNotif = {
          id: Date.now(),
          type: "success",
          title: "Import réussi",
          message: `${importedContacts.length} contact(s) importé(s)`,
          time: new Date().toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        //setNotifications((prev) => [successNotif, ...prev]);
      } catch (error) {
        const errorNotif = {
          id: Date.now(),
          type: "error",
          title: "Erreur d'import",
          message: "Fichier CSV invalide",
          time: new Date().toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        //setNotifications((prev) => [errorNotif, ...prev]);
      } finally {
        set({ isLoading: false });
        e.target.value = "";
      }
    };
    reader.readAsText(file);
  },

  // Supprimer un contact
  handleDeleteContact: async (contactId, userId) => {
    const { listerContacts } = get();

    try {
      const response = await api.delete(
        `/contact/supprimer-contact/${contactId}`
      );
      toast.success(response.data.message);

      listerContacts(userId);
    } catch (error) {
      console.error(error);
    }
    const successNotif = {
      id: Date.now(),
      type: "success",
      title: "Contact supprimé",
      message: "Le contact a été supprimé",
      time: new Date().toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    //setNotifications((prev) => [successNotif, ...prev]);
  },
  // Ajouter un nouveau contact
  handleAddContact: async (userId) => {
    set({ isLoading: true });
    const {
      newContact,
      contacts,
      addContact,
      setNewContact,
      setShowAddContactModal,
      listerContacts,
    } = get();
    //const {setNotifications} = SmsStore();

    if (!newContact.nom.trim() || !newContact.telephone.trim()) {
      toast.error("nom et numéro requis");
    }

    const contact = {
      contacts: [
        {
          nom: newContact.nom,
          numero: newContact.telephone,
          groupe: newContact.groupe,
        },
      ],
      utilisateurId: userId,
    };

    try {
      const response = await api.post(
        "/contact/creer-campagne-contacts",
        contact
      );
      console.log(response);
      toast.success(response.data.message);
    } catch (error) {
      toast.error("erreur lors de l'ajour du contact");
      console.error(error);
    } finally {
      set({ isLoading: false });
    }

    //addContact(contact);
    console.log(contact);
    setNewContact({ nom: "", telephone: "", groupe: "Clients" });
    setShowAddContactModal(false);
    listerContacts(userId);

    /**
     * 
    const successNotif = {
      id: String(Date.now()),
      type: "success",
      title: "Contact ajouté",
      message: `${contact.nom} a été ajouté avec succès`,
      time: new Date().toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    * 
     */
    //setNotifications(successNotif);
  },
  listerContacts: async (userId) => {
    const response = await api.get(`/contact/lister-contacts/${userId}`);

    set({ contacts: response.data.data });
  },
  selectContactByPk: async (contactId) => {
    set({isEditing: true})
    try {
      const response = await api.get(`/contact/listerByPk/${contactId}`);

      set({ modifContact: response.data.data });
    } catch (error) {
      console.log(error);
    }
  },
  handleModifierContact: async(userId) => {
    set({ isLoading: true });
    const {
      modifContact,
      setNewContact,
      setModifContact,
      setShowAddContactModal,
      listerContacts,
      reInitialiserContact
    } = get();
    //const {setNotifications} = SmsStore();

    if (!modifContact.nom.trim() || !modifContact.telephone.trim()) {
      toast.error("nom et numéro requis");
      return
    }

    const modifContacts = {
      
          nom: modifContact.nom,
          numero: modifContact.telephone,
          groupe: modifContact.groupe,
       
    };

    console.log(modifContacts);
    try {
      
      const response = await api.put(
        `/contact/modifier-contact/${modifContact.id}`,
        modifContacts
      );
      console.log(response.data);
      toast.success(response.data.message);
      
    } catch (error) {
      toast.error("erreur lors de la modification du contact");
      console.error(error);
    } finally {
      set({ isLoading: false });
    }

    reInitialiserContact();
    setShowAddContactModal(false);
    listerContacts(userId);

    /**
     * 
    const successNotif = {
      id: String(Date.now()),
      type: "success",
      title: "Contact ajouté",
      message: `${contact.nom} a été ajouté avec succès`,
      time: new Date().toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    * 
     */
    //setNotifications(successNotif);
  },
  reInitialiserContact: () => {
    set({ 
      isEditing: false,
      modifContact: modifdata
    });
  },
   calculateGroupStats: () => {
    const { contacts } = get();
    const stats = contacts.reduce((acc, contact) => {
      acc[contact.groupe] = (acc[contact.groupe] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    set({ groupStats: stats });
  },
}));
