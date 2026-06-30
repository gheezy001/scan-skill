
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function uploadFile(
  file: File,
  folder: string,
): Promise<string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_URL}/api/upload/${folder}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Erreur upload');
  }

  const data = await res.json();
  return data.url;
}
