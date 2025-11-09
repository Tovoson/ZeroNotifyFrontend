interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: string;
}

export interface SmsState {
  smsType: string;
  destinataires: string[];
  expediteur: string;
  contenu: string;
  datePlanifiee: string;
  loading: boolean;
  notifications: Notification[],
  quotaSms: number;
  detailsError: Record<string, any>;
  showCreateModal: boolean;

  setSmsType: (setType: string) => void;
  setDestinataires: (destinataires: string[]) => void;
  setExpediteur : (expediteur: string) => void;
  setContenu: (contenu: string) => void;
  setDatePlanifiee: (datePlanifiee: string) => void;
  ajouterDestinataire: () => void;
  supprimerDestinataire: (index: number) => void;
  updateDestinataire: (index: number, value: string) => void;
  caractereRestants: (template: string) => number;
  segmentsSMS: () => number;
  setLoading: (loading: boolean) => void;
  handleSubmit : (e: any) => void;
  handleImportFile : (e: any) => void;
  reInitialiser: () => void;
  setNotifications: (newNotif: Notification) => void;
  ajouterDestinataires: (phones: string[]) => void;
  setQuotaSms: (quotaSms: number) => void;
  getQuotaSms: () => Promise<void>;
  setShowCreateModal: (show: boolean) => void;

}
