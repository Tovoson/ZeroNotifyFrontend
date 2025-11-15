import { Clock, Send, Users, CheckCircle, XCircle, Loader } from "lucide-react";
import { useSmsStore } from "../stores/smsStore";
import { useStores } from "../stores/stores";
import { Charts } from "../components/Charts";
import { Header } from "../components/Header";
import Layout from "./Layout";
import { useTheme } from "../hooks/useTheme";
import { useHistoriqueStore } from "../stores/historiqueStore";
import { useEffect, useMemo } from "react";

export const Dashboard = () => {
  const { setSmsType } = useSmsStore();
  const { setActiveMenu } = useStores();
  const { allSms, getAllSms, isLoading } = useHistoriqueStore();

  useEffect(() => {
    getAllSms();
  }, []);

  // Calculer les statistiques à partir des données réelles
  const stats = useMemo(() => {
    // Compter le nombre total de SMS individuels (en tenant compte des destinataires multiples)
    const totalSmsIndividuels = allSms.reduce((acc, sms) => {
      const nbDestinataires = Array.isArray(sms.destinataires) 
        ? sms.destinataires.length 
        : 1;
      return acc + nbDestinataires;
    }, 0);

    // Compter les SMS envoyés (tous les destinataires des SMS avec statut "envoye")
    const smsEnvoyes = allSms
      .filter(sms => sms.statut === "envoye")
      .reduce((acc, sms) => {
        const nbDestinataires = Array.isArray(sms.destinataires) 
          ? sms.destinataires.length 
          : 1;
        return acc + nbDestinataires;
      }, 0);

    // Compter les SMS planifiés
    const smsPlanifies = allSms
      .filter(sms => sms.statut === "planifie" || sms.isPlaned)
      .reduce((acc, sms) => {
        const nbDestinataires = Array.isArray(sms.destinataires) 
          ? sms.destinataires.length 
          : 1;
        return acc + nbDestinataires;
      }, 0);

    // Compter les SMS en attente (qui ne sont pas planifiés)
    const smsEnAttente = allSms
      .filter(sms => sms.statut === "en_attente" && !sms.isPlaned)
      .reduce((acc, sms) => {
        const nbDestinataires = Array.isArray(sms.destinataires) 
          ? sms.destinataires.length 
          : 1;
        return acc + nbDestinataires;
      }, 0);

    // Compter les échecs
    const smsEchecs = allSms
      .filter(sms => sms.statut === "echec")
      .reduce((acc, sms) => {
        const nbDestinataires = Array.isArray(sms.destinataires) 
          ? sms.destinataires.length 
          : 1;
        return acc + nbDestinataires;
      }, 0);
    
    // Calculer le taux de succès
    const tauxSucces = totalSmsIndividuels > 0 
      ? ((smsEnvoyes / totalSmsIndividuels) * 100).toFixed(1) 
      : "0";

    return [
      {
        label: "Total SMS",
        value: totalSmsIndividuels.toString(),
        change: `${allSms.length} envoi${allSms.length > 1 ? 's' : ''}`,
        color: "bg-gradient-to-br from-blue-500 to-blue-600",
        icon: Send
      },
      {
        label: "SMS Envoyés",
        value: smsEnvoyes.toString(),
        change: `${tauxSucces}% de succès`,
        color: "bg-gradient-to-br from-green-500 to-green-600",
        icon: CheckCircle
      },
      {
        label: "Planifiés",
        value: smsPlanifies.toString(),
        change: `${((smsPlanifies / totalSmsIndividuels) * 100 || 0).toFixed(0)}% du total`,
        color: "bg-gradient-to-br from-purple-500 to-purple-600",
        icon: Clock
      },
      {
        label: "En Attente / Échecs",
        value: (smsEnAttente + smsEchecs).toString(),
        change: `${smsEnAttente} en attente, ${smsEchecs} échecs`,
        color: "bg-gradient-to-br from-orange-500 to-red-600",
        icon: XCircle
      }
    ];
  }, [allSms]);

  // Activités récentes (derniers SMS)
  const recentActivity = useMemo(() => {
    return allSms
      .filter(sms => sms.dateEnvoi || sms.createdAt)
      .sort((a, b) => {
        const dateA = new Date(a.dateEnvoi || a.createdAt);
        const dateB = new Date(b.dateEnvoi || b.createdAt);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 5)
      .map(sms => {
        const date = new Date(sms.dateEnvoi || sms.createdAt);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        
        let timeStr = "";
        if (diffMins < 60) {
          timeStr = `Il y a ${diffMins} min`;
        } else if (diffHours < 24) {
          timeStr = `Il y a ${diffHours}h`;
        } else {
          timeStr = date.toLocaleDateString('fr-FR');
        }

        const destinataires = Array.isArray(sms.destinataires) 
          ? sms.destinataires.length 
          : 1;

        return {
          action: sms.type === "groupe" ? "Envoi SMS Groupé" : "Envoi SMS Simple",
          count: `${destinataires} destinataire${destinataires > 1 ? 's' : ''}`,
          status: sms.statut === "envoye" ? "Terminé" : 
                  sms.statut === "en_attente" ? "En attente" : "Échec",
          time: timeStr
        };
      });
  }, [allSms]);

  useTheme();

  if (isLoading) {
    return (
      <Layout>
        <Header />
        <div className="flex items-center justify-center h-screen">
          <Loader className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header />
      <div className="p-8 bg-gray-100 dark:bg-gray-800 transition-colors duration-200">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 dark:border-gray-600"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-slate-500 dark:text-gray-400 text-sm font-medium mb-2">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                      {stat.value}
                    </p>
                    <span className="text-sm font-semibold text-slate-600 dark:text-gray-300">
                      {stat.change}
                    </span>
                  </div>
                  <div
                    className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Charts />

        {/* Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-gray-600">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Activité Récente
              </h2>
              <button 
                onClick={() => setActiveMenu("historique")}
                className="text-blue-500 hover:text-blue-600 text-sm font-semibold"
              >
                Voir tout
              </button>
            </div>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-gray-600 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-500 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {activity.action}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-gray-300">
                          {activity.count}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          activity.status === "Terminé"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : activity.status === "En attente"
                            ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {activity.status}
                      </span>
                      <p className="text-xs text-slate-400 dark:text-gray-400 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-500 dark:text-gray-400 py-8">
                  Aucune activité récente
                </p>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 shadow-lg text-white">
            <h2 className="text-xl font-bold mb-6">Actions Rapides</h2>
            <div className="space-y-3">
              <button
                onClick={() => setActiveMenu("sms")}
                className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl p-4 text-left transition-all duration-200 hover:scale-105"
              >
                <div className="flex items-center gap-3">
                  <Send className="w-5 h-5" />
                  <span className="font-semibold">Envoyer SMS Groupé</span>
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveMenu("contacts");
                  setSmsType("contacts");
                }}
                className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl p-4 text-left transition-all duration-200 hover:scale-105"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  <span className="font-semibold">Gérer Contacts</span>
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveMenu("sms");
                  setSmsType("planifie");
                }}
                className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl p-4 text-left transition-all duration-200 hover:scale-105"
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">Planifier Campagne</span>
                </div>
              </button>
            </div>

            <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <p className="text-sm opacity-90">💡 Astuce du jour</p>
              <p className="text-xs mt-2 opacity-75">
                Planifiez vos SMS aux heures de forte activité pour un meilleur
                taux d'ouverture !
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};