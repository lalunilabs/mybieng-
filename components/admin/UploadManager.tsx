'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import RecentUploadsPicker from '@/components/admin/RecentUploadsPicker';

export default function UploadManager() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastKey, setLastKey] = useState<string | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setResultUrl(null);
    setError(null);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const onUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    setResultUrl(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Upload failed');
      }
      setResultUrl(json.imageUrl);
      setLastKey(json.filename || null);
    } catch (e: any) {
      setError(e?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onCopy = async () => {
    if (!resultUrl) return;
    try {
      await navigator.clipboard.writeText(resultUrl);
    } catch {}
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Media Upload</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={onFileChange}
          />

          {preview && (
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="preview" className="w-40 h-24 object-cover rounded border" />
              <div className="text-xs text-gray-500">Preview</div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button onClick={onUpload} disabled={!file || uploading}>
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                if (!lastKey) return;
                try {
                  const res = await fetch(`/api/uploads/sign?key=${encodeURIComponent(lastKey)}&expires=604800`);
                  const j = await res.json();
                  if (!res.ok || !j?.signedUrl) throw new Error(j?.error || 'Failed to sign');
                  setResultUrl(j.signedUrl);
                } catch (e: any) {
                  setError(e?.message || 'Failed to sign');
                }
              }}
              disabled={!lastKey}
            >
              Generate Signed URL (7d)
            </Button>
            {resultUrl && (
              <Button variant="outline" onClick={onCopy}>
                Copy URL
              </Button>
            )}
          </div>

          {resultUrl && (
            <div className="text-sm">
              <div className="text-gray-700 font-medium">Uploaded URL:</div>
              <a href={resultUrl} target="_blank" rel="noreferrer" className="text-purple-700 underline break-all">
                {resultUrl}
              </a>
            </div>
          )}

          {error && <div className="text-sm text-red-600">{error}</div>}

          {/* Recent uploads picker */}
          <div className="pt-2 border-t">
            <RecentUploadsPicker
              onSelect={(url, key) => { setResultUrl(url); setLastKey(key || null); }}
              className=""
              days={30}
              limit={24}
            />
          </div>

          <div className="text-xs text-gray-500 border-t pt-3 mt-3">
            Ensure env is set: <code>SUPABASE_URL</code>, <code>SUPABASE_SERVICE_ROLE_KEY</code>, and <code>SUPABASE_STORAGE_BUCKET</code>.
            Also set <code>IMAGE_REMOTE_HOSTS</code> to your Supabase project host for Next/Image.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
