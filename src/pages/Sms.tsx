import {
  Calendar,
  Clock,
  Plus,
  Send,
  Trash2,
  Upload,
  User,
  Users,
} from "lucide-react";
import { SmsStore } from "../stores/smsStore";
import { stores } from "../stores/stores";
import Layout from "./Layout";
import { Header } from "../components/Header";
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
    handleImportCSV,
    reInitialiser,
  } = SmsStore();

  const { setActiveMenu } = stores();

  return (
    <Layout>
      <Header />
      <div className="p-8">
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
          {/* Type de SMS */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Type d'envoi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setSmsType("simple")}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  smsType === "simple"
                    ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <User className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <p className="font-semibold text-slate-900">SMS Simple</p>
                <p className="text-xs text-slate-500 mt-1">Un destinataire</p>
              </button>

              <button
                type="button"
                onClick={() => setSmsType("groupe")}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  smsType === "groupe"
                    ? "border-green-500 bg-green-50 shadow-lg shadow-green-500/20"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <Users className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <p className="font-semibold text-slate-900">SMS Groupé</p>
                <p className="text-xs text-slate-500 mt-1">
                  Plusieurs destinataires
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSmsType("planifie")}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  smsType === "planifie"
                    ? "border-purple-500 bg-purple-50 shadow-lg shadow-purple-500/20"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <Clock className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <p className="font-semibold text-slate-900">SMS Planifié</p>
                <p className="text-xs text-slate-500 mt-1">Envoi différé</p>
              </button>
            </div>
          </div>

          {/* Expéditeur */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 mb-6">
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Expéditeur (optionnel)
            </label>
            <input
              type="text"
              value={expediteur}
              onChange={(e) => setExpediteur(e.target.value)}
              placeholder="ZeroNotify"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Destinataires */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 mb-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-semibold text-slate-900">
                Destinataires{" "}
                {smsType === "simple"
                  ? ""
                  : `(${destinataires.filter((d) => d.trim()).length})`}
              </label>
              {smsType !== "simple" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveMenu("contacts")}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-semibold">
                      De mes contacts
                    </span>
                  </button>
                  <label className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm font-semibold">Import CSV</span>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleImportCSV}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={ajouterDestinataire}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {smsType === "simple" ? (
                <input
                  type="tel"
                  value={destinataires[0]}
                  onChange={(e) => updateDestinataire(0, e.target.value)}
                  placeholder="+261 34 00 000 00"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              ) : (
                destinataires.map((dest: any, index: number) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="tel"
                      value={dest}
                      onChange={(e) =>
                        updateDestinataire(index, e.target.value)
                      }
                      placeholder={`+261 34 00 000 0${index + 1}`}
                      className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                    {destinataires.length > 1 && (
                      <button
                        type="button"
                        onClick={() => supprimerDestinataire(index)}
                        className="px-3 py-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl transition-colors"
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
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 mb-6">
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date et heure d'envoi
              </label>
              <input
                type="datetime-local"
                value={datePlanifiee}
                onChange={(e) => setDatePlanifiee(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                required={smsType === "planifie"}
              />
            </div>
          )}

          {/* Contenu */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-slate-900">
                Message
              </label>
              <div className="text-xs text-slate-500">
                {contenu.length} / {160 * segmentsSMS()} caractères ·{" "}
                {segmentsSMS()} segment{segmentsSMS() > 1 ? "s" : ""}
              </div>
            </div>
            <textarea
              value={contenu}
              onChange={(e) => setContenu(e.target.value)}
              placeholder="Écrivez votre message ici..."
              rows={6}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
              required
            />
            <div className="mt-2 flex items-center justify-between text-xs">
              <span
                className={`font-medium ${
                  caractereRestants() < 20
                    ? "text-orange-500"
                    : "text-slate-500"
                }`}
              >
                {caractereRestants()} caractères restants dans ce segment
              </span>
              <span className="text-slate-400">
                Coût estimé:{" "}
                {segmentsSMS() * destinataires.filter((d) => d.trim()).length}{" "}
                SMS
              </span>
            </div>
          </div>

          {/* Bouton d'envoi */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => reInitialiser()}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl transition-colors font-semibold"
            >
              Réinitialiser
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-lg hover:shadow-blue-500/50"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Envoi en cours...
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
