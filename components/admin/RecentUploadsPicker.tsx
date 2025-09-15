"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function RecentUploadsPicker({ onSelect, className = "", days = 30, limit = 24 }: { onSelect: (url: string, key?: string) => void; className?: string; days?: number; limit?: number }) {
  const [items, setItems] = useState<Array<{ key: string; url: string; name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!show) return;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/uploads/list?days=${days}&limit=${limit}`);
        const j = await res.json();
        if (!res.ok) throw new Error(j?.error || "Failed to load uploads");
        setItems(j.items || []);
      } catch (e: any) {
        setError(e?.message || "Failed to load uploads");
      } finally {
        setLoading(false);
      }
    })();
  }, [show, days, limit]);

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setShow((s) => !s)}>
          {show ? "Hide recent uploads" : "Show recent uploads"}
        </Button>
        {loading && <span className="text-xs text-gray-500">Loading...</span>}
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
      {show && (
        <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {items.map((it) => (
            <button
              key={it.key}
              className="border rounded-md overflow-hidden hover:ring-2 hover:ring-brand-400"
              onClick={() => onSelect(it.url, it.key)}
              title={it.name}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.url} alt={it.name} className="w-full h-20 object-cover" />
            </button>
          ))}
          {items.length === 0 && !loading && (
            <div className="col-span-full text-sm text-gray-500">No uploads found</div>
          )}
        </div>
      )}
    </div>
  );
}
