'use client';
import { useState } from 'react';

export default function ExportPage() {
  const [loading, setLoading] = useState<string|null>(null);
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  const download = async (type: string) => {
    setLoading(type);
    try {
      const res = await fetch(`${API}/api/export/${type}`, { headers: { Authorization: `Bearer ${token}` } });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${type}.csv`; a.click();
      URL.revokeObjectURL(url);
    } finally { setLoading(null); }
  };

  return (
    <div className="p-4 md:p-6 max-w-lg">
      <h1 className="text-xl font-semibold text-slate-800 mb-6">📤 Export CSV</h1>
      <div className="space-y-3">
        {[
          { type:'ouvriers', label:'Ouvriers', desc:'Nom, prénom, email, statut, taux de conformité', emoji:'👷' },
          { type:'habilitations', label:'Habilitations', desc:'Toutes les habilitations avec dates et statuts', emoji:'🛡️' },
          { type:'engins', label:'Engins', desc:'Parc engins avec dates de contrôle et assurance', emoji:'🏗️' },
        ].map(({ type, label, desc, emoji }) => (
          <div key={type} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4">
            <span className="text-3xl">{emoji}</span>
            <div className="flex-1">
              <p className="font-medium text-slate-800">{label}</p>
              <p className="text-xs text-slate-500">{desc}</p>
            </div>
            <button onClick={() => download(type)} disabled={loading === type}
              className="text-sm bg-slate-800 text-white px-4 py-2 rounded-xl hover:bg-slate-700 disabled:opacity-50 transition-colors">
              {loading === type ? '...' : 'Exporter'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
