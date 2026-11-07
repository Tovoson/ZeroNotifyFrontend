import {
  Calendar,
  Clock,
  Plus,
  Send,
  Trash2,
  Upload,
  User,
  Users,
  Eye,
  Save,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit3,
} from "lucide-react";
import { useSmsStore } from "../stores/smsStore";
import { useStores } from "../stores/stores";
import Layout from "./Layout";
import { Header } from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useTemplateStore } from "../stores/useTemplateStore";
import { useTheme } from "../hooks/useTheme";
import type { DestinataireDyn } from "../types/smsType";
import { ProgressBarSMS } from "../components/ProgressionBar";
import { useState } from "react";

export const Sms = () => {
  const {
    smsType,
    setSmsType,
    destinataires,
    expediteur,
    setExpediteur,
    contenu,
    setContenu,
    datePlanifiee,
    setDatePlanifiee,
    ajouterDestinataire,
    supprimerDestinataire,
    updateDestinataire,
    caractereRestants,
    segmentsSMS,
    loading,
    handleSubmit,
    handleImportFile,
    reInitialiser,
    destinatairesDynamique,
  } = useSmsStore();

  useTheme();

  const { setActiveMenu } = useStores();
  const { user } = useAuthStore();
  const { isUseTemplate, useTemplate, reInitializeTemplate } =
    useTemplateStore();
  const navigate = useNavigate();

  // États pour les modales
  const [showPreview, setShowPreview] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Validation du numéro de téléphone
  const validatePhone = (phone: string) => {
    const phoneRegex = /^(\+261|0)(3[2-4]|3[8-9])\s?\d{2}\s?\d{3}\s?\d{2}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const renderDynamicAttributes = (dest: DestinataireDyn) => {
    const excludedKeys = ["numero", "id"];
    return Object.keys(dest)
      .filter((key) => !excludedKeys.includes(key))
      .map((attributDynamique) => (
        <div
          key={attributDynamique}
          className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100"
        >
          <span className="text-xs text-blue-600 font-medium">
            {attributDynamique}:
          </span>
          <span className="text-sm text-blue-900 font-semibold">
            {dest[attributDynamique]}
          </span>
        </div>
      ));
  };

  if (!user) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Authentification requise
            </h2>
            <p className="text-slate-600 mb-6">
              Veuillez vous connecter pour accéder à cette page
            </p>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors"
            >
              Se connecter
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const totalSMS = segmentsSMS() * destinataires.filter((d) => d.trim()).length;
  const nombreDestinataires = destinataires.filter((d) => d.trim()).length;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Si plus de 10 destinataires, afficher la confirmation
    if (nombreDestinataires > 10 && !showConfirmModal) {
      setShowConfirmModal(true);
      return;
    }
    handleSubmit(e);
    setShowConfirmModal(false);
    navigate("/history");
  };

  return (
    <Layout>
      <Header />
      <div className="p-8 bg-gray-100 dark:bg-gray-800 transition-colors duration-200">
        <form onSubmit={handleFormSubmit} className="max-w-5xl mx-auto">
          {/* Statistiques en temps réel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-6 rounded-2xl border border-blue-200 dark:border-blue-700">
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-300 mb-2" />
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-200">
                {destinatairesDynamique.length === 0
                  ? nombreDestinataires
                  : destinatairesDynamique.length}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Destinataire{nombreDestinataires > 1 ? "s" : ""}
              </p>
            </div>
            <div className="bg-linear-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-6 rounded-2xl border border-green-200 dark:border-green-700">
              <Send className="w-8 h-8 text-green-600 dark:text-green-300 mb-2" />
              <p className="text-3xl font-bold text-green-600 dark:text-green-200">
                {segmentsSMS()}
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                Segment{segmentsSMS() > 1 ? "s" : ""} par SMS
              </p>
            </div>
            <div className="bg-slate-200 p-6 rounded-2xl border border-slate-100 dark:border-slate-600">
              <Clock className="w-8 h-8 text-purple-600 dark:text-purple-300 mb-2" />
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-200">
                {totalSMS}
              </p>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Coût total SMS
              </p>
            </div>
          </div>

          {/* Type de SMS */}
          <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-gray-600 mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Type d'envoi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setSmsType("simple")}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  smsType === "simple"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-sm shadow-blue-500/20"
                    : "border-slate-200 dark:border-gray-600 hover:border-slate-300"
                }`}
              >
                <User className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <p className="font-semibold text-slate-900 dark:text-white">
                  SMS Simple
                </p>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                  Un destinataire
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSmsType("groupe")}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  smsType === "groupe"
                    ? "border-green-500 bg-green-50 dark:bg-green-900/30 shadow-sm shadow-green-500/20"
                    : "border-slate-200 dark:border-gray-600 hover:border-slate-300"
                }`}
              >
                <Users className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <p className="font-semibold text-slate-900 dark:text-white">
                  SMS Groupé
                </p>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                  Plusieurs destinataires
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSmsType("planifie")}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  smsType === "planifie"
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 shadow-sm shadow-purple-500/20"
                    : "border-slate-200 dark:border-gray-600 hover:border-slate-300"
                }`}
              >
                <Clock className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <p className="font-semibold text-slate-900 dark:text-white">
                  SMS Planifié
                </p>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                  Envoi différé
                </p>
              </button>
            </div>
          </div>

          <ProgressBarSMS />

          {/* Alerte pour envoi massif */}
          {nombreDestinataires > 10 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-900 dark:text-yellow-200">
                  Envoi massif détecté
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Vous allez envoyer <strong>{totalSMS} SMS</strong> à{" "}
                  <strong>{nombreDestinataires} destinataires</strong>. Veuillez
                  vérifier avant de confirmer.
                </p>
              </div>
            </div>
          )}

          {/* Modal de confirmation */}
          {showConfirmModal && (
            <div className="fixed inset-0 w-full h-screen bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-8 h-8 text-orange-500" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Confirmer l'envoi
                  </h3>
                </div>
                <p className="text-slate-600 dark:text-gray-400 mb-6">
                  Vous êtes sur le point d'envoyer{" "}
                  <strong>{totalSMS} SMS</strong> à{" "}
                  <strong>{nombreDestinataires} destinataires</strong>. Cette
                  action est irréversible.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 px-4 py-3 bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 text-slate-900 dark:text-white rounded-xl font-semibold transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={(e: any) => handleFormSubmit(e)}
                    className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors"
                  >
                    Confirmer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Expéditeur */}
          <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-gray-600 mb-6">
            <label className="block text-gray-900 dark:text-white text-sm font-bold mb-2">
              Expéditeur (optionnel)
            </label>
            <input
              type="text"
              value={expediteur}
              onChange={(e) => setExpediteur(e.target.value)}
              placeholder="ZeroNotify"
              className="w-full px-4 py-3 text-gray-800 dark:text-gray-200 dark:bg-gray-600 font-semibold border border-slate-200 dark:border-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Destinataires */}
          <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-gray-600 mb-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                Destinataires{" "}
                {smsType === "simple" ? "" : `(${nombreDestinataires})`}
              </label>
              {smsType !== "simple" && (
                <div className="flex gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMenu("contacts");
                      navigate("/contact");
                    }}
                    className="px-4 py-2 bg-slate-100 dark:bg-gray-600 hover:bg-slate-200 dark:hover:bg-gray-500 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-semibold">Mes contacts</span>
                  </button>
                  <label className="px-4 py-2 bg-slate-100 dark:bg-gray-600 hover:bg-slate-200 dark:hover:bg-gray-500 rounded-lg cursor-pointer transition-colors flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm font-semibold">Importer</span>
                    <input
                      type="file"
                      accept=".csv, .xlsx"
                      onChange={handleImportFile}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={ajouterDestinataire}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={destinatairesDynamique.length > 0}
                    title={
                      destinatairesDynamique.length > 0
                        ? "Import actif - Ajout manuel désactivé"
                        : "Ajouter un destinataire"
                    }
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter
                  </button>
                </div>
              )}
            </div>

            {destinatairesDynamique.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>{destinatairesDynamique.length}</strong> destinataire
                  {destinatairesDynamique.length > 1 ? "s" : ""} importé
                  {destinatairesDynamique.length > 1 ? "s" : ""}
                </p>
              </div>
            )}

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {smsType === "simple" ? (
                <div className="relative">
                  <input
                    type="tel"
                    value={destinataires[0]}
                    onChange={(e) => updateDestinataire(0, e.target.value)}
                    placeholder="+261 34 00 000 00"
                    className="w-full px-4 py-3 text-gray-800 dark:text-gray-200 dark:bg-gray-600 border border-slate-200 dark:border-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    required
                  />
                  {destinataires[0] && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {validatePhone(destinataires[0]) ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
              ) : (
                destinatairesDynamique.map((dest: any, index: number) => (
                  <div
                    key={index}
                    className="flex flex-wrap items-stretch gap-2 p-3 border border-blue-100 dark:border-blue-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="relative w-full sm:w-1/3 md:w-1/4">
                      <input
                        type="tel"
                        value={dest.numero}
                        onChange={(e) =>
                          updateDestinataire(index, e.target.value)
                        }
                        placeholder={`+261 34 00 000 0${index + 1}`}
                        className="w-full px-4 py-2 text-gray-800 dark:text-gray-200 dark:bg-gray-600 border border-slate-300 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-mono shadow-sm"
                      />
                      {dest.numero && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          {validatePhone(dest.numero) ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-wrap gap-2 items-center min-w-[200px]">
                      {renderDynamicAttributes(dest)}
                    </div>

                    {destinatairesDynamique.length > 1 && (
                      <button
                        type="button"
                        onClick={() => supprimerDestinataire(index)}
                        className="px-3 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Date planifiée */}
          {smsType === "planifie" && (
            <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-gray-600 mb-6">
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date et heure d'envoi
              </label>
              <input
                type="datetime-local"
                value={datePlanifiee}
                onChange={(e) => setDatePlanifiee(e.target.value)}
                className="w-full px-4 py-3 border text-gray-800 dark:text-gray-200 dark:bg-gray-600 border-slate-200 dark:border-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                required={smsType === "planifie"}
              />
            </div>
          )}

          {/* Contenu */}
          <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-gray-600 mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                Message
                {isUseTemplate && (
                  <span className="ml-2 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-lg">
                    📝 Template utilisé
                  </span>
                )}
              </label>
              <div className="flex items-center gap-2">
                {isUseTemplate && (
                  <button
                    type="button"
                    onClick={reInitializeTemplate}
                    className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    Éditer
                  </button>
                )}
                <div className="text-xs text-slate-500 dark:text-gray-400">
                  {contenu.length} / {160 * segmentsSMS()} caractères ·{" "}
                  {segmentsSMS()} segment{segmentsSMS() > 1 ? "s" : ""}
                </div>
              </div>
            </div>
            <textarea
              value={isUseTemplate ? useTemplate.contenuTemplate : contenu}
              onChange={(e) => setContenu(e.target.value)}
              placeholder="Écrivez votre message ici..."
              rows={6}
              className="w-full px-4 py-3 text-gray-800 dark:text-gray-200 dark:bg-gray-600 border border-slate-200 dark:border-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
              required
              disabled={isUseTemplate}
            />
            <div className="mt-2 flex items-center justify-between text-xs flex-wrap gap-2">
              <span
                className={`font-medium ${
                  caractereRestants(
                    isUseTemplate ? useTemplate.contenuTemplate : contenu,
                  ) < 20
                    ? "text-orange-500"
                    : "text-slate-500 dark:text-gray-400"
                }`}
              >
                {caractereRestants(
                  isUseTemplate ? useTemplate.contenuTemplate : contenu,
                )}{" "}
                caractères restants dans ce segment
              </span>
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                <Eye className="w-4 h-4" />
                Aperçu
              </button>
            </div>
          </div>

          {/* Modal d'aperçu */}
          {showPreview && (
            <div className="fixed inset-0 w-full h-screen bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Aperçu du message
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowPreview(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    ✕
                  </button>
                </div>
                <div className="bg-slate-50 dark:bg-gray-700 p-4 rounded-xl border border-slate-200 dark:border-gray-600 mb-4">
                  <p className="text-xs text-slate-500 dark:text-gray-400 mb-2">
                    De: {expediteur || "ZeroNotify"}
                  </p>
                  <div className="bg-white dark:bg-gray-600 p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-slate-800 dark:text-gray-200 whitespace-pre-wrap">
                      {isUseTemplate ? useTemplate.contenuTemplate : contenu}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-2">
                    {segmentsSMS()} segment{segmentsSMS() > 1 ? "s" : ""} ·{" "}
                    {contenu.length} caractères
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex gap-4 flex-wrap">
            <button
              type="button"
              onClick={() => {
                reInitializeTemplate();
                reInitialiser();
              }}
              className="px-6 py-3 bg-slate-100 dark:bg-gray-600 hover:bg-slate-200 dark:hover:bg-gray-500 text-slate-900 dark:text-white rounded-xl transition-colors font-semibold"
            >
              Réinitialiser
            </button>
            <button
              type="button"
              className="px-6 py-3 bg-slate-700 dark:bg-gray-600 hover:bg-slate-800 dark:hover:bg-gray-500 text-white rounded-xl transition-colors font-semibold flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Brouillon
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-6 py-3 bg-linear-to-rtext-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-sm hover:shadow-blue-500/50"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {smsType === "planifie" ? "Planification" : "Envoi"} en
                  cours...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  {smsType === "planifie"
                    ? "Planifier l'envoi"
                    : "Envoyer maintenant"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};
