import { Edit, Plus, Search, Trash2, Upload, Users } from 'lucide-react';
import { useState } from 'react';
import { contacts } from '../data/datas';
import { stores } from '../stores/stores';
import { SmsStore } from '../stores/smsStore';

export const Contacts = () => {
    const [searchContact, setSearchContact] = useState('');
    const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
    const {setActiveMenu} = stores()
    const {ajouterDestinataires} = SmsStore()

    const toggleContactSelection = (contactId: number) => {
        setSelectedContacts(prev => 
        prev.includes(contactId) 
            ? prev.filter(id => id !== contactId)
            : [...prev, contactId]
        );
    };

  const importSelectedContacts = () => {
    const selected = contacts.filter(c => selectedContacts.includes(c.id));
    const phones = selected.map(c => c.telephone);
    ajouterDestinataires(phones);
    setSelectedContacts([]);
    setActiveMenu('sms');
  };

  const filteredContacts = contacts.filter(c => 
    c.nom.toLowerCase().includes(searchContact.toLowerCase()) ||
    c.telephone.includes(searchContact) ||
    c.groupe.toLowerCase().includes(searchContact.toLowerCase())
  );

  return(
          <div className="p-8">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 mb-6">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-900">
                    Mes Contacts ({contacts.length})
                  </h2>
                  <div className="flex gap-3">
                    <label className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      <span className="font-semibold text-sm">Importer CSV</span>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleImportCSV}
                        className="hidden"
                        />
                    </label>
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      <span className="font-semibold text-sm">Nouveau Contact</span>
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={searchContact}
                      onChange={(e) => setSearchContact(e.target.value)}
                      placeholder="Rechercher un contact..."
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {selectedContacts.length > 0 && (
                    <button 
                      onClick={importSelectedContacts}
                      className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors font-semibold"
                    >
                      Utiliser ({selectedContacts.length})
                    </button>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="px-6 py-4 text-left">
                        <input 
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedContacts(filteredContacts.map(c => c.id));
                            } else {
                              setSelectedContacts([]);
                            }
                          }}
                          className="w-4 h-4 rounded"
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Nom</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Téléphone</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Groupe</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Date d'ajout</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContacts.map((contact) => (
                      <tr key={contact.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <input 
                            type="checkbox"
                            checked={selectedContacts.includes(contact.id)}
                            onChange={() => toggleContactSelection(contact.id)}
                            className="w-4 h-4 rounded"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-900">{contact.nom}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-slate-600">{contact.telephone}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            {contact.groupe}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-slate-500 text-sm">{contact.date}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                              <Edit className="w-4 h-4 text-slate-600" />
                            </button>
                            <button className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredContacts.length === 0 && (
                <div className="p-12 text-center">
                  <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 text-lg font-semibold">Aucun contact trouvé</p>
                  <p className="text-slate-400 text-sm mt-2">Essayez de modifier votre recherche</p>
                </div>
              )}
            </div>

            {/* Statistiques des groupes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900">Clients</h3>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-900">3</p>
                <p className="text-sm text-slate-500 mt-1">contacts actifs</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900">Partenaires</h3>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-900">1</p>
                <p className="text-sm text-slate-500 mt-1">contacts actifs</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900">Équipe</h3>
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-900">1</p>
                <p className="text-sm text-slate-500 mt-1">contacts actifs</p>
              </div>
            </div>
          </div>
  )
}