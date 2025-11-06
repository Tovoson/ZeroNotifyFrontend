export interface Templates {
  id: number;
  nomTemplate: string;
  categorieTemplate: string;
  contenuTemplate: string;
  variablesTemplate: string[];
  utilisationTemplate: number;
  favoriTemplate: boolean;
  createdAt: string;
}

interface NewTemplate {
  nom: string;
  categorie: string;
  contenu: string;
  variables: string[];
}

export interface templateState {

    templates: Templates[];
    newTemplate: NewTemplate;
    showCreateModal: boolean;

    setTemplates: (templates: Templates[]) => void;
    handleCreateTemplate: (extractV: string[]) => void;
    setNewTemplate: (newTemplate: NewTemplate) => void;
    setShowCreateModal: (showCreateModal: boolean) => void;
    reInitialize: () => void;
    getAllTemplates: () => Promise<void>;
    deleteTemplate: (id: number) => void;
}
