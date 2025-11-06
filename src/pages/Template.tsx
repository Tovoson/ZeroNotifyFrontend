import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Copy, Star, MessageSquare, Calendar, ShoppingCart, Heart, Bell, CheckCircle, X } from 'lucide-react';
import Layout from './Layout';
import { Header } from '../components/Header';

const TemplatesSMS = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('tous');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  const [newTemplate, setNewTemplate] = useState({
    nom: '',
    categorie: 'marketing',
    contenu: '',
    variables: []
  });

  const [templates, setTemplates] = useState([
    {
      id: 1,
      nom: 'Bienvenue nouveau client',
      categorie: 'marketing',
      contenu: 'Bienvenue chez {entreprise} ! Profitez de -20% sur votre première commande avec le code {code}.',
      variables: ['entreprise', 'code'],
      utilisations: 245,
      favori: true,
      dateCreation: '2025-10-15'
    },
    {
      id: 2,
      nom: 'Rappel rendez-vous',
      categorie: 'notification',
      contenu: 'Rappel : Votre RDV chez {entreprise} est prévu le {date} à {heure}. Pour annuler, appelez le {telephone}.',
      variables: ['entreprise', 'date', 'heure', 'telephone'],
      utilisations: 1523,
      favori: true,
      dateCreation: '2025-10-10'
    },
    {
      id: 3,
      nom: 'Confirmation commande',
      categorie: 'transactionnel',
      contenu: 'Commande #{numero} confirmée ! Montant: {montant} Ar. Livraison prévue le {date}. Merci {nom} !',
      variables: ['numero', 'montant', 'date', 'nom'],
      utilisations: 892,
      favori: false,
      dateCreation: '2025-10-08'
    },
    {
      id: 4,
      nom: 'Promotion flash',
      categorie: 'marketing',
      contenu: '🔥 FLASH SALE ! {reduction}% sur {produit}. Valable jusqu\'à {date}. Code: {code}. Ne manquez pas cette offre !',
      variables: ['reduction', 'produit', 'date', 'code'],
      utilisations: 445,
      favori: false,
      dateCreation: '2025-10-05'
    },
    {
      id: 5,
      nom: 'Anniversaire client',
      categorie: 'evenement',
      contenu: '🎉 Joyeux anniversaire {nom} ! Pour célébrer, voici un cadeau: {cadeau}. Valable jusqu\'au {date}.',
      variables: ['nom', 'cadeau', 'date'],
      utilisations: 156,
      favori: true,
      dateCreation: '2025-10-01'
    },
    {
      id: 6,
      nom: 'Code de vérification',
      categorie: 'securite',
      contenu: 'Votre code de vérification est: {code}. Valable 10 minutes. Ne partagez ce code avec personne.',
      variables: ['code'],
      utilisations: 3421,
      favori: false,
      dateCreation: '2025-09-28'
    }
  ]);

  const categories = [
    { id: 'tous', label: 'Tous', icon: MessageSquare, count: templates.length },
    { id: 'marketing', label: 'Marketing', icon: ShoppingCart, count: templates.filter(t => t.categorie === 'marketing').length },
    { id: 'notification', label: 'Notification', icon: Bell, count: templates.filter(t => t.categorie === 'notification').length },
    { id: 'transactionnel', label: 'Transactionnel', icon: CheckCircle, count: templates.filter(t => t.categorie === 'transactionnel').length },
    { id: 'evenement', label: 'Événement', icon: Calendar, count: templates.filter(t => t.categorie === 'evenement').length },
    { id: 'securite', label: 'Sécurité', icon: Star, count: templates.filter(t => t.categorie === 'securite').length }
  ];

  const getCategoryIcon = (categorie) => {
    const cat = categories.find(c => c.id === categorie);
    return cat ? cat.icon : MessageSquare;
  };

  const getCategoryColor = (categorie: any) => {
    const colors = {
      marketing: 'bg-blue-100 text-blue-700',
      notification: 'bg-purple-100 text-purple-700',
      transactionnel: 'bg-green-100 text-green-700',
      evenement: 'bg-pink-100 text-pink-700',
      securite: 'bg-orange-100 text-orange-700'
    };
    return colors[categorie] || 'bg-slate-100 text-slate-700';
  };

  const filteredTemplates = templates.filter(template => {
    const matchCategory = selectedCategory === 'tous' || template.categorie === selectedCategory;
    const matchSearch = template.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       template.contenu.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleCreateTemplate = () => {
    if (!newTemplate.nom || !newTemplate.contenu) return;

    const template = {
      id: Date.now(),
      nom: newTemplate.nom,
      categorie: newTemplate.categorie,
      contenu: newTemplate.contenu,
      variables: extractVariables(newTemplate.contenu),
      utilisations: 0,
      favori: false,
      dateCreation: new Date().toISOString().split('T')[0]
    };

    setTemplates([template, ...templates]);
    setShowCreateModal(false);
    setNewTemplate({ nom: '', categorie: 'marketing', contenu: '', variables: [] });
  };

  const extractVariables = (text) => {
    const regex = /\{([^}]+)\}/g;
    const matches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (!matches.includes(match[1])) {
        matches.push(match[1]);
      }
    }
    return matches;
  };

  const toggleFavori = (id) => {
    setTemplates(templates.map(t =>
      t.id === id ? { ...t, favori: !t.favori } : t
    ));
  };

  const deleteTemplate = (id) => {
    if (confirm('Supprimer ce template ?')) {
      setTemplates(templates.filter(t => t.id !== id));
    }
  };

  const duplicateTemplate = (template) => {
    const newTemplate = {
      ...template,
      id: Date.now(),
      nom: `${template.nom} (copie)`,
      utilisations: 0,
      dateCreation: new Date().toISOString().split('T')[0]
    };
    setTemplates([newTemplate, ...templates]);
  };

  const useTemplate = (template: any) => {
    // Ici, vous pouvez rediriger vers la page d'envoi SMS avec le template pré-rempli
    console.log('Utiliser template:', template);
    alert(`Template "${template.nom}" prêt à être utilisé !`);
  };

  return (
    <Layout>
      <Header />
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Templates SMS</h1>
        <p className="text-slate-500">Créez et gérez vos modèles de messages</p>
      </div>

      {/* Modal Création */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Nouveau template</h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Nom du template *
                </label>
                <input
                  type="text"
                  value={newTemplate.nom}
                  onChange={(e) => setNewTemplate({...newTemplate, nom: e.target.value})}
                  placeholder="Ex: Promotion été 2025"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Catégorie
                </label>
                <select
                  value={newTemplate.categorie}
                  onChange={(e) => setNewTemplate({...newTemplate, categorie: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="marketing">Marketing</option>
                  <option value="notification">Notification</option>
                  <option value="transactionnel">Transactionnel</option>
                  <option value="evenement">Événement</option>
                  <option value="securite">Sécurité</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Contenu du message *
                </label>
                <textarea
                  value={newTemplate.contenu}
                  onChange={(e) => setNewTemplate({...newTemplate, contenu: e.target.value})}
                  placeholder="Utilisez {variable} pour les variables dynamiques"
                  rows={6}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                  <span>{newTemplate.contenu.length} / 160 caractères</span>
                  <span>{Math.ceil(newTemplate.contenu.length / 160)} segment(s)</span>
                </div>
              </div>

              {extractVariables(newTemplate.contenu).length > 0 && (
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm font-semibold text-blue-900 mb-2">
                    Variables détectées :
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {extractVariables(newTemplate.contenu).map((variable, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-200 text-blue-900 rounded-full text-sm font-semibold">
                        {'{' + variable + '}'}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-semibold transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateTemplate}
                disabled={!newTemplate.nom || !newTemplate.contenu}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Créer le template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Prévisualisation */}
      {showPreviewModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Aperçu du template</h2>
              <button 
                onClick={() => setShowPreviewModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-2">Nom</p>
                <p className="font-bold text-slate-900">{selectedTemplate.nom}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-500 mb-2">Catégorie</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(selectedTemplate.categorie)}`}>
                  {selectedTemplate.categorie}
                </span>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-500 mb-2">Message</p>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-slate-700">{selectedTemplate.contenu}</p>
                </div>
              </div>

              {selectedTemplate.variables.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-slate-500 mb-2">Variables</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.variables.map((variable, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                        {'{' + variable + '}'}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-semibold text-slate-500 mb-2">Statistiques</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600">Utilisations</p>
                    <p className="text-2xl font-bold text-green-700">{selectedTemplate.utilisations}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">Segments</p>
                    <p className="text-2xl font-bold text-blue-700">{Math.ceil(selectedTemplate.contenu.length / 160)}</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                useTemplate(selectedTemplate);
                setShowPreviewModal(false);
              }}
              className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Utiliser ce template
            </button>
          </div>
        </div>
      )}

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un template..."
              className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Nouveau template
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-3 mb-6">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              {category.label}
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                selectedCategory === category.id
                  ? 'bg-white/20'
                  : 'bg-slate-100'
              }`}>
                {category.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Aucun template trouvé</h3>
          <p className="text-slate-500 mb-6">Créez votre premier template pour commencer</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Créer un template
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => {
            const Icon = getCategoryIcon(template.categorie);
            return (
              <div
                key={template.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1 relative"
              >
                {/* Badge Favori */}
                {template.favori && (
                  <div className="absolute top-4 right-4">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  </div>
                )}

                {/* Icône catégorie */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${getCategoryColor(template.categorie)}`}>
                  <Icon className="w-6 h-6" />
                </div>

                {/* Nom et catégorie */}
                <h3 className="text-xl font-bold text-slate-900 mb-2">{template.nom}</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${getCategoryColor(template.categorie)}`}>
                  {template.categorie}
                </span>

                {/* Aperçu du contenu */}
                <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                  {template.contenu}
                </p>

                {/* Variables */}
                {template.variables.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-slate-500 mb-2">Variables :</p>
                    <div className="flex flex-wrap gap-1">
                      {template.variables.slice(0, 3).map((variable, idx) => (
                        <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                          {'{' + variable + '}'}
                        </span>
                      ))}
                      {template.variables.length > 3 && (
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                          +{template.variables.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Statistiques */}
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                  <span>📊 {template.utilisations} utilisations</span>
                  <span>📅 {template.dateCreation}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedTemplate(template);
                      setShowPreviewModal(true);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors text-sm"
                  >
                    Utiliser
                  </button>
                  <button
                    onClick={() => toggleFavori(template.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      template.favori
                        ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Star className={`w-5 h-5 ${template.favori ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => duplicateTemplate(template)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteTemplate(template.id)}
                    className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info section */}
      <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-4">💡 Conseils pour vos templates</h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>Utilisez des variables entre accolades : {'{nom}'}, {'{date}'}, {'{montant}'}</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>Restez concis : 1 SMS = 160 caractères maximum</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>Ajoutez un call-to-action clair dans vos messages marketing</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>Testez vos templates avant de les utiliser en masse</span>
          </li>
        </ul>
      </div>
    </div>
    </Layout>
  );
};

export default TemplatesSMS;