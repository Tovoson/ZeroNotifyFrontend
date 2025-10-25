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
  updatedAt: string;
}

export interface contactTypes{
    isLoading: boolean,
    newContact: newcontact,
    contacts: Contacts[]
    showAddContactModal: boolean,
    modifContact: Contacts,
    isEditing: boolean,
    groupStats: Record<string, number>;

    setNewContact: (newContact: newcontact) => void;
    setContacts: (contact: Contacts[]) => void;
    addContact: (contact: Contacts) => void;
    addNewContact: (field: keyof newcontact, value: string) => void;
    setShowAddContactModal: (showAddContactModal: boolean) => void;
    handleImportContactsCSV: (e:any) => void;
    handleAddContact: (userId: number) => void;
    listerContacts: (userId: number) => void;
    handleDeleteContact: (contactId: number, userId: number) => void;
    handleModifierContact: (userId: number) => void;
    selectContactByPk: (contactId: number) => void;
    setModifContact: (field: keyof Contacts, value: string) => void;
    reInitialiserContact: () => void;
    calculateGroupStats: () => void;
}