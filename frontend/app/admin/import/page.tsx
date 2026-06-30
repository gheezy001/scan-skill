'use client';
import { useState } from 'react';
import { importApi } from '@/lib/api';

export default function ImportPage() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<'ouvriers'|'habilitations'|'engins'>('ouvriers');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setResults(null);
    const text = await file.text();
    try {
      const res = type === 'ouvriers' ? await importApi.ouvriers(text)
        : type === 'habilitations' ? await importApi.habilitations(text)
        : await importApi.engins(text);
      setResults(res.data);
    } catch { setResults({ error: 'Erreur lors de l\'import' }); }
    finally { setLoading(false); e.target.value = ''; }
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl">
      <h1 className="text-xl font-semibold text-slate-800 mb-6">📥 Import CSV</h1>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">Type de données</label>
          <div className="flex gap-2">
            {[['ouvriers','👷 Ouvriers'],['habilitations','🛡️ Habilitations'],['engins','🏗️ Engins']].map(([val,label]) => (
              <button key={val} onClick={() => setType(val as any)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${type===val?'bg-slate-800 text-white border-slate-800':'border-slate-200 text-slate-600 hover:border-slate-400'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">Fichier CSV</label>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-slate-400 hover:bg-slate-50 transition-colors">
            <span className="text-3xl mb-2">📎</span>
            <span className="text-sm text-slate-500">{loading ? 'Import en cours...' : 'Cliquez pour choisir un fichier CSV'}</span>
            <input type="file" accept=".csv" onChange={handleFile} className="hidden" disabled={loading} />
          </label>
        </div>

        {results && (
          <div className={`rounded-xl p-4 ${results.error ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
            {results.error ? (
              <p className="text-red-700 text-sm">{results.error}</p>
            ) : (
              <div className="space-y-1">
                <p className="text-green-700 font-medium text-sm">✅ Import terminé</p>
                <p className="text-green-600 text-sm">{results.success} ligne(s) importée(s)</p>
                {results.skippedExisting > 0 && <p className="text-slate-500 text-sm">{results.skippedExisting} déjà existant(s)</p>}
                {results.skippedNotFound > 0 && <p className="text-slate-500 text-sm">{results.skippedNotFound} ouvrier(s) non trouvé(s)</p>}
                {results.errors?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-red-600 text-xs font-medium">{results.errors.length} erreur(s) :</p>
                    {results.errors.slice(0,5).map((e: string, i: number) => <p key={i} className="text-red-500 text-xs">• {e}</p>)}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Templates */}
      <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-5">
        <h3 className="font-medium text-slate-700 mb-3">Formats attendus</h3>
        <div className="space-y-3 text-xs text-slate-500 font-mono">
          <div><p className="font-semibold text-slate-700 mb-1 text-xs not-italic font-sans">Ouvriers</p><p>nom;prenom;email;dateEmbauche;statut</p></div>
          <div><p className="font-semibold text-slate-700 mb-1 text-xs not-italic font-sans">Habilitations</p><p>email;type_habilitation;date_obtention;date_expiration;entreprise</p></div>
          <div><p className="font-semibold text-slate-700 mb-1 text-xs not-italic font-sans">Engins</p><p>type;marque;modele;immatriculation;prochain_controle;date_expiration_assurance</p></div>
        </div>
      </div>
    </div>
  );
}
