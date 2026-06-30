'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { verifyApi } from '@/lib/api';

const fmt = (d: string) => new Date(d).toLocaleDateString('fr-FR');

export default function VerifyPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.uuid as string;
  const [result, setResult] = useState<any>(null);
  const [aiAnalyse, setAiAnalyse] = useState<string|null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await verifyApi.check(code);
        setResult(res.data);
        setAiLoading(true);
        verifyApi.analyze(res.data.type, res.data.entity)
          .then(r => setAiAnalyse(r.data.analyse))
          .catch(() => {})
          .finally(() => setAiLoading(false));
      } catch { setNotFound(true); }
      finally { setLoading(false); }
    };
    run();
  }, [code]);

  if (loading) return (
    <div className="min-h-screen bg-[#1D253C] flex items-center justify-center">
      <div className="w-14 h-14 border-4 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  );

  if (notFound || !result) return (
    <div className="min-h-screen bg-red-500 flex flex-col items-center justify-center px-4">
      <span className="text-6xl mb-4">❌</span>
      <h1 className="text-3xl font-bold text-white mb-2">QR Code invalide</h1>
      <button onClick={() => router.push('/scanner')} className="mt-8 px-6 py-3 bg-white text-red-600 font-bold rounded-xl">Retour au scanner</button>
    </div>
  );

  const { type, conforme, entity } = result;
  const isCollaborateur = type === 'collaborateur' || type === 'ouvrier';
  const isEngin = type === 'engin';
  const bgColor = conforme ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className={`min-h-screen ${bgColor} flex flex-col`}>
      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-8">
        <button onClick={() => router.push('/scanner')} className="mb-6 flex items-center gap-2 text-white/80 hover:text-white">
          <span>←</span><span className="font-medium">Retour</span>
        </button>

        <div className="text-center mb-6">
          <div className="text-6xl mb-2">{conforme ? '✅' : '🚨'}</div>
          <p className="text-white font-bold text-xl">{conforme ? 'CONFORME' : 'NON CONFORME'}</p>
        </div>

        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6">
            {isCollaborateur && (
              <>
                <h2 className="text-2xl font-black text-slate-800">{entity.prenom} {entity.nom}</h2>
                <div className="flex gap-2 mt-1 flex-wrap">
                  {entity.role && <span className="text-xs font-bold uppercase tracking-wide bg-slate-100 text-slate-600 px-3 py-1 rounded-full">{entity.role}</span>}
                  {entity.entreprise && <span className="text-xs font-bold uppercase tracking-wide bg-blue-100 text-blue-600 px-3 py-1 rounded-full">{entity.entreprise}</span>}
                </div>
                {entity.telephone && <p className="mt-2 text-sm text-slate-500">📱 {entity.telephone}</p>}

                <div className="mt-5">
                  <h3 className="text-sm font-bold text-slate-700 mb-3">🛡️ Habilitations</h3>
                  {entity.habilitations?.length > 0 ? (
                    <div className="space-y-2">
                      {entity.habilitations.map((h: any) => (
                        <div key={h.id} className={`p-3 rounded-xl border ${h.statut==='VALIDE'?'bg-green-50 border-green-200':'bg-red-50 border-red-200'}`}>
                          <div className="flex justify-between items-center">
                            <p className="font-semibold text-sm text-slate-800">{h.nom}</p>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${h.statut==='VALIDE'?'bg-green-200 text-green-800':'bg-red-200 text-red-800'}`}>{h.statut}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">Expire le {fmt(h.dateExpiration)}</p>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-slate-400 text-sm italic">Aucune habilitation enregistrée</p>}
                </div>
              </>
            )}

            {isEngin && (
              <>
                <h2 className="text-2xl font-black text-slate-800 uppercase">{entity.type}</h2>
                <p className="text-slate-500 font-medium">{entity.marque} {entity.modele}</p>
                <div className="mt-3 inline-block bg-slate-100 px-4 py-2 rounded-xl">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Immatriculation</p>
                  <p className="font-black text-slate-800 text-lg">{entity.immatriculation}</p>
                </div>
                <div className="mt-4 space-y-2">
                  {[
                    { label: 'Lieu d\'affectation', val: entity.lieuAffectation },
                    { label: 'VGP Fourni', val: entity.vgpFournit },
                    { label: 'Dernière visite tech.', val: entity.dernierVisiteTechnique ? fmt(entity.dernierVisiteTechnique) : '—' },
                    { label: 'Prochaine visite tech.', val: entity.prochainVisiteTechnique ? fmt(entity.prochainVisiteTechnique) : '—' },
                    { label: 'Expiration VGP', val: entity.dateExpirationVGP ? fmt(entity.dateExpirationVGP) : '—' },
                    { label: 'Exp. Assurance', val: entity.dateExpirationAssurance ? fmt(entity.dateExpirationAssurance) : '—' },
                  ].map(({ label, val }) => (
                    <div key={label} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                      <span className="text-xs font-bold text-slate-500 uppercase">{label}</span>
                      <span className="font-semibold text-slate-800">{val || '—'}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {!isCollaborateur && !isEngin && (
              <>
                <h2 className="text-2xl font-black text-slate-800">{entity.nom}</h2>
                <p className="text-slate-500">{entity.type}</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between bg-slate-50 p-3 rounded-xl"><span className="text-xs font-bold text-slate-500 uppercase">Référence</span><span className="font-mono font-semibold">{entity.reference}</span></div>
                  <div className="flex justify-between bg-slate-50 p-3 rounded-xl"><span className="text-xs font-bold text-slate-500 uppercase">Localisation</span><span className="font-semibold">{entity.localisation || '—'}</span></div>
                </div>
              </>
            )}

            {/* Bloc IA */}
            <div className="mt-5 bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🤖</span>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Analyse IA</p>
              </div>
              {aiLoading
                ? <div className="flex items-center gap-2 text-slate-400 text-sm"><div className="w-3 h-3 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />Analyse en cours...</div>
                : aiAnalyse
                ? <p className="text-slate-700 text-sm leading-relaxed">{aiAnalyse}</p>
                : <p className="text-slate-400 text-sm italic">Non disponible</p>}
            </div>
          </div>
        </div>

        <button onClick={() => router.push('/scanner')}
          className="w-full mt-6 py-4 bg-white text-slate-800 font-bold rounded-2xl hover:bg-white/90 transition-colors">
          📷 Nouveau scan
        </button>
      </div>
    </div>
  );
}
