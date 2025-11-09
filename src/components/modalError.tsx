import { X, AlertCircle, CheckCircle2, Send } from "lucide-react";
import type React from "react";
import { useSmsStore } from "../stores/smsStore";

export const ModalError: React.FC = () => {
  const { showCreateModal, setShowCreateModal, detailsError } = useSmsStore();

  if (!showCreateModal) return null;

  const hasErrors = detailsError.invalides && detailsError.invalides.length > 0;
  const hasSuccess = detailsError.valides && detailsError.valides.length > 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-8 py-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${hasErrors ? 'bg-red-100' : 'bg-green-100'}`}>
                {hasErrors ? (
                  <AlertCircle className="w-6 h-6 text-red-600" />
                ) : (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Résultat d'envoi
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Détails de votre campagne SMS
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(false)}
              className="p-2 hover:bg-white rounded-xl transition-all duration-200 hover:shadow-md group"
              aria-label="Fermer"
            >
              <X className="w-5 h-5 text-slate-600 group-hover:text-slate-900" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Message principal */}
          {detailsError.message && (
            <div className={`p-4 rounded-xl border-l-4 ${
              hasErrors 
                ? 'bg-amber-50 border-amber-500' 
                : 'bg-green-50 border-green-500'
            }`}>
              <p className={`font-medium ${
                hasErrors ? 'text-amber-900' : 'text-green-900'
              }`}>
                {detailsError.message}
              </p>
            </div>
          )}

          {/* Statistiques */}
          <div className="grid grid-cols-2 gap-4">
            {/* SMS Envoyés */}
            {hasSuccess && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-3xl font-bold text-green-600">
                    {detailsError.valides.length}
                  </span>
                </div>
                <p className="text-sm font-medium text-green-900">SMS envoyés avec succès</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 bg-green-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-green-600 h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(detailsError.valides.length / (detailsError.valides.length + (detailsError.invalides?.length || 0))) * 100}%` 
                      }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-green-700">
                    {Math.round((detailsError.valides.length / (detailsError.valides.length + (detailsError.invalides?.length || 0))) * 100)}%
                  </span>
                </div>
              </div>
            )}

            {/* SMS Échoués */}
            {hasErrors && (
              <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 border border-red-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <span className="text-3xl font-bold text-red-600">
                    {detailsError.invalides.length}
                  </span>
                </div>
                <p className="text-sm font-medium text-red-900">SMS échoués</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 bg-red-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-red-600 h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(detailsError.invalides.length / (detailsError.valides.length + detailsError.invalides.length)) * 100}%` 
                      }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-red-700">
                    {Math.round((detailsError.invalides.length / (detailsError.valides.length + detailsError.invalides.length)) * 100)}%
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Liste des erreurs */}
          {hasErrors && (
            <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-rose-500 px-6 py-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Détails des échecs ({detailsError.invalides.length})
                </h3>
              </div>
              <div className="p-6 max-h-64 overflow-y-auto">
                <div className="space-y-3">
                  {detailsError.invalides.map((err: any, index: number) => (
                    <div 
                      key={index}
                      className="flex items-start gap-3 p-4 bg-white rounded-lg border border-red-100 hover:border-red-200 transition-colors"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-red-600">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 mb-1">
                          {err.numero}
                        </p>
                        <p className="text-sm text-slate-600">
                          <span className="font-medium text-red-600">Raison:</span> {err.raison}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Message de succès uniquement */}
          {!hasErrors && hasSuccess && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Send className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-green-900 mb-2">
                Envoi réussi !
              </h3>
              <p className="text-green-700">
                Tous vos SMS ont été envoyés avec succès à {detailsError.valides.length} destinataire{detailsError.valides.length > 1 ? 's' : ''}.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-8 py-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              {hasErrors ? (
                <span>Vérifiez les numéros invalides et réessayez</span>
              ) : (
                <span>Campagne terminée avec succès</span>
              )}
            </p>
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-6 py-3 bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};