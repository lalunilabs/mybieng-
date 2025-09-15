import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { prompt, aspectRatio = '16:9' } = await req.json();
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_IMAGES_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'Google Images API key not configured. Set GOOGLE_IMAGES_API_KEY (or GEMINI_API_KEY) in your env.',
        },
        { status: 400 }
      );
    }

    // Map simple aspect ratio to Images API enum when possible
    const aspect = aspectRatio === '1:1' ? 'SQUARE' : aspectRatio === '3:2' ? 'ASPECT_3_2' : aspectRatio === '4:3' ? 'ASPECT_4_3' : 'ASPECT_16_9';

    // Call Google AI Images API (Imagen 3) via REST
    const url = `https://generativelanguage.googleapis.com/v1beta/images:generate?key=${apiKey}`;
    const body = {
      model: 'imagen-3.0',
      prompt: { text: prompt },
      imageGenerationConfig: {
        numberOfImages: 1,
        aspectRatio: aspect,
        personGeneration: 'DONT_ALLOW',
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_DANGEROUS', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUAL', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    } as any;

    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const error = await resp.text();
      return NextResponse.json({ error: 'Images API error', detail: error }, { status: 502 });
    }

    const data = await resp.json();
    // The Images API returns base64 images in data.images[n].byteContent
    const b64: string | undefined = data?.images?.[0]?.byteContent;
    if (!b64) {
      return NextResponse.json({ error: 'No image returned' }, { status: 502 });
    }

    const dataUrl = `data:image/png;base64,${b64}`;
    return NextResponse.json({ dataUrl });
  } catch (e: any) {
    return NextResponse.json({ error: 'Server error', detail: String(e?.message || e) }, { status: 500 });
  }
}
