import React from 'react';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useSmsStore } from '../stores/smsStore';

export const ProgressBarSMS: React.FC = () => {
  const { 
    showProgress, 
    progressPercent, 
    progressTotal, 
    progressEnvoyes, 
    progressEchecs,
    progressStatus 
  } = useSmsStore();

  if (!showProgress) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        {/* Icône et titre */}
        <div className="text-center mb-6">
          {progressStatus === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900">
                Envoi en cours...
              </h3>
            </>
          )}
          
          {progressStatus === 'success' && (
            <>
              <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-900">
                Envoi terminé !
              </h3>
            </>
          )}
          
          {progressStatus === 'error' && (
            <>
              <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-red-900">
                Échec d'envoi
              </h3>
            </>
          )}
        </div>

        {/* Barre de progression */}
        <div className="space-y-4">
          {/* Pourcentage */}
          <div className="flex items-center justify-between text-sm font-medium">
            <span className="text-slate-700">Progression</span>
            <span className="text-blue-600 text-lg font-bold">{progressPercent}%</span>
          </div>

          {/* Barre */}
          <div className="relative h-4 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                progressStatus === 'success' ? 'bg-green-500' :
                progressStatus === 'error' ? 'bg-red-500' :
                'bg-blue-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>

          {/* Statistiques */}
          <div className="flex justify-between text-sm pt-2">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-700">{progressTotal}</div>
              <div className="text-xs text-slate-500">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{progressEnvoyes}</div>
              <div className="text-xs text-slate-500">Envoyés</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{progressEchecs}</div>
              <div className="text-xs text-slate-500">Échecs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};