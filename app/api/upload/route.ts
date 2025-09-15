import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Storage not configured' }, { status: 500 });
    }

    const bytes = await file.arrayBuffer();
    const blob = new Blob([bytes], { type: file.type });

    // Generate unique key
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const datePrefix = `${y}/${m}/${d}`;
    const random = Math.random().toString(36).slice(2);
    const nameExt = (() => {
      const name = (file as any).name as string | undefined;
      const fromName = name ? name.split('.').pop() : '';
      if (fromName) return fromName.toLowerCase();
      switch (file.type) {
        case 'image/jpeg':
        case 'image/jpg':
          return 'jpg';
        case 'image/png':
          return 'png';
        case 'image/gif':
          return 'gif';
        case 'image/webp':
          return 'webp';
        default:
          return 'bin';
      }
    })();
    const filename = `${Date.now()}-${random}.${nameExt}`;
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'uploads';
    const objectKey = `${datePrefix}/${filename}`;

    // Ensure bucket exists (best-effort)
    try {
      const { data: bucketInfo } = await supabase.storage.getBucket(bucket);
      if (!bucketInfo) {
        await supabase.storage.createBucket(bucket, {
          public: true,
          fileSizeLimit: '5242880',
          allowedMimeTypes: allowedTypes,
        });
      }
    } catch {}

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(objectKey, blob, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: 'Upload failed', details: uploadError.message }, { status: 500 });
    }

    // Try public URL first
    const { data: pub } = supabase.storage.from(bucket).getPublicUrl(objectKey);
    let imageUrl = pub?.publicUrl || '';

    // If bucket is private, fallback to a signed URL
    if (!imageUrl) {
      try {
        const { data: signed } = await supabase.storage.from(bucket).createSignedUrl(objectKey, 60 * 60 * 24 * 7); // 7 days
        if (signed?.signedUrl) imageUrl = signed.signedUrl;
      } catch {}
    }

    return NextResponse.json({ success: true, imageUrl, filename: objectKey });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
