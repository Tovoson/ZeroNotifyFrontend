import { create } from "zustand";
import type { newcontact, contactTypes, Contacts } from "../types/contactType";
import { ContactData } from "../data/datas";
import { SmsStore } from "./smsStore";
import api from "../utils/api";

const initialContact: newcontact = {
  nom: "",
  telephone: "",
  groupe: "Clients",
};

export const contactStores = create<contactTypes>((set, get) => ({
  isLoading: false,
  activeMenu: "dashboard",
  newContact: initialContact,
  contacts: ContactData,
  showAddContactModal: false,

  setNewContact: (newContact) => set({ newContact }),
  setContacts: (contacts) => set({ contacts }),
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
  handleImportContactsCSV: (e: any) => {
    const { setContacts, contacts } = get();
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csv = event.target?.result;

        // ✅ Vérification du type
      if (typeof csv !== 'string') {
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
              id: Date.now() + index,
              nom: nom || `Contact ${index + 1}`,
              telephone: telephone || "",
              groupe: groupe || "Clients",
              date: new Date().toISOString().split("T")[0],
            };
          })
          .filter((c: any) => c.telephone);

        setContacts([...importedContacts, ...contacts])

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
      }
    };
    reader.readAsText(file);
  },

  // Supprimer un contact
  handleDeleteContact : (contactId: number) => {
      //addContact((prev) => prev.filter((c) => c.id !== contactId));
  
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
  handleAddContact : () => {

    const {newContact, contacts, addContact, setNewContact, setShowAddContactModal} = get();
    const {setNotifications} = SmsStore();

    if (!newContact.nom.trim() || !newContact.telephone.trim()) {
      const errorNotif = {
        id: Date.now(),
        type: "error",
        title: "Erreur",
        message: "Nom et téléphone requis",
        time: new Date().toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      //setNotifications((prev) => [errorNotif, ...prev]);
      return;
    }

    const contact = {
      id: Date.now(),
      nom: newContact.nom,
      telephone: newContact.telephone,
      groupe: newContact.groupe,
      date: new Date().toISOString().split("T")[0],
    };

    addContact(contact);
    console.log(contact)
    setNewContact({ nom: "", telephone: "", groupe: "Clients" });
    setShowAddContactModal(false);

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
    setNotifications(successNotif);
  },
  listerContacts: async() => {
    const userId = 1
    const response = await api.get(`/contact/lister-contacts/${userId}`)
    console.log(response)

    set({contacts: response.data})
  }
}));
