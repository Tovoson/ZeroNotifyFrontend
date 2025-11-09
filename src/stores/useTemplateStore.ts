import { create } from "zustand";
import type { Templates, templateState } from "../types/templateType";
import api from "../utils/api";
import toast from "react-hot-toast";

export const useTemplateStore = create<templateState>()(
    (set, get) => ({
      templates: [] ,
      newTemplate: {
        nom: "",
        categorie: "marketing",
        contenu: "",
        variables: [],
      },
      showCreateModal: false,
      isUseTemplate: false,
      useTemplate: {
        id: 0,
        nomTemplate: "",
        categorieTemplate: "",
        contenuTemplate: "",
        variablesTemplate: [],
        utilisationTemplate: 0,
        favoriTemplate: false,
        createdAt: "",
      },

      setTemplates: (templates) => set({ templates }),
      setNewTemplate: (newTemplate) => set({ newTemplate }),
      setShowCreateModal: (showCreateModal: boolean) => set({ showCreateModal }),
      handleCreateTemplate: async (extractV) => {

        const { newTemplate, templates, setTemplates } = get();
        if (!newTemplate.nom || !newTemplate.contenu) return;

        const template = {
          id: new Date().getTime(),
          nomTemplate: newTemplate.nom,
          categorieTemplate: newTemplate.categorie,
          contenuTemplate: newTemplate.contenu,
          variablesTemplate: extractV,
          utilisationTemplate: 0,
          favoriTemplate: false,
          createdAt: new Date().toISOString().split('T')[0],
        };

        try {
          const response = await api.post('/template/creer-template', template);

          toast.success('Modèle créé avec succès !');
          console.log('Template saved:', response.data);
          setTemplates([template, ...templates]);

          get().reInitializeTemplate();
          get().getAllTemplates();
        } catch (error) {
          console.error('Error saving template:', error);
          
        }
        console.log(template);


      },
      reInitializeTemplate: () => {
        get().setNewTemplate({ nom: '', categorie: 'marketing', contenu: '', variables: [] });
        get().setShowCreateModal(false);
        set({ isUseTemplate: false });
        set({ templates: [] });
      },
      getAllTemplates: async () => {
        try {
          const response = await api.get('/template/lister-templates');
          set({ templates: response.data.data });
          //console.log(response.data.data);
        } catch (error) {
          console.error('Error fetching templates:', error);
        }
      },
      deleteTemplate: (id: number) => {
        const { templates, setTemplates } = get();
        setTemplates(templates.filter(t => t.id !== id));
        toast.success('Modèle supprimé avec succès !');
      },
      setUseTemplates: (template: Templates) => {
        set({ isUseTemplate: true });
        const { templates, setTemplates } = get();
        setTemplates(templates.map(t =>
          t.id === template.id ? { ...t, utilisationTemplate: t.utilisationTemplate + 1 } : t
        ));

        set({ useTemplate: template });

        console.log("mon templatessssssss", template);
      },
    })
  
);
