import { Header } from "../components/Header";
import { Dashboard } from "../components/Dashboard";
import { SideBar } from "../components/Sidebar";
import { Sms } from "../components/Sms";
import { stores } from "../stores/stores";
import { useEffect, useState } from "react";
import { AlertCircle, Bell, CheckCircle, XCircle } from "lucide-react";
import { SmsStore } from "../stores/smsStore";
import { Contacts } from "../components/Contacts";

export const NotificationIcon = ({ type }: any) => {
  switch (type) {
    case "success":
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case "error":
      return <XCircle className="w-5 h-5 text-red-500" />;
    case "warning":
      return <AlertCircle className="w-5 h-5 text-orange-500" />;
    default:
      return <Bell className="w-5 h-5 text-blue-500" />;
  }
};
const Home = () => {
  const { sidebarOpen, activeMenu } = stores();
  const {setNotifications} = SmsStore();


  // Système de notifications en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      const types = ["success", "error", "info", "warning"];
      const messages = [
        {
          type: "success",
          title: "SMS envoyé",
          message: "150 SMS envoyés avec succès",
        },
        {
          type: "info",
          title: "Campagne planifiée",
          message: "Envoi prévu dans 2h",
        },
        {
          type: "warning",
          title: "Crédit faible",
          message: "Il reste 500 SMS",
        },
        {
          type: "error",
          title: "Échec d'envoi",
          message: "5 SMS n'ont pas pu être envoyés",
        },
      ];

      const randomNotif = messages[Math.floor(Math.random() * messages.length)];
      const newNotif = {
        id: String(Date.now()),
        ...randomNotif,
        time: new Date().toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setNotifications(newNotif);
    }, 15000); // Nouvelle notification toutes les 15 secondes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <SideBar />

      <main
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <Header />
        {activeMenu === "dashboard" && <Dashboard />}
        {activeMenu === "sms" && <Sms />}
        {activeMenu === 'contacts' && <Contacts />}

        {!["dashboard", "sms", "contacts"].includes(activeMenu) && (
          <div className="p-8">
            <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Section en construction
              </h2>
              <p className="text-slate-500">
                Cette fonctionnalité sera bientôt disponible
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
