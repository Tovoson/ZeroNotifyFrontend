import { X } from "lucide-react";
import { contactStores } from "../stores/contactStore";
import { useAuthStore } from "../stores/authStore";

export const ContactModal = () => {
  const {
    showAddContactModal,
    setShowAddContactModal,
    newContact,
    addNewContact,
    handleAddContact,
    modifContact,
    setModifContact,
    handleModifierContact,
    reInitialiserContact,
    isEditing
  } = contactStores();

  const {user} = useAuthStore()

  return (
    <div>
      {showAddContactModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {isEditing ? "Modifier Contact" : "Nouveau Contact"}
              </h2>
              <button
                onClick={() => {
                  setShowAddContactModal(false);
                  reInitialiserContact()
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                 <input
                  type="hidden"
                  value={modifContact.id}
                  onChange={(e) => setModifContact("id", e.target.value)}
                  placeholder="Jean Dupont"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  value={isEditing ? modifContact.nom : newContact.nom}
                  onChange={(e) => isEditing ? setModifContact("nom", e.target.value) : addNewContact("nom", e.target.value)}
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
                  value={isEditing ? modifContact.telephone : newContact.telephone}
                  onChange={(e) => isEditing ? setModifContact("telephone", e.target.value) : addNewContact("telephone", e.target.value)}
                  placeholder="+261 34 00 000 00"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Groupe
                </label>
                <select
                  value={isEditing ? modifContact.groupe : newContact.groupe}
                  onChange={(e) => isEditing ? setModifContact("groupe", e.target.value) :  addNewContact("groupe", e.target.value)}
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
                onClick={() => {
                  setShowAddContactModal(false);
                  reInitialiserContact()
                }}
                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-semibold transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => isEditing ? handleModifierContact(user?.id) : handleAddContact(user?.id)}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Ajouter
                {modifContact ? "Modifier": "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
