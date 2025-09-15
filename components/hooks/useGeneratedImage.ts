"use client";

import { useEffect, useMemo, useState } from "react";

function hashKey(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return `genimg_${h >>> 0}`;
}

export function useGeneratedImage(prompt: string, aspectRatio: string = "16:9") {
  const enabled = process.env.NEXT_PUBLIC_USE_GEN_IMAGES === "true";
  const key = useMemo(() => hashKey(`${prompt}|${aspectRatio}`), [prompt, aspectRatio]);
  const [src, setSrc] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  useEffect(() => {
    if (!enabled) return;
    try {
      const cached = sessionStorage.getItem(key);
      if (cached) {
        setSrc(cached);
        setStatus("done");
        return;
      }
    } catch {}

    let aborted = false;
    (async () => {
      try {
        setStatus("loading");
        const resp = await fetch("/api/images/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, aspectRatio }),
        });
        if (!resp.ok) throw new Error(`status ${resp.status}`);
        const data = await resp.json();
        if (!aborted && data?.dataUrl) {
          setSrc(data.dataUrl);
          setStatus("done");
          try { sessionStorage.setItem(key, data.dataUrl); } catch {}
        } else if (!aborted) {
          setStatus("error");
        }
      } catch {
        if (!aborted) setStatus("error");
      }
    })();
    return () => { aborted = true; };
  }, [enabled, key, prompt, aspectRatio]);

  return { src, status, enabled } as const;
}

export default useGeneratedImage;
