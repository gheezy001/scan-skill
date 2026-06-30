'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import FileUpload from '@/components/FileUpload';

const modeOperatoiresApi = {
  getAll: (params?: any) => api.get('/mode-operatoires', { params }),
  getOne: (id: string) => api.get(`/mode-operatoires/${id}`),
  create: (data: any) => api.post('/mode-operatoires', data),
  update: (id: string, data: any) => api.put(`/mode-operatoires/${id}`, data),
  delete: (id: string) => api.delete(`/mode-operatoires/${id}`),
  approuver: (id: string) => api.patch(`/mode-operatoires/${id}/approuver`),
  rejeter: (id: string) => api.patch(`/mode-operatoires/${id}/rejeter`),
  addActivite: (id: string, data: any) => api.post(`/mode-operatoires/${id}/activites`, data),
  updateActivite: (id: string, data: any) => api.put(`/mode-operatoires/activites/${id}`, data),
  deleteActivite: (id: string) => api.delete(`/mode-operatoires/activites/${id}`),
};

function StatutBadge({ statut }: { statut: string }) {
  const ok = statut === 'APPROUVE';
  return (
    <span className={`text-xs font-bold px-3 py-1 rounded-full ${ok ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
      {ok ? '✅ Approuvé' : '⏳ Non approuvé'}
    </span>
  );
}

export default function ModeOperatoirePage() {
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('tous');
  const [showForm, setShowForm] = useState(false);
  const [showActiviteForm, setShowActiviteForm] = useState(false);
  const [form, setForm] = useState({ titre: '', description: '' });
  const [activiteForm, setActiviteForm] = useState({ titre: '', description: '', document: '' });
  const [loading, setLoading] = useState(true);

  const load = () => {
    modeOperatoiresApi.getAll({ search, statut: filter === 'tous' ? undefined : filter })
      .then(r => { setItems(r.data); setLoading(false); });
  };

  useEffect(() => { load(); }, [search, filter]);

  const refreshSelected = async (id: string) => {
    const res = await modeOperatoiresApi.getOne(id);
    setSelected(res.data);
    load();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await modeOperatoiresApi.create(form);
    setShowForm(false);
    setForm({ titre: '', description: '' });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce mode opératoire ?')) return;
    await modeOperatoiresApi.delete(id);
    setSelected(null);
    load();
  };

  const handleApprouver = async (id: string) => {
    await modeOperatoiresApi.approuver(id);
    refreshSelected(id);
  };

  const handleRejeter = async (id: string) => {
    await modeOperatoiresApi.rejeter(id);
    refreshSelected(id);
  };

  const handleAddActivite = async (e: React.FormEvent) => {
    e.preventDefault();
    await modeOperatoiresApi.addActivite(selected.id, activiteForm);
    setShowActiviteForm(false);
    setActiviteForm({ titre: '', description: '', document: '' });
    refreshSelected(selected.id);
  };

  const handleDeleteActivite = async (activiteId: string) => {
    await modeOperatoiresApi.deleteActivite(activiteId);
    refreshSelected(selected.id);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-slate-800">📋 Modes Opératoires</h1>
        <button onClick={() => setShowForm(true)} className="text-sm bg-[#D50032] text-white px-4 py-2 rounded-xl">+ Nouveau</button>
      </div>

      <div className="flex gap-3 mb-4 flex-wrap">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
          className="flex-1 min-w-48 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
        <div className="flex gap-2">
          {[['tous','Tous'],['APPROUVE','Approuvés'],['NON_APPROUVE','Non approuvés']].map(([val,label]) => (
            <button key={val} onClick={() => setFilter(val)}
              className={`text-xs px-3 py-2 rounded-xl border transition-colors ${filter===val?'bg-slate-800 text-white border-slate-800':'border-slate-200 text-slate-500 hover:border-slate-400'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-5">
          <h3 className="font-semibold mb-4">Nouveau mode opératoire</h3>
          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Titre *</label>
              <input required value={form.titre} onChange={e => setForm({...form,titre:e.target.value})}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Description</label>
              <textarea value={form.description} onChange={e => setForm({...form,description:e.target.value})}
                rows={3} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-[#D50032] text-white px-4 py-2 rounded-xl text-sm">Créer</button>
              <button type="button" onClick={() => setShowForm(false)} className="border border-slate-200 px-4 py-2 rounded-xl text-sm">Annuler</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {/* Liste */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {loading ? <div className="p-8 text-center text-slate-400">Chargement...</div>
            : items.length === 0 ? <div className="p-8 text-center text-slate-400">Aucun mode opératoire</div>
            : items.map(mo => (
              <div key={mo.id} onClick={() => setSelected(mo)}
                className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 ${selected?.id===mo.id?'bg-blue-50':''}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-slate-800 truncate">{mo.titre}</p>
                    {mo.description && <p className="text-xs text-slate-400 truncate mt-0.5">{mo.description}</p>}
                    <p className="text-xs text-slate-400 mt-1">{mo.activites?.length ?? 0} activité(s)</p>
                  </div>
                  <StatutBadge statut={mo.statut} />
                </div>
              </div>
            ))}
        </div>

        {/* Détail */}
        {selected && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 overflow-y-auto max-h-[80vh]">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-lg">{selected.titre}</h3>
                {selected.description && <p className="text-slate-500 text-sm mt-1">{selected.description}</p>}
              </div>
              <button onClick={() => handleDelete(selected.id)}
                className="text-xs border border-red-200 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 flex-shrink-0">
                Supprimer
              </button>
            </div>

            <div className="flex items-center justify-between">
              <StatutBadge statut={selected.statut} />
              <div className="flex gap-2">
                {selected.statut === 'NON_APPROUVE' ? (
                  <button onClick={() => handleApprouver(selected.id)}
                    className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700">
                    ✅ Approuver
                  </button>
                ) : (
                  <button onClick={() => handleRejeter(selected.id)}
                    className="text-xs bg-yellow-600 text-white px-3 py-1.5 rounded-lg hover:bg-yellow-700">
                    ↩️ Révoquer
                  </button>
                )}
              </div>
            </div>

            {/* Activités */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-slate-700">Activités ({selected.activites?.length ?? 0})</h4>
                <button onClick={() => setShowActiviteForm(!showActiviteForm)}
                  className="text-xs bg-slate-800 text-white px-3 py-1.5 rounded-lg">
                  + Ajouter
                </button>
              </div>

              {showActiviteForm && (
                <form onSubmit={handleAddActivite} className="p-3 bg-slate-50 rounded-xl space-y-2 mb-3">
                  <input required value={activiteForm.titre} onChange={e => setActiviteForm({...activiteForm,titre:e.target.value})}
                    placeholder="Titre de l'activité *"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
                  <textarea value={activiteForm.description} onChange={e => setActiviteForm({...activiteForm,description:e.target.value})}
                    placeholder="Description" rows={2}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none" />
                  <FileUpload
                    folder="mode-operatoire"
                    label="Ajouter un document (PDF, Word, image)"
                    currentUrl={activiteForm.document}
                    onUpload={(url) => setActiviteForm({...activiteForm, document: url})}
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="bg-[#D50032] text-white px-3 py-1.5 rounded-lg text-sm">Créer</button>
                    <button type="button" onClick={() => setShowActiviteForm(false)}
                      className="border border-slate-200 px-3 py-1.5 rounded-lg text-sm">Annuler</button>
                  </div>
                </form>
              )}

              <div className="space-y-2">
                {selected.activites?.length === 0 && (
                  <p className="text-slate-400 text-sm italic">Aucune activité</p>
                )}
                {selected.activites?.map((a: any, i: number) => (
                  <div key={a.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#D50032] text-white text-xs flex items-center justify-center font-bold flex-shrink-0">{i+1}</span>
                          <p className="font-medium text-sm text-slate-800">{a.titre}</p>
                        </div>
                        {a.description && <p className="text-xs text-slate-500 mt-1 ml-7">{a.description}</p>}
                        {a.document && (
                          <a href={a.document} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1 ml-7">
                            📎 Voir le document
                          </a>
                        )}
                      </div>
                      <button onClick={() => handleDeleteActivite(a.id)}
                        className="text-slate-300 hover:text-red-500 text-lg leading-none flex-shrink-0">×</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
