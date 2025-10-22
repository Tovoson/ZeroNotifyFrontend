import { X } from "lucide-react";
import { contactStores } from "../stores/contactStore";

export const ContactModal = () => {
  const {
    showAddContactModal,
    setShowAddContactModal,
    newContact,
    addNewContact,
    handleAddContact,
  } = contactStores();

  return (
    <div>
      {showAddContactModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Nouveau Contact
              </h2>
              <button
                onClick={() => setShowAddContactModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  value={newContact.nom}
                  onChange={({e}:any) => addNewContact("nom", e.target.value)}
                  placeholder="Jean Dupont"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  value={newContact.telephone}
                  onChange={(e) => addNewContact("telephone", e.target.value)}
                  placeholder="+261 34 00 000 00"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Groupe
                </label>
                <select
                  value={newContact.groupe}
                  onChange={(e) => addNewContact("groupe", e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Clients">Clients</option>
                  <option value="Partenaires">Partenaires</option>
                  <option value="Équipe">Équipe</option>
                  <option value="Fournisseurs">Fournisseurs</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddContactModal(false)}
                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-semibold transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleAddContact}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
