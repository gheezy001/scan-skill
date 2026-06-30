'use client';
import { useState, useRef } from 'react';
import { uploadFile } from '@/lib/upload';

interface FileUploadProps {
  folder: string;
  accept?: string;
  label?: string;
  currentUrl?: string;
  onUpload: (url: string) => void;
}

export default function FileUpload({ folder, accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png', label = 'Ajouter un document', currentUrl, onUpload }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const url = await uploadFile(file, folder);
      onUpload(url);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {currentUrl && (
        <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg">
          <span className="text-green-600 text-sm">📎</span>
          <a href={currentUrl} target="_blank" rel="noopener noreferrer"
            className="text-sm text-green-700 hover:underline truncate flex-1">
            Document enregistré — Cliquer pour voir
          </a>
        </div>
      )}
      <label className={`flex items-center gap-2 px-3 py-2 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${uploading ? 'border-slate-200 bg-slate-50' : 'border-slate-300 hover:border-[#D50032] hover:bg-red-50'}`}>
        <span className="text-lg">{uploading ? '⏳' : '📤'}</span>
        <span className="text-sm text-slate-600">{uploading ? 'Upload en cours...' : label}</span>
        <input ref={inputRef} type="file" accept={accept} onChange={handleFile} className="hidden" disabled={uploading} />
      </label>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
