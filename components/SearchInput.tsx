"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

type SearchItem = {
  id: string;
  docType: "article" | "quiz" | string;
  slug: string;
  title: string;
  excerpt?: string;
  imageUrl?: string;
};

export default function SearchInput({ className = "", docType }: { className?: string; docType?: 'article' | 'quiz' }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const router = useRouter();
  const abortRef = useRef<AbortController | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const debouncedQ = useDebounce(q, 150);

  useEffect(() => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    const run = async () => {
      const qs = debouncedQ.trim();
      if (!qs) {
        setResults([]);
        setOpen(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(qs)}&limit=8${docType ? `&type=${docType}` : ''}`, {
          method: "GET",
          signal: controller.signal,
          cache: "no-store",
        });
        if (!res.ok) throw new Error("search failed");
        const json = await res.json();
        setResults(json.items || []);
        setOpen(true);
        setActive(0);
      } catch (e) {
        if ((e as any)?.name !== "AbortError") {
          setResults([]);
          setOpen(false);
        }
      } finally {
        setLoading(false);
      }
    };
    run();

    return () => controller.abort();
  }, [debouncedQ, docType]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function onSelect(item: SearchItem) {
    const href = (docType === 'quiz' || item.docType === "quiz") ? `/quizzes/${item.slug}` : `/blog/${item.slug}`;
    setOpen(false);
    setQ("");
    router.push(href);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      onSelect(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={boxRef} className={`relative ${className}`}>
      <div className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/30">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => { if (results.length) setOpen(true); }}
          onKeyDown={onKeyDown}
          placeholder="Search..."
          className="w-full outline-none text-sm placeholder:text-muted-foreground"
        />
      </div>

      {open && results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border bg-white shadow-xl">
          <ul className="max-h-80 overflow-auto divide-y">
            {results.map((item, idx) => (
              <li
                key={item.id}
                className={`p-3 cursor-pointer hover:bg-gray-50 ${idx === active ? "bg-gray-50" : ""}`}
                onMouseEnter={() => setActive(idx)}
                onClick={() => onSelect(item)}
              >
                <div className="text-sm font-medium text-foreground flex items-center justify-between">
                  <span className="line-clamp-1">{item.title}</span>
                  <span className="ml-3 text-[10px] uppercase tracking-wider rounded-full bg-gray-100 px-2 py-0.5 text-gray-600">
                    {item.docType === "quiz" ? "Quiz" : "Article"}
                  </span>
                </div>
                {item.excerpt && (
                  <div className="text-xs text-muted-foreground line-clamp-2 mt-1">{item.excerpt}</div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}
