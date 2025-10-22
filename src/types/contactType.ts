export interface newcontact {
    nom: string,
    telephone: string,
    groupe: string,
}

export interface Contacts {
  id: number;
  nom: string;
  telephone: string;
  groupe: string;
  date: string;
}

export interface contactTypes{
    isLoading: boolean,
    newContact: newcontact,
    contacts: Contacts[]
    showAddContactModal: boolean,

    setNewContact: (newContact: newcontact) => void;
    setContacts: (contact: Contacts[]) => void;
    addContact: (contact: Contacts) => void;
    addNewContact: (field: keyof newcontact, value: string) => void;
    setShowAddContactModal: (showAddContactModal: boolean) => void;
    handleImportContactsCSV: (e:any) => void;
    handleAddContact: () => void;
    listerContacts: () => void;
}