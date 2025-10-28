import React, { useState } from 'react';
import { Settings, User, Bell, Shield, CreditCard, Globe, Moon, Sun, Mail, Phone, Lock, Save, CheckCircle } from 'lucide-react';
import { Header } from '../components/Header';
import Layout from './Layout';

const Parametres = () => {
  const [activeTab, setActiveTab] = useState('profil');
  const [showSuccess, setShowSuccess] = useState(false);
  
  // États pour le profil
  const [profil, setProfil] = useState({
    nom: 'Admin',
    prenom: 'User',
    email: 'admin@zeronotify.com',
    telephone: '+261 34 00 000 00',
    entreprise: 'ZeroNotify Inc.',
    adresse: 'Antananarivo, Madagascar'
  });

  // États pour les notifications
  const [notifications, setNotifications] = useState({
    emailEnvoi: true,
    emailEchec: true,
    smsConfirmation: false,
    alerteCredit: true,
    rapportHebdo: true
  });

  // États pour la sécurité
  const [securite, setSecurite] = useState({
    auth2FA: false,
    sessionTimeout: '30',
    ipWhitelist: ''
  });

  // États pour l'apparence
  const [apparence, setApparence] = useState({
    theme: 'light',
    langue: 'fr',
    timezone: 'Africa/Nairobi'
  });

  // États pour les tarifs
  const [tarifs, setTarifs] = useState({
    prixUnitaire: '50',
    remiseGroupe: '10',
    seuilRemise: '1000'
  });

  const tabs = [
    { id: 'profil', label: 'Profil', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'securite', label: 'Sécurité', icon: Shield },
    { id: 'tarification', label: 'Tarification', icon: CreditCard },
    { id: 'apparence', label: 'Apparence', icon: Globe }
  ];

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <Layout>
          <Header />
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Paramètres</h1>
        <p className="text-slate-500">Gérez vos préférences et configurations</p>
      </div>

      {/* Notification de succès */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-slide-in z-50">
          <CheckCircle className="w-5 h-5" />
          <span className="font-semibold">Paramètres sauvegardés avec succès !</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 bg-white rounded-2xl shadow-lg p-4">
          <div className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-8">
          {/* PROFIL */}
          {activeTab === 'profil' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Informations du profil</h2>
              
              <div className="space-y-6">
                {/* Photo de profil */}
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {profil.nom[0]}{profil.prenom[0]}
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors">
                      Changer la photo
                    </button>
                    <p className="text-sm text-slate-500 mt-2">JPG, PNG ou GIF. Max 2MB.</p>
                  </div>
                </div>

                {/* Nom et Prénom */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Nom</label>
                    <input
                      type="text"
                      value={profil.nom}
                      onChange={(e) => setProfil({...profil, nom: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Prénom</label>
                    <input
                      type="text"
                      value={profil.prenom}
                      onChange={(e) => setProfil({...profil, prenom: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Email et Téléphone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        value={profil.email}
                        onChange={(e) => setProfil({...profil, email: e.target.value})}
                        className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Téléphone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="tel"
                        value={profil.telephone}
                        onChange={(e) => setProfil({...profil, telephone: e.target.value})}
                        className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Entreprise et Adresse */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Entreprise</label>
                  <input
                    type="text"
                    value={profil.entreprise}
                    onChange={(e) => setProfil({...profil, entreprise: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Adresse</label>
                  <textarea
                    value={profil.adresse}
                    onChange={(e) => setProfil({...profil, adresse: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Préférences de notifications</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-slate-900">Email lors d'envoi réussi</p>
                    <p className="text-sm text-slate-500">Recevoir un email après chaque envoi de SMS</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.emailEnvoi}
                      onChange={(e) => setNotifications({...notifications, emailEnvoi: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-slate-900">Email lors d'échec</p>
                    <p className="text-sm text-slate-500">Être notifié en cas d'échec d'envoi</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.emailEchec}
                      onChange={(e) => setNotifications({...notifications, emailEchec: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-slate-900">Confirmation SMS</p>
                    <p className="text-sm text-slate-500">Recevoir un SMS de confirmation après envoi</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.smsConfirmation}
                      onChange={(e) => setNotifications({...notifications, smsConfirmation: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-slate-900">Alerte crédit faible</p>
                    <p className="text-sm text-slate-500">Notification quand le crédit SMS est faible</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.alerteCredit}
                      onChange={(e) => setNotifications({...notifications, alerteCredit: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-slate-900">Rapport hebdomadaire</p>
                    <p className="text-sm text-slate-500">Recevoir un rapport d'activité chaque semaine</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.rapportHebdo}
                      onChange={(e) => setNotifications({...notifications, rapportHebdo: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* SÉCURITÉ */}
          {activeTab === 'securite' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Sécurité du compte</h2>
              
              <div className="space-y-6">
                {/* 2FA */}
                <div className="p-6 bg-slate-50 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-semibold text-slate-900 text-lg">Authentification à deux facteurs</p>
                      <p className="text-sm text-slate-500 mt-1">Ajouter une couche de sécurité supplémentaire</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={securite.auth2FA}
                        onChange={(e) => setSecurite({...securite, auth2FA: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  {securite.auth2FA && (
                    <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors">
                      Configurer 2FA
                    </button>
                  )}
                </div>

                {/* Changer mot de passe */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Changer le mot de passe</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Mot de passe actuel</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Nouveau mot de passe</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Confirmer le mot de passe</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeout de session */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Timeout de session (minutes)</label>
                  <select
                    value={securite.sessionTimeout}
                    onChange={(e) => setSecurite({...securite, sessionTimeout: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 heure</option>
                    <option value="120">2 heures</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TARIFICATION */}
          {activeTab === 'tarification' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Configuration tarifaire</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                    <CreditCard className="w-12 h-12 text-blue-600 mb-4" />
                    <h3 className="font-bold text-slate-900 text-lg mb-2">Crédit actuel</h3>
                    <p className="text-3xl font-bold text-blue-600">2,450 SMS</p>
                    <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
                      Recharger
                    </button>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-white text-2xl font-bold">Ar</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg mb-2">Solde compte</h3>
                    <p className="text-3xl font-bold text-green-600">125,000 Ar</p>
                    <button className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors">
                      Ajouter des fonds
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Prix unitaire par SMS (Ariary)</label>
                  <input
                    type="number"
                    value={tarifs.prixUnitaire}
                    onChange={(e) => setTarifs({...tarifs, prixUnitaire: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Remise groupe (%)</label>
                  <input
                    type="number"
                    value={tarifs.remiseGroupe}
                    onChange={(e) => setTarifs({...tarifs, remiseGroupe: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Seuil pour remise (nombre de SMS)</label>
                  <input
                    type="number"
                    value={tarifs.seuilRemise}
                    onChange={(e) => setTarifs({...tarifs, seuilRemise: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* APPARENCE */}
          {activeTab === 'apparence' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Personnalisation</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-4">Thème</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setApparence({...apparence, theme: 'light'})}
                      className={`p-6 border-2 rounded-xl transition-all ${
                        apparence.theme === 'light'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <Sun className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                      <p className="font-semibold text-slate-900">Clair</p>
                    </button>
                    <button
                      onClick={() => setApparence({...apparence, theme: 'dark'})}
                      className={`p-6 border-2 rounded-xl transition-all ${
                        apparence.theme === 'dark'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <Moon className="w-8 h-8 mx-auto mb-2 text-slate-700" />
                      <p className="font-semibold text-slate-900">Sombre</p>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Langue</label>
                  <select
                    value={apparence.langue}
                    onChange={(e) => setApparence({...apparence, langue: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="mg">Malagasy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Fuseau horaire</label>
                  <select
                    value={apparence.timezone}
                    onChange={(e) => setApparence({...apparence, timezone: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Africa/Nairobi">Madagascar (UTC+3)</option>
                    <option value="Europe/Paris">Paris (UTC+1)</option>
                    <option value="America/New_York">New York (UTC-5)</option>
                    <option value="Asia/Tokyo">Tokyo (UTC+9)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Bouton Sauvegarder */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Sauvegarder les modifications
              </button>
              <button className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-semibold transition-colors">
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default Parametres;