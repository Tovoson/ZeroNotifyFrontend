import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useHistoriqueStore } from "../stores/historiqueStore";
import { useMemo } from "react";

export const Charts = () => {
  const { allSms } = useHistoriqueStore();

  // Calculer l'évolution des SMS par mois
  const smsData = useMemo(() => {
    const months: { [key: string]: number } = {};
    
    allSms.forEach(sms => {
      const date = new Date(sms.dateEnvoi || sms.createdAt);
      const monthKey = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
      
      const nbDestinataires = Array.isArray(sms.destinataires) 
        ? sms.destinataires.length 
        : 1;
      
      if (sms.statut === "envoye") {
        months[monthKey] = (months[monthKey] || 0) + nbDestinataires;
      }
    });

    // Convertir en tableau et trier par date
    return Object.entries(months)
      .map(([mois, envoyes]) => ({ mois, envoyes }))
      .sort((a, b) => {
        const dateA = new Date(a.mois);
        const dateB = new Date(b.mois);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(-6); // Garder les 6 derniers mois
  }, [allSms]);

  // Calculer la distribution ce mois
  const distributionData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let envoyes = 0;
    let planifies = 0;
    let enAttente = 0;
    let echecs = 0;

    allSms.forEach(sms => {
      const date = new Date(sms.dateEnvoi || sms.createdAt);
      
      // Vérifier si le SMS est du mois en cours
      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        const nbDestinataires = Array.isArray(sms.destinataires) 
          ? sms.destinataires.length 
          : 1;

        if (sms.statut === "envoye") {
          envoyes += nbDestinataires;
        } else if (sms.statut === "planifie" || sms.isPlaned === true) {
          planifies += nbDestinataires;
        } else if (sms.statut === "en_attente" && !sms.isPlaned) {
          enAttente += nbDestinataires;
        } else if (sms.statut === "echec") {
          echecs += nbDestinataires;
        }
      }
    });

    return [
      { name: "Envoyés", value: envoyes, color: "#10b981" },
      { name: "Planifiés", value: planifies, color: "#8b5cf6" },
      { name: "En attente", value: enAttente, color: "#f59e0b" },
      { name: "Échecs", value: echecs, color: "#ef4444" },
    ].filter(item => item.value > 0); // Ne garder que les catégories avec des valeurs
  }, [allSms]);

  // Calculer le taux de réussite des 7 derniers jours
  const tauxReussiteData = useMemo(() => {
    const last7Days: { [key: string]: { envoyes: number; total: number } } = {};
    const now = new Date();

    // Initialiser les 7 derniers jours
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayKey = date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
      last7Days[dayKey] = { envoyes: 0, total: 0 };
    }

    allSms.forEach(sms => {
      const date = new Date(sms.dateEnvoi || sms.createdAt);
      const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff >= 0 && daysDiff < 7) {
        const dayKey = date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
        
        if (last7Days[dayKey]) {
          const nbDestinataires = Array.isArray(sms.destinataires) 
            ? sms.destinataires.length 
            : 1;
          
          last7Days[dayKey].total += nbDestinataires;
          
          if (sms.statut === "envoye") {
            last7Days[dayKey].envoyes += nbDestinataires;
          }
        }
      }
    });

    return Object.entries(last7Days).map(([jour, data]) => ({
      jour,
      taux: data.total > 0 ? Number(((data.envoyes / data.total) * 100).toFixed(1)) : 0,
    }));
  }, [allSms]);

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Évolution des SMS */}
        <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-gray-600">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Évolution des envois
          </h2>
          {smsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={smsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="mois" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="envoyes" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-slate-500 dark:text-gray-400">
              Aucune donnée disponible
            </div>
          )}
        </div>

        {/* Distribution */}
        <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-gray-600">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Distribution ce mois
          </h2>
          {distributionData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "none",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-4">
                {distributionData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-slate-600 dark:text-gray-300">
                      {item.name}: {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-slate-500 dark:text-gray-400">
              Aucune donnée ce mois
            </div>
          )}
        </div>
      </div>

      {/* Taux de réussite */}
      <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-gray-600 mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          Taux de réussite - 7 derniers jours
        </h2>
        {tauxReussiteData.some(d => d.taux > 0) ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={tauxReussiteData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="jour" stroke="#64748b" />
              <YAxis stroke="#64748b" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff",
                }}
                formatter={(value) => `${value}%`}
              />
              <Line
                type="monotone"
                dataKey="taux"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: "#8b5cf6", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[200px] text-slate-500 dark:text-gray-400">
            Aucune donnée sur les 7 derniers jours
          </div>
        )}
      </div>
    </div>
  );
};