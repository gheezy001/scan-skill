'use client';
import { useEffect, useState } from 'react';
import { appareilsApi } from '@/lib/api';
import FileUpload from '@/components/FileUpload';

const fmt = (d: string) => d ? new Date(d).toLocaleDateString('fr-FR') : '—';
const ic = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-slate-400";
const lc = "text-xs text-slate-500 mb-1 block";

function Badge({ statut }: { statut: string }) {
  const m: Record<string,string> = { DISPONIBLE:'bg-green-100 text-green-800', EN_SERVICE:'bg-blue-100 text-blue-800', EN_MAINTENANCE:'bg-yellow-100 text-yellow-800', HORS_SERVICE:'bg-red-100 text-red-800' };
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${m[statut]||'bg-slate-100 text-slate-600'}`}>{statut.replace(/_/g,' ')}</span>;
}

const EMPTY = { nom:'', reference:'', type:'', localisation:'', statut:'DISPONIBLE', documentationTechnique:'' };

export default function AppareillagesPage() {
  const [appareils, setAppareils] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({...EMPTY});

  const load = () => appareilsApi.getAll({ search, limit: 100 }).then(r => setAppareils(r.data.data ?? r.data));
  useEffect(() => { load(); }, [search]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await appareilsApi.create(form);
    setShowForm(false);
    setForm({...EMPTY});
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ?')) return;
    await appareilsApi.delete(id); setSelected(null); load();
  };

  const handleUpdateStatut = async (id: string, statut: string) => {
    await appareilsApi.update(id, { statut });
    const updated = await appareilsApi.getOne(id);
    setSelected(updated.data); load();
  };

  const qrValue = (id: string) => `${typeof window !== 'undefined' ? window.location.origin : ''}/verify/appareil-${id}`;

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">🔧 Appareillage</h1>
        <button onClick={() => setShowForm(true)} className="text-sm bg-[#D50032] text-white px-4 py-2 rounded-xl">+ Ajouter</button>
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm mb-4 focus:outline-none" />

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-5">
          <h3 className="font-semibold mb-4">Nouvel appareil</h3>
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lc}>Nom *</label><input required value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} className={ic} /></div>
              <div><label className={lc}>Référence *</label><input required value={form.reference} onChange={e => setForm({...form, reference: e.target.value})} className={ic} /></div>
              <div><label className={lc}>Type *</label><input required value={form.type} onChange={e => setForm({...form, type: e.target.value})} className={ic} /></div>
              <div><label className={lc}>Localisation</label><input value={form.localisation} onChange={e => setForm({...form, localisation: e.target.value})} className={ic} /></div>
              <div>
                <label className={lc}>Statut</label>
                <select value={form.statut} onChange={e => setForm({...form, statut: e.target.value})} className={ic + " bg-white"}>
                  {['DISPONIBLE','EN_SERVICE','EN_MAINTENANCE','HORS_SERVICE'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Documentation technique</p>
              <FileUpload folder="appareillage" label="Ajouter la documentation technique (PDF, Word)" currentUrl={form.documentationTechnique} onUpload={(url) => setForm({...form, documentationTechnique: url})} />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-[#D50032] text-white px-4 py-2 rounded-xl text-sm">Créer</button>
              <button type="button" onClick={() => setShowForm(false)} className="border border-slate-200 px-4 py-2 rounded-xl text-sm">Annuler</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {appareils.map(a => (
            <div key={a.id} onClick={() => setSelected(a)} className={`flex items-center justify-between px-4 py-3 border-b border-slate-100 cursor-pointer hover:bg-slate-50 ${selected?.id===a.id?'bg-blue-50':''}`}>
              <div><p className="font-medium text-sm">{a.nom}</p><p className="text-xs text-slate-400 font-mono">{a.reference} · {a.type}</p></div>
              <Badge statut={a.statut} />
            </div>
          ))}
        </div>

        {selected && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 overflow-y-auto max-h-[80vh]">
            <div className="flex items-start justify-between">
              <div><h3 className="font-bold text-lg">{selected.nom}</h3><p className="text-slate-500 text-sm">{selected.type}</p></div>
              <div className="flex gap-2">
                <a href={`data:text/plain,${encodeURIComponent(qrValue(selected.id))}`} download={`qr-${selected.reference}.txt`} className="text-xs border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600">📋 Lien QR</a>
                <button onClick={() => handleDelete(selected.id)} className="text-xs border border-red-200 text-red-600 px-3 py-1.5 rounded-lg">Supprimer</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[['Référence', selected.reference],['Localisation', selected.localisation||'—'],['Dernière révision', fmt(selected.dateDerniereRevision)]].map(([l,v]) => (
                <div key={l} className="bg-slate-50 px-3 py-2 rounded-lg"><p className="text-slate-400">{l}</p><p className="text-slate-700 font-medium mt-0.5">{v}</p></div>
              ))}
            </div>
            {selected.documentationTechnique && (
              <a href={selected.documentationTechnique} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
                📎 Voir la documentation technique
              </a>
            )}
            <div>
              <p className="text-xs text-slate-500 mb-2">Changer le statut</p>
              <div className="flex flex-wrap gap-2">
                {['DISPONIBLE','EN_SERVICE','EN_MAINTENANCE','HORS_SERVICE'].map(s => (
                  <button key={s} onClick={() => handleUpdateStatut(selected.id, s)} className={`text-xs px-3 py-1.5 rounded-full border ${selected.statut===s?'bg-slate-800 text-white border-slate-800':'border-slate-200 text-slate-600'}`}>
                    {s.replace(/_/g,' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
