import { useEffect, useState } from "react";
import { useStores } from "../stores/stores";
import { Bell } from "lucide-react";
import { NotificationIcon } from "../pages/Layout";
import { useSmsStore } from "../stores/smsStore";

export const Header = () => {
  const { activeMenu } = useStores();
  const {quotaSms, getQuotaSms} = useSmsStore()

  const notifs = [
    { id: 'Jan', title: "notif1", message: "mon message", time: "time", type: "nofits" },
  ]
  const [notifications, setNotifications] = useState(notifs);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    getQuotaSms();
  }, []);


  return (
    <header className="flex flex-row items-center justify-between bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
      <div className="px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              {activeMenu === "dashboard"
                ? "Tableau de Bord"
                : activeMenu === "sms"
                ? "Envoyer un SMS"
                : activeMenu === "contacts"
                ? "Gestion des Contacts":
                activeMenu === "history"
                ? "Historique des SMS":
                activeMenu === "parametre"
                ? "Paramètres":
                  activeMenu === "template"
                ? "Templates"
                : "Section"}
            </h1>
            <p className="text-slate-500 mt-1">
              {activeMenu === "dashboard"
                ? "Vue d'ensemble de votre plateforme SMS"
                : activeMenu === "sms"
                ? "Envoyez des SMS individuels, groupés ou planifiés"
                : activeMenu === "contacts"
                ? "Gérez vos contacts et groupes"
                :activeMenu === "history"
                ? "Historique de vos envois de SMS"
                : activeMenu === "parametre"
                ? "Paramètres"
              : "Description"}
            </p>
          </div>
        </div>
      </div>

     <div className="flex items-center gap-3 px-4 py-2.5 bg-white rounded-xl border border-gray-200 shadow-sm">
  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  </div>
  <div className="flex flex-col">
    <span className="text-xs text-gray-500 font-medium">Messages restants</span>
    <span className="text-2xl font-bold text-gray-900">{quotaSms}</span>
  </div>
</div>

      {/* Notifications */}
      <div className="relative pr-8 flex flex-row items-center justify-center gap-7">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
        >
          <Bell className="w-6 h-6 text-slate-700" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </button>

        {showNotifications && (
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-900">Notifications</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  Aucune notification
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex gap-3">
                      <NotificationIcon type={notif.type} />
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 text-sm">
                          {notif.title}
                        </p>
                        <p className="text-slate-600 text-xs mt-1">
                          {notif.message}
                        </p>
                        <p className="text-slate-400 text-xs mt-1">
                          {notif.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
