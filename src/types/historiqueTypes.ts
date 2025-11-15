export type Statut = "envoye" | "echec" | "planifie" | "en_attente";

export interface BadgeConfig {
  bg: string;
  text: string;
  label: string;
}

export interface SMSDetails {
  id: number;
  expediteur: string;
  destinataires: string[];
  contenu: string | string[];
  statut: "en_attente" | "envoye" | "planifie" | "echec";
  dateEnvoi: string | null;
  date_planifiee: string | null;
  total: number;
  envoyes: number;
  echecs: number;
  type: "simple" | "groupe" | "planifie";
  isPlaned: boolean;
  templateId: number | null;
  createdAt: string;
  updatedAt: string;
  utilisateur_id?: number;
  contact_id?: number | null;
}

export interface HistoriqueState{
    isLoading: boolean,
    allSms: SMSDetails[],

    setIsLoading: (isLoading: boolean) => void;
    getAllSms: () => Promise<void>
}