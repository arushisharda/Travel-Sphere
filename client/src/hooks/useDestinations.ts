import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export type Destination = {
  id: string;
  slug: string;
  name: string;
  country: string;
  region: string;
  latitude: number;
  longitude: number;
  summary?: string;
  imageUrl?: string;
  imageThumbUrl?: string;
  currencyCode?: string;
  bestSeason?: string;
  budgetLevel?: number;
  climateType?: string;
  travelStyles?: string[];
  cultureEntries?: CultureEntry[];
};

export type CultureEntry = {
  id: string;
  topic: string;
  title: string;
  body: string;
  source?: string;
};

/** List destinations — shape: { items, page, limit, total } */
export function useDestinations(params?: {
  q?: string; region?: string; climate?: string; budget?: string;
  page?: number; limit?: number;
}) {
  return useQuery<{ items: Destination[]; total: number; page: number; limit: number }>({
    queryKey: ['destinations', params],
    queryFn: async () => {
      const res = await api.get('/destinations', { params });
      return res.data; // { items, page, limit, total }
    },
    staleTime: 1000 * 60 * 60 * 24,
  });
}

/** Single destination — shape: flat Destination object at root */
export function useDestination(slug: string) {
  return useQuery<Destination>({
    queryKey: ['destination', slug],
    queryFn: async () => {
      const res = await api.get(`/destinations/${slug}`);
      return res.data; // flat object
    },
    staleTime: 1000 * 60 * 60 * 24,
    enabled: !!slug,
  });
}

/** Map destinations */
export function useMapDestinations() {
  return useQuery<Destination[]>({
    queryKey: ['destinations', 'map'],
    queryFn: async () => {
      const res = await api.get('/destinations/map');
      return res.data.data ?? res.data;
    },
    staleTime: 1000 * 60 * 60 * 24,
  });
}

/** Wishlist — returns flat destination objects with entryId */
export function useWishlist() {
  const qc = useQueryClient();
  const query = useQuery<(Destination & { entryId: string; note?: string })[]>({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const res = await api.get('/wishlist');
      // Server returns flat destination objects with entryId
      return Array.isArray(res.data) ? res.data : (res.data.data ?? []);
    },
  });

  const add = useMutation({
    // POST /wishlist/:slug — slug in URL
    mutationFn: (destinationSlug: string) => api.post(`/wishlist/${destinationSlug}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wishlist'] }),
  });

  const remove = useMutation({
    mutationFn: (destinationSlug: string) => api.delete(`/wishlist/${destinationSlug}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wishlist'] }),
  });

  return { ...query, add, remove };
}

/** Passport stamp */
export type PassportStamp = {
  id: string;
  destinationId: string | null;
  stampLabel: string;
  visitedAt: string; // mapped from stampedOn
  note?: string | null;
  destination?: { slug: string; name: string; country: string } | null;
};

export function usePassport() {
  const qc = useQueryClient();
  const query = useQuery<PassportStamp[]>({
    queryKey: ['passport'],
    queryFn: async () => {
      const res = await api.get('/passport');
      return Array.isArray(res.data) ? res.data : (res.data.data ?? []);
    },
  });

  const addStamp = useMutation({
    mutationFn: ({
      destinationId,
      destinationSlug,
      visitedAt,
      notes,
      stampLabel,
    }: {
      destinationId?: string;
      destinationSlug?: string;
      visitedAt?: string;
      notes?: string;
      stampLabel?: string;
    }) =>
      api.post('/passport', { destinationId, destinationSlug, visitedAt, notes, stampLabel }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['passport'] }),
  });

  const removeStamp = useMutation({
    mutationFn: (id: string) => api.delete(`/passport/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['passport'] }),
  });

  return { ...query, addStamp, removeStamp };
}

/** Trips */
export function useTrips() {
  const qc = useQueryClient();
  const query = useQuery<any[]>({
    queryKey: ['trips'],
    queryFn: async () => {
      const res = await api.get('/trips');
      // Returns flat array
      return Array.isArray(res.data) ? res.data : (res.data.data ?? res.data);
    },
  });

  const createTrip = useMutation({
    mutationFn: (data: any) => api.post('/trips', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trips'] }),
  });

  const updateTrip = useMutation({
    mutationFn: ({ id, ...data }: any) => api.patch(`/trips/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trips'] }),
  });

  const deleteTrip = useMutation({
    mutationFn: (id: string) => api.delete(`/trips/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trips'] }),
  });

  return { ...query, createTrip, updateTrip, deleteTrip };
}

export function useTrip(id: string) {
  return useQuery<any>({
    queryKey: ['trip', id],
    queryFn: async () => {
      const res = await api.get(`/trips/${id}`);
      return res.data.data ?? res.data;
    },
    enabled: !!id,
  });
}

/** Preferences */
export function usePreferences() {
  const qc = useQueryClient();
  const query = useQuery<any>({
    queryKey: ['preferences'],
    queryFn: async () => {
      const res = await api.get('/dna/preferences');
      return res.data ?? null;
    },
  });

  const update = useMutation({
    mutationFn: (data: any) => api.put('/dna/preferences', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['preferences'] }),
  });

  return { ...query, update };
}

/** Suggestions — backend returns { destination, score, reasons }[] */
export function useSuggestions() {
  return useQuery<Destination[]>({
    queryKey: ['suggestions'],
    queryFn: async () => {
      const res = await api.get('/dna/suggestions');
      const raw: any[] = Array.isArray(res.data) ? res.data : (res.data.data ?? []);
      // Unwrap { destination, score, reasons } wrapper
      return raw.map((item) => item.destination ?? item);
    },
  });
}
