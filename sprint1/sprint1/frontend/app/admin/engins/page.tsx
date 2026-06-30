'use client';
import { useEffect, useState } from 'react';
import { enginsApi } from '@/lib/api';

const fmt = (d: string) => d ? new Date(d).toLocaleDateString('fr-FR') : '—';

function Badge({ statut }: { statut: string }) {
  const m: Record<string,string> = {
    CONFORME:'bg-green-100 text-green-800',
    NON_CONFORME:'bg-red-100 text-red-800',
    EXPIRE_BIENTOT:'bg-yellow-100 text-yellow-800'
  };
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${m[statut]||'bg-slate-100 text-slate-600'}`}>{statut.replace(/_/g,' ')}</span>;
}

export default function EnginsPage() {
  const [engins, setEngins] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    type:'', marque:'', modele:'', immatriculation:'', lieuAffectation:'',
    dernierVisiteTechnique:'', prochainVisiteTechnique:'',
    dateExpirationVGP:'', dateExpirationAssurance:'', vgpFournit:'',
  });
  const [loading, setLoading] = useState(true);

  const load = () => enginsApi.getAll({ search, limit: 100 }).then(r => { setEngins(r.data.data ?? r.data); setLoading(false); });
  useEffect(() => { load(); }, [search]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await enginsApi.create(form);
    setShowForm(false);
    setForm({ type:'',marque:'',modele:'',immatriculation:'',lieuAffectation:'',dernierVisiteTechnique:'',prochainVisiteTechnique:'',dateExpirationVGP:'',dateExpirationAssurance:'',vgpFournit:'' });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet engin ?')) return;
    await enginsApi.delete(id); setSelected(null); load();
  };

  const qrValue = (id: string) => `${typeof window !== 'undefined' ? window.location.origin : ''}/verify/engin-${id}`;

  const Field = ({ label, value, onChange, type = 'text', required = false }: any) => (
    <div>
      <label className="text-xs text-slate-500 mb-1 block">{label}{required && ' *'}</label>
      <input type={type} required={required} value={value} onChange={e => onChange(e.target.value)}
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-slate-400" />
    </div>
  );

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
              <Field label="Type *" value={form.type} onChange={(v: string) => setForm({...form,type:v})} required />
              <Field label="Marque" value={form.marque} onChange={(v: string) => setForm({...form,marque:v})} />
              <Field label="Modèle" value={form.modele} onChange={(v: string) => setForm({...form,modele:v})} />
              <Field label="Immatriculation *" value={form.immatriculation} onChange={(v: string) => setForm({...form,immatriculation:v})} required />
              <Field label="Lieu d'affectation" value={form.lieuAffectation} onChange={(v: string) => setForm({...form,lieuAffectation:v})} />
              <Field label="VGP fourni" value={form.vgpFournit} onChange={(v: string) => setForm({...form,vgpFournit:v})} />
            </div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mt-2">Dates de contrôle</p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Dernière visite technique" value={form.dernierVisiteTechnique} type="date" onChange={(v: string) => setForm({...form,dernierVisiteTechnique:v})} />
              <Field label="Prochaine visite technique" value={form.prochainVisiteTechnique} type="date" onChange={(v: string) => setForm({...form,prochainVisiteTechnique:v})} />
              <Field label="Expiration VGP" value={form.dateExpirationVGP} type="date" onChange={(v: string) => setForm({...form,dateExpirationVGP:v})} />
              <Field label="Expiration assurance" value={form.dateExpirationAssurance} type="date" onChange={(v: string) => setForm({...form,dateExpirationAssurance:v})} />
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
                  <p className="text-xs font-mono text-slate-400">{e.immatriculation} {e.lieuAffectation ? `· ${e.lieuAffectation}` : ''}</p>
                </div>
                <Badge statut={e.statut} />
              </div>
            ))}
        </div>

        {selected && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 overflow-y-auto max-h-[80vh]">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg">{selected.type}</h3>
                <p className="text-slate-500 text-sm">{selected.marque} {selected.modele}</p>
              </div>
              <div className="flex gap-2">
                <a href={`data:text/plain,${encodeURIComponent(qrValue(selected.id))}`} download={`qr-${selected.immatriculation}.txt`}
                  className="text-xs border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600">📋 Lien QR</a>
                <button onClick={() => handleDelete(selected.id)} className="text-xs border border-red-200 text-red-600 px-3 py-1.5 rounded-lg">Supprimer</button>
              </div>
            </div>
            <Badge statut={selected.statut} />
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                ['📍 Lieu d\'affectation', selected.lieuAffectation || '—'],
                ['🔧 VGP fourni', selected.vgpFournit || '—'],
                ['📅 Dernière visite tech.', fmt(selected.dernierVisiteTechnique)],
                ['📅 Prochaine visite tech.', fmt(selected.prochainVisiteTechnique)],
                ['📅 Expiration VGP', fmt(selected.dateExpirationVGP)],
                ['📅 Expiration assurance', fmt(selected.dateExpirationAssurance)],
              ].map(([label, val]) => (
                <div key={label} className="bg-slate-50 px-3 py-2 rounded-lg">
                  <p className="text-slate-400">{label}</p>
                  <p className="text-slate-700 font-medium mt-0.5">{val}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
