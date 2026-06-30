'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', emoji: '📊' },
  { href: '/admin/ouvriers', label: 'Collaborateurs', emoji: '👷' },
  { href: '/admin/engins', label: 'Engins', emoji: '🏗️' },
  { href: '/admin/appareillage', label: 'Appareillage', emoji: '🔧' },
  { href: '/admin/habilitations', label: 'Habilitations', emoji: '🛡️' },
  { href: '/admin/mode-operatoire', label: 'Mode Opératoire', emoji: '📋' },
  { href: '/admin/import', label: 'Import CSV', emoji: '📥' },
  { href: '/admin/export', label: 'Export', emoji: '📤' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.replace('/se-connecter'); return; }
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, [router]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.replace('/se-connecter');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="hidden md:flex w-56 bg-[#1D253C] flex-col flex-shrink-0 fixed top-0 bottom-0">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#D50032] rounded-lg flex items-center justify-center text-white text-sm">📡</div>
            <div>
              <p className="text-white font-bold text-sm">SCAN SKILL</p>
              <p className="text-white/40 text-xs">Admin</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, label, emoji }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                pathname === href ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}>
              <span>{emoji}</span>{label}
            </Link>
          ))}
          <Link href="/scanner"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-[#D50032] hover:bg-[#D50032]/10 mt-2">
            <span>📷</span>Scanner QR
          </Link>
        </nav>
        <div className="p-3 border-t border-white/10">
          {user && <p className="text-white/50 text-xs px-3 mb-2">{user.firstName} {user.lastName}</p>}
          <button onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/5 transition-colors">
            <span>🚪</span>Déconnexion
          </button>
        </div>
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#1D253C] px-4 py-3 flex items-center justify-between">
        <span className="text-white font-bold text-sm">📡 SCAN SKILL</span>
        <button onClick={() => setOpen(!open)} className="text-white text-xl">{open ? '✕' : '☰'}</button>
      </div>

      {open && (
        <div className="md:hidden fixed inset-0 z-40" onClick={() => setOpen(false)}>
          <div className="absolute left-0 top-0 bottom-0 w-56 bg-[#1D253C] pt-14 p-3 space-y-0.5 overflow-y-auto" onClick={e => e.stopPropagation()}>
            {navItems.map(({ href, label, emoji }) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-medium ${
                  pathname === href ? 'bg-white/10 text-white' : 'text-white/50'
                }`}>
                <span>{emoji}</span>{label}
              </Link>
            ))}
            <Link href="/scanner" onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-medium text-[#D50032]">
              <span>📷</span>Scanner QR
            </Link>
            <button onClick={logout} className="w-full flex items-center gap-2.5 px-3 py-3 text-sm text-white/40">
              <span>🚪</span>Déconnexion
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 md:ml-56 pt-14 md:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}
