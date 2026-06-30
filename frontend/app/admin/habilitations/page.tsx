'use client';
import { useEffect, useState } from 'react';
import { ouvriersApi } from '@/lib/api';

const fmt = (d: string) => d ? new Date(d).toLocaleDateString('fr-FR') : '—';
const daysLeft = (d: string) => Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);

export default function HabilitationsPage() {
  const [habs, setHabs] = useState<any[]>([]);
  const [filter, setFilter] = useState('tous');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ouvriersApi.getAllHabilitations().then(r => { setHabs(r.data); setLoading(false); });
  }, []);

  const filtered = habs.filter(h => {
    if (filter === 'EXPIRE') return h.statut === 'EXPIRE';
    if (filter === 'bientot') { const j = daysLeft(h.dateExpiration); return h.statut === 'VALIDE' && j >= 0 && j <= 30; }
    if (filter === 'VALIDE') return h.statut === 'VALIDE';
    return true;
  });

  const countBientot = habs.filter(h => { const j = daysLeft(h.dateExpiration); return h.statut==='VALIDE' && j>=0 && j<=30; }).length;

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl font-semibold text-slate-800 mb-6">🛡️ Habilitations</h1>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4"><p className="text-xs text-red-600 mb-1">Expirées</p><p className="text-2xl font-semibold text-red-700">{habs.filter(h=>h.statut==='EXPIRE').length}</p></div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4"><p className="text-xs text-yellow-600 mb-1">Dans 30 jours</p><p className="text-2xl font-semibold text-yellow-700">{countBientot}</p></div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4"><p className="text-xs text-green-600 mb-1">Valides</p><p className="text-2xl font-semibold text-green-700">{habs.filter(h=>h.statut==='VALIDE').length}</p></div>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {[['tous','Toutes'],['EXPIRE','Expirées'],['bientot','Bientôt (30j)'],['VALIDE','Valides']].map(([val,label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`text-xs px-3 py-1.5 rounded-full border ${filter===val?'bg-slate-800 text-white border-slate-800':'border-slate-200 text-slate-500 hover:border-slate-400'}`}>
            {label}
          </button>
        ))}
      </div>

      {loading ? <div className="text-center py-12 text-slate-400">Chargement...</div> : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="text-left px-4 py-3">Collaborateur</th>
                <th className="text-left px-4 py-3">Habilitation</th>
                <th className="text-left px-4 py-3">Obtention</th>
                <th className="text-left px-4 py-3">Expiration</th>
                <th className="text-left px-4 py-3">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={5} className="text-center py-8 text-slate-400">Aucune habilitation</td></tr>
                : filtered.map(h => {
                  const j = daysLeft(h.dateExpiration);
                  const isExpire = h.statut === 'EXPIRE';
                  const isBientot = !isExpire && j >= 0 && j <= 30;
                  const collaborateur = h.collaborateur || h.ouvrier;
                  return (
                    <tr key={h.id} className={`border-t border-slate-100 ${isExpire?'bg-red-50':isBientot?'bg-yellow-50':''}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-800">
                            {collaborateur?.prenom?.[0]}{collaborateur?.nom?.[0]}
                          </div>
                          <span>{collaborateur?.prenom} {collaborateur?.nom}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium">{h.nom}</td>
                      <td className="px-4 py-3 text-slate-500">{fmt(h.dateObtention)}</td>
                      <td className="px-4 py-3">
                        <span className={isExpire?'text-red-600 font-medium':isBientot?'text-yellow-700 font-medium':'text-slate-600'}>
                          {fmt(h.dateExpiration)}{isBientot?` (J-${j})`:''}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isExpire?'bg-red-100 text-red-800':isBientot?'bg-yellow-100 text-yellow-800':'bg-green-100 text-green-800'}`}>
                          {isExpire?'EXPIRE':isBientot?'BIENTOT':'VALIDE'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
