export type Statut = "envoye" | "echec" | "planifie" | "en_attente";

export interface BadgeConfig {
  bg: string;
  text: string;
  label: string;
}

export interface SMSDetails {
  id: number;
  statut: "envoye" | "echec" | "planifie" | "en_attente";
  expediteur: string;
  type: "simple" | "groupe" | "planifie"
  total: number;
  envoyes: number;
  echecs: number;
  dateEnvoi?: string;
  datePlanifiee?: string | null;
  contenu: string;
  destinataires: string[];
}

export interface HistoriqueState{
    isLoading: boolean,
    allSms: SMSDetails[],

    setIsLoading: (isLoading: boolean) => void;
    getAllSms: (userId: number) => Promise<void>
}