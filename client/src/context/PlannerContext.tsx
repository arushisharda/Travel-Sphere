import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { api, extractError } from '../lib/api';
import { toast } from '../components/ui/Toast';

export type PlannerDraft = {
  draft: any;
  meta: any;
  city: string;
  country: string;
  durationDays: number;
  interests: string[];
};

type PlannerState = {
  draft: PlannerDraft | null;
  isGenerating: boolean;
  error: string | null;
  generate: (payload: any) => void;
  clearDraft: () => void;
};

const PlannerContext = createContext<PlannerState | null>(null);

const STORAGE_KEY = 'ts_planner_draft';

export function PlannerProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<PlannerDraft | null>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Keep a ref to the current controller so we can abort on demand
  const controllerRef = useRef<AbortController | null>(null);

  // Persist draft to sessionStorage whenever it changes
  useEffect(() => {
    if (draft) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(draft)); } catch {}
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [draft]);

  const generate = useCallback(async (payload: any) => {
    // Cancel any in-flight request
    if (controllerRef.current) controllerRef.current.abort();
    controllerRef.current = new AbortController();

    setIsGenerating(true);
    setError(null);
    setDraft(null);

    try {
      const res = await api.post('/itinerary/draft', payload, {
        signal: controllerRef.current.signal,
        timeout: 100000,
      });
      const newDraft = {
        draft: res.data.draft ?? res.data,
        meta: res.data.meta ?? null,
        city: payload.city ?? '',
        country: payload.country ?? '',
        durationDays: payload.durationDays ?? 3,
        interests: payload.interests ?? [],
      };
      setDraft(newDraft);
      toast(`🎉 Itinerary for ${payload.city || 'destination'} is ready!`, 'success');
    } catch (err: any) {
      // Don't set error if aborted intentionally
      if (err?.code === 'ERR_CANCELED' || err?.name === 'AbortError' || err?.name === 'CanceledError') return;
      const msg = extractError(err);
      setError(msg);
      toast(`Itinerary draft failed: ${msg}`, 'error');
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const clearDraft = useCallback(() => {
    setDraft(null);
    setError(null);
  }, []);

  return (
    <PlannerContext.Provider value={{ draft, isGenerating, error, generate, clearDraft }}>
      {children}
    </PlannerContext.Provider>
  );
}

export function usePlanner() {
  const ctx = useContext(PlannerContext);
  if (!ctx) throw new Error('usePlanner must be used inside PlannerProvider');
  return ctx;
}
