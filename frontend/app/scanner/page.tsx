'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import jsQR from 'jsqr';

export default function ScannerPage() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream|null>(null);
  const rafRef = useRef<number|null>(null);

  useEffect(() => () => { stopCamera(); }, []);

  useEffect(() => {
    if (!isScanning) return;
    const scan = () => {
      const video = videoRef.current;
      if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0);
          const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(img.data, img.width, img.height, { inversionAttempts: 'dontInvert' });
          if (code) {
            stopCamera();
            let uuid = code.data;
            if (uuid.includes('/verify/')) uuid = uuid.split('/verify/')[1];
            router.push(`/verify/${uuid}`);
            return;
          }
        }
      }
      rafRef.current = requestAnimationFrame(scan);
    };
    rafRef.current = requestAnimationFrame(scan);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [isScanning, router]);

  const startCamera = async () => {
    try {
      setError(null);
      setIsScanning(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play().catch(console.error); }
    } catch { setError("Impossible d'accéder à la caméra. Vérifiez les permissions."); setIsScanning(false); }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setIsScanning(false);
  };

  const handleManual = () => {
    const uuid = prompt("Entrez l'UUID de l'entité :");
    if (uuid) router.push(`/verify/${uuid}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1D253C] to-[#0F1419] flex flex-col items-center justify-center px-4 pb-20">
      {isScanning && (
        <div className="fixed inset-0 z-50 bg-black">
          <button onClick={stopCamera} className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/10 border border-white/20">
            <span className="text-white text-xl">✕</span>
          </button>
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 border-2 border-white/30 rounded-3xl relative">
              <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-[#22C55E] rounded-tl-3xl -mt-0.5 -ml-0.5" />
              <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-[#22C55E] rounded-tr-3xl -mt-0.5 -mr-0.5" />
              <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-[#22C55E] rounded-bl-3xl -mb-0.5 -ml-0.5" />
              <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-[#22C55E] rounded-br-3xl -mb-0.5 -mr-0.5" />
            </div>
          </div>
          <div className="absolute bottom-8 w-full text-center">
            <p className="text-white text-base font-medium mb-4">Pointez sur le QR code</p>
            <button onClick={handleManual} className="px-5 py-2.5 bg-white/10 border border-white/20 rounded-full text-white text-sm">
              Saisir manuellement
            </button>
          </div>
        </div>
      )}

      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-[#D50032]/20 border-4 border-[#D50032]/30 rounded-3xl flex items-center justify-center mx-auto mb-5">
          <span className="text-4xl">📷</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">SCAN SKILL</h1>
        <p className="text-white/60 font-medium">Contrôle de conformité HSE</p>
      </div>

      {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm max-w-xs text-center">{error}</div>}

      <button onClick={startCamera}
        className="w-56 h-56 rounded-full bg-[#D50032] hover:bg-[#B5002A] shadow-2xl shadow-[#D50032]/30 transition-all hover:scale-105 active:scale-95 flex flex-col items-center justify-center">
        <span className="text-5xl mb-2">📷</span>
        <span className="text-white font-bold text-xl">SCANNER</span>
      </button>

      <div className="mt-10 grid grid-cols-1 gap-4 max-w-xs w-full">
        {[
          { emoji: '✅', title: 'Vérification rapide', desc: 'Résultat en moins de 2 secondes' },
          { emoji: '🛡️', title: 'Habilitations', desc: 'Validité en temps réel' },
          { emoji: '🤖', title: 'Analyse IA', desc: 'Verdict clair et actionnable' },
        ].map(({ emoji, title, desc }) => (
          <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-2xl">{emoji}</span>
            <div><p className="text-white font-medium text-sm">{title}</p><p className="text-white/50 text-xs">{desc}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}
