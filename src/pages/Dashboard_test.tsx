import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';
import api from '../utils/api';

const Dashboard: React.FC = () => {
  const { user, modemStatus, setModemStatus, setLoading } = useAuthStore();
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [destinataire, setDestinataire] = useState(''); // Pour l'envoi unique
  const [destinataires, setDestinataires] = useState(''); // Pour l'envoi en masse (texte multiligne)
  const [contenu, setContenu] = useState('');

  // 1. Vérification du statut du modem au chargement
  const checkStatus = async () => {
    try {
      // Endpoint à créer dans votre API pour lire la table 'phones'
      const response = await api.get('/sms/status'); 
      setModemStatus({
        isConnected: response.data.connected,
        message: response.data.message,
        statusCode: response.data.status_code,
      });
    } catch (error) {
      setModemStatus({ 
        isConnected: false, 
        message: 'Impossible de joindre le service de vérification.', 
        statusCode: 'API_DOWN' 
      });
    }
  };

  useEffect(() => {
    //checkStatus();
  }, []);

  // 2. Gestion de l'envoi
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modemStatus.isConnected) {
      toast.error('Modem hors ligne. Veuillez vérifier le service Gammu SMSD.');
      return;
    }
    
    setLoading(true);
    let endpoint = '';
    let payload: any = { contenu };

    if (mode === 'single') {
      if (!destinataire) return toast.error("Le destinataire est requis.");
      endpoint = '/sms/send';
      payload.destinataire = destinataire;
    } else { // bulk mode
      const numbers = destinataires.split('\n').map(n => n.trim()).filter(n => n.length > 0);
      if (numbers.length === 0) return toast.error("Veuillez entrer au moins un destinataire.");
      endpoint = '/sms/bulk';
      payload.destinataires = numbers;
    }

    try {
      const response = await api.post(endpoint, payload);
      toast.success(response.data.message);
      // Réinitialiser les champs après succès
      setDestinataire('');
      setDestinataires('');
      setContenu('');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la soumission du SMS.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p className="text-center mt-10">Veuillez vous connecter.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold mb-4">Tableau de Bord SMS</h2>
      <button onClick={() => useAuthStore.getState().logout()}>Se déconnecter</button>
      <p className="mb-6 text-gray-600">Bienvenue, {user.nom}. Prêt à envoyer des SMS.</p>
      
      {/* Statut du Modem */}
      <div className={`p-3 mb-6 rounded-lg font-semibold ${modemStatus.isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        Statut du Modem: {modemStatus.message}
      </div>

      {/* Sélecteur de Mode */}
      <div className="flex mb-6 space-x-4">
        <button
          onClick={() => setMode('single')}
          className={`px-4 py-2 rounded-lg transition ${mode === 'single' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Envoi Unique
        </button>
        <button
          onClick={() => setMode('bulk')}
          className={`px-4 py-2 rounded-lg transition ${mode === 'bulk' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Envoi en Masse
        </button>
      </div>

      {/* Formulaire d'Envoi */}
      <form onSubmit={handleSend} className="space-y-6">
        {mode === 'single' ? (
          <input
            type="text"
            placeholder="Numéro du Destinataire (Ex: 261xxxxxxxx)"
            value={destinataire}
            onChange={(e) => setDestinataire(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        ) : (
          <textarea
            placeholder="Liste des Destinataires (un numéro par ligne)"
            value={destinataires}
            onChange={(e) => setDestinataires(e.target.value)}
            rows={5}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        )}
        
        <textarea
          placeholder="Contenu du Message (Max. 160 caractères)"
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
          rows={4}
          maxLength={160}
          required
          className="w-full p-3 border border-gray-300 rounded-lg"
        />

        <button
          type="submit"
          disabled={!modemStatus.isConnected || useAuthStore.getState().isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-3 rounded-lg transition duration-200 disabled:bg-gray-400"
        >
          {useAuthStore.getState().isLoading ? 'Envoi en cours...' : `Soumettre ${mode === 'single' ? 'le SMS' : 'la Campagne'}`}
        </button>
      </form>
    </div>
  );
};

export default Dashboard;