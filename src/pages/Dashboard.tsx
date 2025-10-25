import { Clock, Send, Users } from "lucide-react";
import { SmsStore } from "../stores/smsStore";
import { recentActivity, stats } from "../data/datas";
import { stores } from "../stores/stores";
import { useAuthStore } from "../stores/authStore";
import { Charts } from "../components/Charts";
import { Header } from "../components/Header";
import Layout from "./Layout";

export const Dashboard = () => {
  const { setSmsType } = SmsStore();
  const { setActiveMenu } = stores();
  return (
    <Layout>
      <Header />
      <div className="p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat: any, index: number) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-slate-500 text-sm font-medium mb-2">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-slate-900 mb-2">
                      {stat.value}
                    </p>
                    <span
                      className={`text-sm font-semibold ${
                        stat.change.startsWith("+")
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {stat.change} vs mois dernier
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
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Activité Récente
              </h2>
              <button className="text-blue-500 hover:text-blue-600 text-sm font-semibold">
                Voir tout
              </button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {activity.action}
                      </p>
                      <p className="text-sm text-slate-500">{activity.count}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        activity.status === "Terminé"
                          ? "bg-green-100 text-green-700"
                          : activity.status === "En cours"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {activity.status}
                    </span>
                    <p className="text-xs text-slate-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
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
