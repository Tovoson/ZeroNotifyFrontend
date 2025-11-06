import type { newError, RegisterData } from "../types/types";

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  
  // Obtenir les composants de la date
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 car les mois vont de 0 à 11
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}h${minutes}`;
};

export const validateForm = (registerData: RegisterData, acceptTerms: boolean) => {

    const newErrors: newError = {};

    if (!registerData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }

    if (!registerData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!registerData.mot_de_passe) {
      newErrors.mot_de_passe = 'Le mot de passe est requis';
    } else if (registerData.mot_de_passe.length < 6) {
      newErrors.mot_de_passe = 'Minimum 6 caractères';
    }

    if (registerData.mot_de_passe !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (!acceptTerms) {
      newErrors.terms = 'Vous devez accepter les conditions';
    }

    return {
    errors: newErrors,
    isValid: Object.keys(newErrors).length === 0
  };
  };

export const extractVariables = (text: string) => {
          const regex = /\{([^}]+)\}/g;
          const matches: string[] = [];
          let match;
          while ((match = regex.exec(text)) !== null) {
            if (!matches.includes(match[1])) {
              matches.push(match[1]);
            }
          }
          return matches;
        };