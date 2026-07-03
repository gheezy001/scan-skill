'use client';
import { useEffect, useState } from 'react';
import { ouvriersApi, habTypesApi } from '@/lib/api';
import FileUpload from '@/components/FileUpload';

const fmt = (d: string) => d ? new Date(d).toLocaleDateString('fr-FR') : '—';
const GROUPES_SANGUINS = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];
const ic = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-slate-400";
const lc = "text-xs text-slate-500 mb-1 block";

const EMPTY_FORM = { nom:'', prenom:'', telephone:'', email:'', role:'', entreprise:'', dateEmbauche:'', adresse:'', nationalite:'', groupeSanguin:'', numeroPieceIdentite:'', typePieceIdentite:'CIN', contactUrgenceNom:'', contactUrgenceTel:'', photo:'' };
const EMPTY_HAB = { typeId:'', dateObtention:'', dateExpiration:'', entreprise:'', document:'' };

export default function CollaborateursPage() {
  const [collaborateurs, setCollaborateurs] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({...EMPTY_FORM});
  const [habForm, setHabForm] = useState({...EMPTY_HAB});

  const load = () => {
    Promise.all([ouvriersApi.getAll({ search, limit: 100 }), habTypesApi.getAll()])
      .then(([o, t]) => { setCollaborateurs(o.data.data ?? o.data); setTypes(t.data); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [search]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await ouvriersApi.create(form);
    setShowForm(false);
    setForm({...EMPTY_FORM});
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce collaborateur ?')) return;
    await ouvriersApi.delete(id); setSelected(null); load();
  };

  const handleAddHab = async (e: React.FormEvent) => {
    e.preventDefault();
    await ouvriersApi.addHabilitation(selected.id, habForm);
    setHabForm({...EMPTY_HAB});
    const updated = await ouvriersApi.getOne(selected.id);
    setSelected(updated.data); load();
  };

  const handleDeleteHab = async (habId: string) => {
    await ouvriersApi.deleteHabilitation(habId);
    const updated = await ouvriersApi.getOne(selected.id);
    setSelected(updated.data); load();
  };

  const qrValue = (id: string) => `${typeof window !== 'undefined' ? window.location.origin : ''}/verify/collaborateur-${id}`;

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-slate-800">👷 Collaborateurs</h1>
        <button onClick={() => setShowForm(true)} className="text-sm bg-[#D50032] text-white px-4 py-2 rounded-xl">+ Ajouter</button>
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un collaborateur..." className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm mb-4 focus:outline-none" />

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-5">
          <h3 className="font-semibold text-slate-800 mb-4">Nouveau collaborateur</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Informations principales</p>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lc}>Nom *</label><input required value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} className={ic} /></div>
              <div><label className={lc}>Prénom *</label><input required value={form.prenom} onChange={e => setForm({...form, prenom: e.target.value})} className={ic} /></div>
              <div><label className={lc}>Téléphone *</label><input required value={form.telephone} onChange={e => setForm({...form, telephone: e.target.value})} className={ic} /></div>
              <div><label className={lc}>Email</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className={ic} /></div>
              <div><label className={lc}>Rôle / Poste *</label><input required value={form.role} onChange={e => setForm({...form, role: e.target.value})} className={ic} /></div>
              <div><label className={lc}>Entreprise</label><input value={form.entreprise} onChange={e => setForm({...form, entreprise: e.target.value})} className={ic} /></div>
              <div><label className={lc}>Date embauche</label><input type="date" value={form.dateEmbauche} onChange={e => setForm({...form, dateEmbauche: e.target.value})} className={ic} /></div>
              <div><label className={lc}>Adresse</label><input value={form.adresse} onChange={e => setForm({...form, adresse: e.target.value})} className={ic} /></div>
            </div>
            <div>
              <label className={lc}>Photo</label>
              <FileUpload folder="collaborateurs" accept=".jpg,.jpeg,.png,.webp" label="Ajouter une photo" currentUrl={form.photo} onUpload={(url) => setForm({...form, photo: url})} />
            </div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mt-2">Informations complémentaires</p>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lc}>Nationalité</label><input value={form.nationalite} onChange={e => setForm({...form, nationalite: e.target.value})} className={ic} /></div>
              <div>
                <label className={lc}>Groupe sanguin</label>
                <select value={form.groupeSanguin} onChange={e => setForm({...form, groupeSanguin: e.target.value})} className={ic + " bg-white"}>
                  <option value="">Sélectionner...</option>
                  {GROUPES_SANGUINS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className={lc}>Type pièce d'identité</label>
                <select value={form.typePieceIdentite} onChange={e => setForm({...form, typePieceIdentite: e.target.value})} className={ic + " bg-white"}>
                  <option value="CIN">CIN</option>
                  <option value="PASSEPORT">Passeport</option>
                </select>
              </div>
              <div><label className={lc}>Numéro pièce d'identité</label><input value={form.numeroPieceIdentite} onChange={e => setForm({...form, numeroPieceIdentite: e.target.value})} className={ic} /></div>
            </div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mt-2">Contact urgence</p>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lc}>Nom contact urgence</label><input value={form.contactUrgenceNom} onChange={e => setForm({...form, contactUrgenceNom: e.target.value})} className={ic} /></div>
              <div><label className={lc}>Tél. contact urgence</label><input value={form.contactUrgenceTel} onChange={e => setForm({...form, contactUrgenceTel: e.target.value})} className={ic} /></div>
            </div>
            <div className="flex gap-2 mt-2">
              <button type="submit" className="bg-[#D50032] text-white px-4 py-2 rounded-xl text-sm">Créer</button>
              <button type="button" onClick={() => setShowForm(false)} className="border border-slate-200 px-4 py-2 rounded-xl text-sm text-slate-600">Annuler</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {loading ? <div className="p-8 text-center text-slate-400">Chargement...</div>
            : collaborateurs.map(c => {
              const hasExpire = c.habilitations?.some((h:any) => h.statut==='EXPIRE');
              return (
                <div key={c.id} onClick={() => setSelected(c)} className={`flex items-center gap-3 px-4 py-3 border-b border-slate-100 cursor-pointer hover:bg-slate-50 ${selected?.id===c.id?'bg-blue-50':''}`}>
                  {c.photo ? <img src={c.photo} alt={c.nom} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                    : <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-800 flex-shrink-0">{c.prenom?.[0]}{c.nom?.[0]}</div>}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-slate-800">{c.prenom} {c.nom}</p>
                    <p className="text-xs text-slate-400 truncate">{c.role||'—'} {c.entreprise?`· ${c.entreprise}`:''}</p>
                  </div>
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${hasExpire?'bg-red-500':'bg-green-500'}`} />
                </div>
              );
            })}
        </div>

        {selected && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 overflow-y-auto max-h-[80vh]">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {selected.photo ? <img src={selected.photo} alt={selected.nom} className="w-14 h-14 rounded-xl object-cover" />
                  : <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-lg font-semibold text-blue-800">{selected.prenom?.[0]}{selected.nom?.[0]}</div>}
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{selected.prenom} {selected.nom}</h3>
                  <p className="text-slate-500 text-sm">{selected.role||'—'} {selected.entreprise?`· ${selected.entreprise}`:''}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap justify-end">
                <a href={`data:text/plain,${encodeURIComponent(qrValue(selected.id))}`} download={`qr-${selected.nom}.txt`} className="text-xs border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600">📋 Lien QR</a>
                <button onClick={() => handleDelete(selected.id)} className="text-xs border border-red-200 text-red-600 px-3 py-1.5 rounded-lg">Supprimer</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[['📱 Téléphone',selected.telephone],['📧 Email',selected.email||'—'],['🏢 Entreprise',selected.entreprise||'—'],['📅 Embauche',fmt(selected.dateEmbauche)],['🌍 Nationalité',selected.nationalite||'—'],['🩸 Groupe sanguin',selected.groupeSanguin||'—'],['🪪 Pièce identité',selected.numeroPieceIdentite?`${selected.typePieceIdentite}: ${selected.numeroPieceIdentite}`:'—'],['📍 Adresse',selected.adresse||'—'],['🚨 Contact urgence',selected.contactUrgenceNom?`${selected.contactUrgenceNom} — ${selected.contactUrgenceTel||''}`:'—']].map(([label,value])=>(
                <div key={label} className="bg-slate-50 px-3 py-2 rounded-lg">
                  <p className="text-slate-400">{label}</p>
                  <p className="text-slate-700 font-medium mt-0.5 truncate">{value}</p>
                </div>
              ))}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">🛡️ Habilitations</h4>
              <div className="space-y-2">
                {selected.habilitations?.map((h:any) => (
                  <div key={h.id} className={`p-3 rounded-xl border ${h.statut==='VALIDE'?'bg-green-50 border-green-200':'bg-red-50 border-red-200'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{h.nom}</p>
                        <p className="text-xs text-slate-500">Expire le {fmt(h.dateExpiration)}</p>
                        {h.document && <a href={h.document} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">📎 Voir le document</a>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${h.statut==='VALIDE'?'text-green-700':'text-red-700'}`}>{h.statut}</span>
                        <button onClick={() => handleDeleteHab(h.id)} className="text-slate-300 hover:text-red-500 text-lg">×</button>
                      </div>
                    </div>
                  </div>
                ))}
                {(!selected.habilitations||selected.habilitations.length===0) && <p className="text-slate-400 text-sm italic">Aucune habilitation</p>}
              </div>
              <form onSubmit={handleAddHab} className="mt-3 p-3 bg-slate-50 rounded-xl space-y-2">
                <p className="text-xs font-semibold text-slate-600">Ajouter une habilitation</p>
                <select required value={habForm.typeId} onChange={e => setHabForm({...habForm, typeId: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none bg-white">
                  <option value="">Type d'habilitation...</option>
                  {types.map((t:any) => <option key={t.id} value={t.id}>{t.nom}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" required value={habForm.dateObtention} onChange={e => setHabForm({...habForm, dateObtention: e.target.value})} className="border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                  <input type="date" required value={habForm.dateExpiration} onChange={e => setHabForm({...habForm, dateExpiration: e.target.value})} className="border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                </div>
                <FileUpload folder="habilitations" label="Document habilitation (PDF, image)" currentUrl={habForm.document} onUpload={(url) => setHabForm({...habForm, document: url})} />
                <button type="submit" className="w-full bg-slate-800 text-white py-2 rounded-lg text-sm">Ajouter</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
