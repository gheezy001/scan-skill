'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { statsApi, ouvriersApi, enginsApi, appareilsApi } from '@/lib/api';

const fmt = (d: string) => d ? new Date(d).toLocaleDateString('fr-FR') : '—';
const daysLeft = (d: string) => Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);

function Badge({ statut }: { statut: string }) {
  const m: Record<string,string> = {
    CONFORME:'bg-green-100 text-green-800', VALIDE:'bg-green-100 text-green-800',
    DISPONIBLE:'bg-green-100 text-green-800', EN_SERVICE:'bg-blue-100 text-blue-800',
    EXPIRE_BIENTOT:'bg-yellow-100 text-yellow-800', EN_MAINTENANCE:'bg-yellow-100 text-yellow-800',
    NON_CONFORME:'bg-red-100 text-red-800', EXPIRE:'bg-red-100 text-red-800',
    HORS_SERVICE:'bg-red-100 text-red-800',
  };
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${m[statut]||'bg-slate-100 text-slate-600'}`}>{statut.replace(/_/g,' ')}</span>;
}

function FilterBtn({ active, onClick, children }: any) {
  return (
    <button onClick={onClick}
      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${active?'bg-slate-800 text-white border-slate-800':'border-slate-200 text-slate-500 hover:border-slate-400'}`}>
      {children}
    </button>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [collaborateurs, setCollaborateurs] = useState<any[]>([]);
  const [engins, setEngins] = useState<any[]>([]);
  const [appareils, setAppareils] = useState<any[]>([]);
  const [colSearch, setColSearch] = useState('');
  const [colFilter, setColFilter] = useState('tous');
  const [engSearch, setEngSearch] = useState('');
  const [engFilter, setEngFilter] = useState('tous');
  const [appSearch, setAppSearch] = useState('');
  const [appFilter, setAppFilter] = useState('tous');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([statsApi.dashboard(), ouvriersApi.getAll({ limit: 200 }), enginsApi.getAll({ limit: 200 }), appareilsApi.getAll({ limit: 200 })])
      .then(([s, c, e, a]) => {
        setStats(s.data);
        setCollaborateurs(c.data.data ?? c.data);
        setEngins(e.data.data ?? e.data);
        setAppareils(a.data.data ?? a.data);
      }).finally(() => setLoading(false));
  }, []);

  const colFiltres = collaborateurs.filter(c => {
    const match = `${c.nom}${c.prenom}${c.entreprise||''}`.toLowerCase().includes(colSearch.toLowerCase());
    const hasExpire = c.habilitations?.some((h: any) => h.statut === 'EXPIRE');
    if (colFilter === 'conforme') return match && !hasExpire;
    if (colFilter === 'non_conforme') return match && hasExpire;
    return match;
  });

  const engFiltres = engins.filter(e => {
    const match = `${e.type}${e.marque||''}${e.immatriculation}`.toLowerCase().includes(engSearch.toLowerCase());
    if (engFilter === 'CONFORME') return match && e.statut === 'CONFORME';
    if (engFilter === 'NON_CONFORME') return match && e.statut !== 'CONFORME';
    return match;
  });

  const appFiltres = appareils.filter(a => {
    const match = `${a.nom}${a.reference}`.toLowerCase().includes(appSearch.toLowerCase());
    const ok = a.statut === 'DISPONIBLE' || a.statut === 'EN_SERVICE';
    if (appFilter === 'ok') return match && ok;
    if (appFilter === 'nok') return match && !ok;
    return match;
  });

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-slate-200 border-t-[#D50032] rounded-full animate-spin" /></div>;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-800">Dashboard conformité</h1>
        <Link href="/scanner" className="text-sm bg-[#D50032] text-white px-4 py-2 rounded-xl hover:bg-[#B5002A] transition-colors">📷 Scanner</Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Collaborateurs', val: stats?.totalCollaborateurs, sub: `${stats?.collaborateursConformes ?? 0} conformes` },
          { label: 'Engins', val: stats?.totalEngins, sub: `${stats?.enginsConformes ?? 0} conformes` },
          { label: 'Appareillage', val: stats?.totalAppareils, sub: `${stats?.appareilsDisponibles ?? 0} opérationnels` },
          { label: 'Alertes', val: stats?.alertesTotal, sub: 'actions requises', danger: true },
        ].map(({ label, val, sub, danger }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-1">{label}</p>
            <p className={`text-2xl font-semibold ${danger ? 'text-red-600' : 'text-slate-800'}`}>{val ?? '—'}</p>
            <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Taux conformité */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Collaborateurs', pct: stats?.tauxConformiteCollaborateurs ?? 0, color: 'bg-teal-500' },
          { label: 'Engins', pct: stats?.tauxConformiteEngins ?? 0, color: 'bg-blue-500' },
          { label: 'Appareillage', pct: stats?.tauxDisponibiliteAppareils ?? 0, color: 'bg-amber-500' },
        ].map(({ label, pct, color }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-2">{label}</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
              </div>
              <span className="text-sm font-semibold text-slate-700">{pct}%</span>
            </div>
          </div>
        ))}
      </div>

      {(stats?.habExpirantBientot ?? 0) > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <p className="text-sm text-amber-800">{stats.habExpirantBientot} habilitation(s) expirent dans 30 jours —{' '}
            <Link href="/admin/habilitations" className="underline">Voir →</Link>
          </p>
        </div>
      )}

      {/* Collaborateurs */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-3 md:items-center">
          <h2 className="font-medium text-slate-800 flex-1">👷 Collaborateurs ({colFiltres.length})</h2>
          <div className="flex gap-2 flex-wrap">
            <input value={colSearch} onChange={e => setColSearch(e.target.value)} placeholder="Rechercher..."
              className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 w-36 focus:outline-none" />
            <FilterBtn active={colFilter==='tous'} onClick={() => setColFilter('tous')}>Tous</FilterBtn>
            <FilterBtn active={colFilter==='conforme'} onClick={() => setColFilter('conforme')}>Conformes</FilterBtn>
            <FilterBtn active={colFilter==='non_conforme'} onClick={() => setColFilter('non_conforme')}>Non conf.</FilterBtn>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr><th className="text-left px-4 py-3">Collaborateur</th><th className="text-left px-4 py-3">Rôle / Entreprise</th><th className="text-left px-4 py-3">Habilitations</th><th className="text-left px-4 py-3">Statut</th><th className="text-left px-4 py-3">Alerte</th></tr>
            </thead>
            <tbody>
              {colFiltres.length === 0 ? <tr><td colSpan={5} className="text-center py-8 text-slate-400">Aucun résultat</td></tr>
                : colFiltres.map(c => {
                  const habs = c.habilitations ?? [];
                  const valides = habs.filter((h: any) => h.statut === 'VALIDE').length;
                  const hasExpire = habs.some((h: any) => h.statut === 'EXPIRE');
                  const bientot = habs.filter((h: any) => h.statut==='VALIDE' && daysLeft(h.dateExpiration)<=30 && daysLeft(h.dateExpiration)>0).length;
                  return (
                    <tr key={c.id} className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-800">{c.prenom?.[0]}{c.nom?.[0]}</div><span className="font-medium">{c.prenom} {c.nom}</span></div></td>
                      <td className="px-4 py-3 text-slate-500 text-xs"><p>{c.role || '—'}</p><p className="text-slate-400">{c.entreprise || ''}</p></td>
                      <td className="px-4 py-3 text-slate-500">{valides}/{habs.length}</td>
                      <td className="px-4 py-3"><Badge statut={hasExpire ? 'EXPIRE' : 'VALIDE'} /></td>
                      <td className="px-4 py-3">{bientot > 0 ? <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">{bientot} bientôt</span> : <span className="text-slate-300">—</span>}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Engins */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-3 md:items-center">
          <h2 className="font-medium text-slate-800 flex-1">🏗️ Engins ({engFiltres.length})</h2>
          <div className="flex gap-2 flex-wrap">
            <input value={engSearch} onChange={e => setEngSearch(e.target.value)} placeholder="Rechercher..."
              className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 w-36 focus:outline-none" />
            <FilterBtn active={engFilter==='tous'} onClick={() => setEngFilter('tous')}>Tous</FilterBtn>
            <FilterBtn active={engFilter==='CONFORME'} onClick={() => setEngFilter('CONFORME')}>Conformes</FilterBtn>
            <FilterBtn active={engFilter==='NON_CONFORME'} onClick={() => setEngFilter('NON_CONFORME')}>Non conf.</FilterBtn>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr><th className="text-left px-4 py-3">Engin</th><th className="text-left px-4 py-3">Lieu affectation</th><th className="text-left px-4 py-3">Proch. visite tech.</th><th className="text-left px-4 py-3">Exp. VGP</th><th className="text-left px-4 py-3">Statut</th></tr>
            </thead>
            <tbody>
              {engFiltres.length === 0 ? <tr><td colSpan={5} className="text-center py-8 text-slate-400">Aucun résultat</td></tr>
                : engFiltres.map(e => {
                  const jVisite = e.prochainVisiteTechnique ? daysLeft(e.prochainVisiteTechnique) : null;
                  const jVGP = e.dateExpirationVGP ? daysLeft(e.dateExpirationVGP) : null;
                  const D = (j: number|null, d: string) => j===null ? <span className="text-slate-300">—</span> : j<0 ? <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">Expiré</span> : j<=30 ? <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">J-{j}</span> : <span className="text-slate-500 text-xs">{fmt(d)}</span>;
                  return (
                    <tr key={e.id} className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3"><p className="font-medium">{e.type}</p><p className="text-xs text-slate-400">{e.marque} {e.modele} · {e.immatriculation}</p></td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{e.lieuAffectation || '—'}</td>
                      <td className="px-4 py-3">{D(jVisite, e.prochainVisiteTechnique)}</td>
                      <td className="px-4 py-3">{D(jVGP, e.dateExpirationVGP)}</td>
                      <td className="px-4 py-3"><Badge statut={e.statut} /></td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Appareillage */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-3 md:items-center">
          <h2 className="font-medium text-slate-800 flex-1">🔧 Appareillage ({appFiltres.length})</h2>
          <div className="flex gap-2 flex-wrap">
            <input value={appSearch} onChange={e => setAppSearch(e.target.value)} placeholder="Rechercher..."
              className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 w-36 focus:outline-none" />
            <FilterBtn active={appFilter==='tous'} onClick={() => setAppFilter('tous')}>Tous</FilterBtn>
            <FilterBtn active={appFilter==='ok'} onClick={() => setAppFilter('ok')}>Disponibles</FilterBtn>
            <FilterBtn active={appFilter==='nok'} onClick={() => setAppFilter('nok')}>Indisponibles</FilterBtn>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr><th className="text-left px-4 py-3">Appareil</th><th className="text-left px-4 py-3">Référence</th><th className="text-left px-4 py-3">Type</th><th className="text-left px-4 py-3">Localisation</th><th className="text-left px-4 py-3">Statut</th></tr>
            </thead>
            <tbody>
              {appFiltres.length === 0 ? <tr><td colSpan={5} className="text-center py-8 text-slate-400">Aucun résultat</td></tr>
                : appFiltres.map(a => (
                  <tr key={a.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium">{a.nom}</td>
                    <td className="px-4 py-3 font-mono text-xs">{a.reference}</td>
                    <td className="px-4 py-3 text-slate-500">{a.type}</td>
                    <td className="px-4 py-3 text-slate-500">{a.localisation || '—'}</td>
                    <td className="px-4 py-3"><Badge statut={a.statut} /></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
