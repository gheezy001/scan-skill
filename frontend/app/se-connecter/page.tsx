'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      router.replace('/admin/dashboard');
    } catch {
      setError('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1D253C] to-[#0F1419] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#D50032]/20 border-2 border-[#D50032]/30 mb-4">
            <span className="text-3xl">📡</span>
          </div>
          <h1 className="text-3xl font-bold text-white">SCAN SKILL</h1>
          <p className="text-white/50 mt-1 text-sm">Conformité HSE</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}
          <div>
            <label className="block text-white/70 text-sm mb-1.5">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D50032]/60"
              placeholder="admin@scanskill.com" required />
          </div>
          <div>
            <label className="block text-white/70 text-sm mb-1.5">Mot de passe</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D50032]/60"
              placeholder="••••••••" required />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-[#D50032] hover:bg-[#B5002A] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50">
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
