import {
  Calendar,
  CheckCircle,
  Clock,
  MessageSquare,
  Search,
  Send,
  User,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import Layout from "./Layout";
import type { BadgeConfig, SMSDetails, Statut } from "../types/historiqueTypes";
import { useHistoriqueStore } from "../stores/historiqueStore";
import { useAuthStore } from "../stores/authStore";
import { formatDate } from "../utils/validateur";

export const Historique = () => {
  const [searchHistorique, setSearchHistorique] = useState("");
  const [filterStatut, setFilterStatut] = useState("tous");
  const [selectedSMS, setSelectedSMS] = useState<SMSDetails | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { getAllSms, allSms, cancelScheduledSms } = useHistoriqueStore();
  const { user } = useAuthStore();

  // Fonction pour annuler un SMS planifié
  const handleCancelScheduled = async (smsId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir annuler ce SMS planifié ?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await cancelScheduledSms(smsId);
      setSelectedSMS(null);
      await getAllSms(); // Rafraîchir la liste
    } catch (error) {
      console.error("Erreur lors de l'annulation:", error);
      alert("Erreur lors de l'annulation du SMS planifié");
    } finally {
      setIsDeleting(false);
    }
  };

  // Fonction pour parser le contenu (peut être string ou array)
  const parseContenu = (contenu: any): string[] => {
    if (typeof contenu === "string") {
      try {
        const parsed = JSON.parse(contenu);
        return Array.isArray(parsed) ? parsed : [contenu];
      } catch {
        return [contenu];
      }
    }
    return Array.isArray(contenu) ? contenu : [String(contenu)];
  };

  // Fonction pour parser les destinataires
  const parseDestinataires = (destinataires: any): string[] => {
    if (typeof destinataires === "string") {
      try {
        const parsed = JSON.parse(destinataires);
        return Array.isArray(parsed) ? parsed : [destinataires];
      } catch {
        return [destinataires];
      }
    }
    return Array.isArray(destinataires) ? destinataires : [String(destinataires)];
  };

  // Fonction pour obtenir un aperçu du contenu
  const getContenuApercu = (sms: any): string => {
    const contenus = parseContenu(sms.contenu);
    
    if (sms.type === "simple") {
      return contenus[0] || "";
    }
    
    // Pour les SMS groupés, afficher un résumé
    if (contenus.length > 1) {
      return `${contenus.length} messages personnalisés`;
    }
    
    return contenus[0] || "";
  };

  // Fonction pour calculer la longueur totale des contenus
  const getTotalLength = (contenus: string[]): number => {
    return contenus.reduce((acc, c) => acc + c.length, 0);
  };

  const filteredHistorique = allSms.filter((sms) => {
    const contenus = parseContenu(sms.contenu);
    const matchSearch =
      sms.expediteur.toLowerCase().includes(searchHistorique.toLowerCase()) ||
      contenus.some(c => c.toLowerCase().includes(searchHistorique.toLowerCase()));
    const matchStatut = filterStatut === "tous" || sms.statut === filterStatut;
    return matchSearch && matchStatut;
  });

  const getStatutBadge = (statut: Statut): BadgeConfig => {
    const badges = {
      envoye: { bg: "bg-green-100", text: "text-green-700", label: "Envoyé" },
      echec: { bg: "bg-red-100", text: "text-red-700", label: "Échec" },
      planifie: {
        bg: "bg-orange-100",
        text: "text-orange-700",
        label: "Planifié",
      },
      en_attente: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        label: "En attente",
      },
    };
    return badges[statut] || badges.en_attente;
  };

  if (!user) {
    return <div>Veuillez vous connecter</div>;
  }

  useEffect(() => {
    getAllSms();
  }, [user.id]);

  return (
    <Layout>
      <Header />
      <div className="p-8">
        {/* Modal Détails SMS */}
        {selectedSMS && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  Détails du SMS
                </h2>
                <button
                  onClick={() => setSelectedSMS(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Statut */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <span className="font-semibold text-slate-900">Statut</span>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      getStatutBadge(selectedSMS.statut).bg
                    } ${getStatutBadge(selectedSMS.statut).text}`}
                  >
                    {getStatutBadge(selectedSMS.statut).label}
                  </span>
                </div>

                {/* Informations générales */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-500 mb-1">Expéditeur</p>
                    <p className="font-semibold text-slate-900">
                      {selectedSMS.expediteur}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-500 mb-1">Type</p>
                    <p className="font-semibold text-slate-900 capitalize">
                      {selectedSMS.type}
                    </p>
                  </div>
                </div>

                {/* Métriques */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl text-center">
                    <p className="text-3xl font-bold text-blue-600">
                      {selectedSMS.total}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">Total</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl text-center">
                    <p className="text-3xl font-bold text-green-600">
                      {selectedSMS.envoyes}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">Envoyés</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-xl text-center">
                    <p className="text-3xl font-bold text-red-600">
                      {selectedSMS.echecs}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">Échecs</p>
                  </div>
                </div>

                {/* Dates */}
                <div>
                  <p className="text-sm font-semibold text-slate-900 mb-2">
                    Dates
                  </p>
                  <div className="space-y-2">
                    {selectedSMS.dateEnvoi && (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-600">
                          Envoyé le : {formatDate(selectedSMS.dateEnvoi)}
                        </span>
                      </div>
                    )}
                    {selectedSMS.date_planifiee && (
                      <div className="flex items-center justify-between gap-3 p-3 bg-orange-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-orange-500" />
                          <span className="text-sm text-orange-600">
                            Planifié pour : {selectedSMS.date_planifiee}
                          </span>
                        </div>
                        {selectedSMS.statut === "planifie" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelScheduled(selectedSMS.id);
                            }}
                            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Annuler
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Messages et Destinataires - Version améliorée */}
                <div>
                  <p className="text-sm font-semibold text-slate-900 mb-2">
                    {selectedSMS.type === "simple" && parseDestinataires(selectedSMS.destinataires).length > 1
                      ? `Message envoyé à ${parseDestinataires(selectedSMS.destinataires).length} destinataires`
                      : `Messages (${parseContenu(selectedSMS.contenu).length})`}
                  </p>
                  <div className="max-h-96 overflow-y-auto space-y-3">
                    {/* Cas 1: SMS simple avec plusieurs destinataires (même message) */}
                    {selectedSMS.type === "simple" && parseDestinataires(selectedSMS.destinataires).length > 1 ? (
                      <>
                        {/* Afficher le message une seule fois */}
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                          <p className="text-slate-700 whitespace-pre-wrap mb-3">
                            {parseContenu(selectedSMS.contenu)[0]}
                          </p>
                          
                          {/* Stats du message */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                            <span className="text-xs text-slate-500">
                              {parseContenu(selectedSMS.contenu)[0].length} caractères
                            </span>
                            <span className="text-xs text-slate-500">
                              {Math.ceil(parseContenu(selectedSMS.contenu)[0].length / 160)} segment(s)
                            </span>
                          </div>
                        </div>
                        
                        {/* Liste des destinataires */}
                        <div className="p-4 bg-blue-50 rounded-xl">
                          <p className="text-sm font-semibold text-slate-700 mb-3">
                            Destinataires ({parseDestinataires(selectedSMS.destinataires).length})
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {parseDestinataires(selectedSMS.destinataires).map((dest, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 p-2 bg-white rounded-lg"
                              >
                                <User className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                <span className="text-sm text-slate-700 truncate">
                                  {dest}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      /* Cas 2: SMS groupé avec messages personnalisés */
                      parseContenu(selectedSMS.contenu).map((contenu, idx) => {
                        const destinataires = parseDestinataires(selectedSMS.destinataires);
                        const destinataire = destinataires[idx] || "Inconnu";
                        
                        return (
                          <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                            {/* Destinataire */}
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
                              <User className="w-4 h-4 text-blue-500" />
                              <span className="text-sm font-semibold text-slate-700">
                                {destinataire}
                              </span>
                            </div>
                            
                            {/* Contenu du message */}
                            <p className="text-slate-700 whitespace-pre-wrap mb-3">
                              {contenu}
                            </p>
                            
                            {/* Stats du message */}
                            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                              <span className="text-xs text-slate-500">
                                {contenu.length} caractères
                              </span>
                              <span className="text-xs text-slate-500">
                                {Math.ceil(contenu.length / 160)} segment(s)
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  
                  {/* Statistiques globales */}
                  <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-700 font-semibold">Total</span>
                      <div className="flex gap-4">
                        <span className="text-slate-600">
                          {getTotalLength(parseContenu(selectedSMS.contenu))} caractères
                        </span>
                        <span className="text-slate-600">
                          {Math.ceil(
                            getTotalLength(parseContenu(selectedSMS.contenu)) / 160
                          )}{" "}
                          segment(s)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedSMS(null)}
                className="w-full mt-6 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-semibold transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        )}

        {/* Filtres et recherche */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchHistorique}
                onChange={(e) => setSearchHistorique(e.target.value)}
                placeholder="Rechercher dans l'historique..."
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatut("tous")}
                className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                  filterStatut === "tous"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setFilterStatut("envoye")}
                className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                  filterStatut === "envoye"
                    ? "bg-green-500 text-white"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                Envoyés
              </button>
              <button
                onClick={() => setFilterStatut("planifie")}
                className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                  filterStatut === "planifie"
                    ? "bg-orange-500 text-white"
                    : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                }`}
              >
                Planifiés
              </button>
              <button
                onClick={() => setFilterStatut("echec")}
                className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                  filterStatut === "echec"
                    ? "bg-red-500 text-white"
                    : "bg-red-100 text-red-700 hover:bg-red-200"
                }`}
              >
                Échecs
              </button>
            </div>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm mb-1">Total SMS</p>
                <p className="text-3xl font-bold text-slate-900">
                  {allSms.length}
                </p>
              </div>
              <MessageSquare className="w-12 h-12 text-slate-300" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm mb-1">Envoyés</p>
                <p className="text-3xl font-bold text-green-600">
                  {allSms.filter((s) => s.statut === "envoye").length}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-300" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm mb-1">Planifiés</p>
                <p className="text-3xl font-bold text-orange-600">
                  {allSms.filter((s) => s.statut === "planifie").length}
                </p>
              </div>
              <Clock className="w-12 h-12 text-orange-300" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm mb-1">Échecs</p>
                <p className="text-3xl font-bold text-red-600">
                  {allSms.filter((s) => s.statut === "echec").length}
                </p>
              </div>
              <XCircle className="w-12 h-12 text-red-300" />
            </div>
          </div>
        </div>

        {/* Liste de l'historique */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">
              Historique des envois ({filteredHistorique.length})
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredHistorique.length === 0 ? (
              <div className="p-12 text-center">
                <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-lg font-semibold">
                  Aucun SMS trouvé
                </p>
                <p className="text-slate-400 text-sm mt-2">
                  Essayez de modifier vos filtres
                </p>
              </div>
            ) : (
              filteredHistorique.map((sms: any) => {
                const badge = getStatutBadge(sms.statut);
                const contenus = parseContenu(sms.contenu);
                const destinataires = parseDestinataires(sms.destinataires);
                const apercu = getContenuApercu(sms);
                
                return (
                  <div
                    key={sms.id}
                    onClick={() => setSelectedSMS(sms)}
                    className="p-6 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <Send className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-slate-900">
                              {sms.expediteur}
                            </p>
                            {sms.type === "groupe" && contenus.length > 1 && (
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                                Groupe
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-500">
                            {formatDate(sms.dateEnvoi) ||
                              `Planifié pour ${sms.date_planifiee}`}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}
                      >
                        {badge.label}
                      </span>
                    </div>

                    <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                      {apercu}
                    </p>

                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">
                          {destinataires.length} destinataire(s)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-slate-600">
                          {sms.envoyes} envoyé(s)
                        </span>
                      </div>
                      {sms.echecs > 0 && (
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-500" />
                          <span className="text-slate-600">
                            {sms.echecs} échec(s)
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">
                          {Math.ceil(getTotalLength(contenus) / 160)} segment(s)
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};