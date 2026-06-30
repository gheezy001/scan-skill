'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem('token');
    router.replace(token ? '/admin/dashboard' : '/se-connecter');
  }, [router]);
  return (
    <div className="min-h-screen bg-[#1D253C] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  );
}
