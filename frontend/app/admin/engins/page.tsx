'use client';
import { useEffect, useState } from 'react';
import { enginsApi } from '@/lib/api';
import FileUpload from '@/components/FileUpload';

const fmt = (d: string) => d ? new Date(d).toLocaleDateString('fr-FR') : '—';

function Badge({ statut }: { statut: string }) {
  const m: Record<string,string> = {
    CONFORME:'bg-green-100 text-green-800',
    NON_CONFORME:'bg-red-100 text-red-800',
    EXPIRE_BIENTOT:'bg-yellow-100 text-yellow-800'
  };
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${m[statut]||'bg-slate-100 text-slate-600'}`}>{statut.replace(/_/g,' ')}</span>;
}

const EMPTY = { type:'', marque:'', modele:'', immatriculation:'', lieuAffectation:'', dernierVisiteTechnique:'', prochainVisiteTechnique:'', dateExpirationVGP:'', dateExpirationAssurance:'', vgpFournit:'' };

export default function EnginsPage() {
  const [engins, setEngins] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({...EMPTY});
  const [loading, setLoading] = useState(true);

  const load = () => enginsApi.getAll({ search, limit: 100 }).then(r => { setEngins(r.data.data ?? r.data); setLoading(false); });
  useEffect(() => { load(); }, [search]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await enginsApi.create(form);
    setShowForm(false);
    setForm({...EMPTY});
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet engin ?')) return;
    await enginsApi.delete(id); setSelected(null); load();
  };

  const qrValue = (id: string) => `${typeof window !== 'undefined' ? window.location.origin : ''}/verify/engin-${id}`;
  const ic = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-slate-400";
  const lc = "text-xs text-slate-500 mb-1 block";

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-slate-800">🏗️ Engins</h1>
        <button onClick={() => setShowForm(true)} className="text-sm bg-[#D50032] text-white px-4 py-2 rounded-xl">+ Ajouter</button>
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm mb-4 focus:outline-none" />

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-5">
          <h3 className="font-semibold mb-4">Nouvel engin</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Identification</p>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lc}>Type *</label><input required value={form.type} onChange={e => setForm({...form, type: e.target.value})} className={ic} /></div>
              <div><label className={lc}>Marque</label><input value={form.marque} onChange={e => setForm({...form, marque: e.target.value})} className={ic} /></div>
              <div><label className={lc}>Modèle</label><input value={form.modele} onChange={e => setForm({...form, modele: e.target.value})} className={ic} /></div>
              <div><label className={lc}>Immatriculation *</label><input required value={form.immatriculation} onChange={e => setForm({...form, immatriculation: e.target.value})} className={ic} /></div>
              <div><label className={lc}>Lieu d'affectation</label><input value={form.lieuAffectation} onChange={e => setForm({...form, lieuAffectation: e.target.value})} className={ic} /></div>
              <div><label className={lc}>VGP fourni</label><input value={form.vgpFournit} onChange={e => setForm({...form, vgpFournit: e.target.value})} className={ic} /></div>
            </div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mt-2">Dates de contrôle</p>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lc}>Dernière visite technique</label><input type="date" value={form.dernierVisiteTechnique} onChange={e => setForm({...form, dernierVisiteTechnique: e.target.value})} className={ic} /></div>
              <div><label className={lc}>Prochaine visite technique</label><input type="date" value={form.prochainVisiteTechnique} onChange={e => setForm({...form, prochainVisiteTechnique: e.target.value})} className={ic} /></div>
              <div><label className={lc}>Expiration VGP</label><input type="date" value={form.dateExpirationVGP} onChange={e => setForm({...form, dateExpirationVGP: e.target.value})} className={ic} /></div>
              <div><label className={lc}>Expiration assurance</label><input type="date" value={form.dateExpirationAssurance} onChange={e => setForm({...form, dateExpirationAssurance: e.target.value})} className={ic} /></div>
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
          {loading ? <div className="p-8 text-center text-slate-400">Chargement...</div>
            : engins.map(e => (
              <div key={e.id} onClick={() => setSelected(e)}
                className={`flex items-center justify-between px-4 py-3 border-b border-slate-100 cursor-pointer hover:bg-slate-50 ${selected?.id===e.id?'bg-blue-50':''}`}>
                <div>
                  <p className="font-medium text-sm">{e.type} <span className="text-slate-400 font-normal">{e.marque}</span></p>
                  <p className="text-xs font-mono text-slate-400">{e.immatriculation} {e.lieuAffectation?`· ${e.lieuAffectation}`:''}</p>
                </div>
                <Badge statut={e.statut} />
              </div>
            ))}
        </div>

        {selected && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 overflow-y-auto max-h-[80vh]">
            <div className="flex items-start justify-between">
              <div><h3 className="font-bold text-lg">{selected.type}</h3><p className="text-slate-500 text-sm">{selected.marque} {selected.modele}</p></div>
              <div className="flex gap-2">
                <a href={`data:text/plain,${encodeURIComponent(qrValue(selected.id))}`} download={`qr-${selected.immatriculation}.txt`} className="text-xs border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600">📋 Lien QR</a>
                <button onClick={() => handleDelete(selected.id)} className="text-xs border border-red-200 text-red-600 px-3 py-1.5 rounded-lg">Supprimer</button>
              </div>
            </div>
            <Badge statut={selected.statut} />
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                ["📍 Lieu d'affectation", selected.lieuAffectation||'—'],
                ['🔧 VGP fourni', selected.vgpFournit||'—'],
                ['📅 Dernière visite tech.', fmt(selected.dernierVisiteTechnique)],
                ['📅 Prochaine visite tech.', fmt(selected.prochainVisiteTechnique)],
                ['📅 Expiration VGP', fmt(selected.dateExpirationVGP)],
                ['📅 Expiration assurance', fmt(selected.dateExpirationAssurance)],
              ].map(([label,val])=>(
                <div key={label} className="bg-slate-50 px-3 py-2 rounded-lg">
                  <p className="text-slate-400">{label}</p>
                  <p className="text-slate-700 font-medium mt-0.5">{val}</p>
                </div>
              ))}
            </div>
            {selected.documentVGP && (
              <a href={selected.documentVGP} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700 hover:bg-blue-100">
                📎 Voir le document VGP
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
