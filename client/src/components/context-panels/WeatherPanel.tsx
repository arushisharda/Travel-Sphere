import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { fmtTemp } from '../../lib/format';
import { getWeatherCondition } from '../../lib/weatherCodes';
import { Spinner } from '../ui/Spinner';

type WeatherDay = {
  date: string;
  min: number;
  max: number;
  precipChance: number | null;
  weatherCode: number;
  condition: string;
};

type CurrentWeather = {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  condition: string;
};

type WeatherData = {
  destination: string;
  current: CurrentWeather;
  daily: WeatherDay[];
  retrievedAt: string;
};

export function WeatherPanel({ destinationSlug }: { destinationSlug: string }) {
  const [unit, setUnit] = useState<'C' | 'F'>('C');

  const { data, isLoading, isError } = useQuery<WeatherData>({
    queryKey: ['weather', destinationSlug],
    queryFn: async () => {
      const res = await api.get('/weather', { params: { destination: destinationSlug } });
      return res.data;
    },
    staleTime: 1000 * 60 * 10,
  });

  if (isLoading) {
    return (
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-paper)] p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-4">Weather</h3>
        <div className="flex justify-center py-6"><Spinner /></div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-paper)] p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-2">Weather</h3>
        <p className="text-sm text-[var(--color-muted)]">Forecast unavailable — check your connection.</p>
      </div>
    );
  }

  const ageMin = data.retrievedAt
    ? Math.round((Date.now() - new Date(data.retrievedAt).getTime()) / 60000)
    : null;

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-paper)] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)]">Weather</h3>
        <div className="flex items-center gap-2">
          {ageMin !== null && (
            <span className="text-xs text-[var(--color-muted)]">
              {ageMin === 0 ? 'just now' : `${ageMin}m ago`}
            </span>
          )}
          <div className="flex rounded-full border border-[var(--color-border)] overflow-hidden">
            <button
              onClick={() => setUnit('C')}
              className={`text-xs px-2.5 py-0.5 transition-colors ${unit === 'C' ? 'bg-[var(--color-ink)] text-[var(--color-paper)]' : 'text-[var(--color-muted)]'}`}
            >
              °C
            </button>
            <button
              onClick={() => setUnit('F')}
              className={`text-xs px-2.5 py-0.5 transition-colors ${unit === 'F' ? 'bg-[var(--color-ink)] text-[var(--color-paper)]' : 'text-[var(--color-muted)]'}`}
            >
              °F
            </button>
          </div>
        </div>
      </div>

      {/* Current conditions */}
      <div className="mb-4 pb-4 border-b border-[var(--color-border)] flex items-center gap-4">
        <div>
          <p className="text-3xl font-light text-[var(--color-ink)]">{fmtTemp(data.current.temperature, unit)}</p>
          <p className="text-sm text-[var(--color-muted)]">{data.current.condition}</p>
        </div>
        <div className="ml-auto text-right text-xs text-[var(--color-muted)] space-y-0.5">
          <p>Humidity {data.current.humidity}%</p>
          <p>Wind {data.current.windSpeed} km/h</p>
        </div>
      </div>

      {/* 7-day forecast */}
      <div className="space-y-1.5">
        {data.daily.slice(0, 7).map((day) => {
          const d = new Date(day.date);
          const isToday = day === data.daily[0];
          return (
            <div key={day.date} className="flex items-center gap-3 py-1">
              <span className="w-16 text-xs text-[var(--color-muted)] flex-shrink-0">
                {isToday ? 'Today' : d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
              <span className="flex-1 text-xs text-[var(--color-muted)] truncate">{day.condition}</span>
              {day.precipChance !== null && day.precipChance > 0 && (
                <span className="text-xs text-blue-500 w-8 text-right">{day.precipChance}%</span>
              )}
              <span className="text-xs font-medium text-[var(--color-ink)] w-28 text-right flex-shrink-0">
                {fmtTemp(day.max, unit)} / {fmtTemp(day.min, unit)}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-[var(--color-muted)]">
        Source: Open-Meteo (CC BY 4.0). Forecasts are estimates only.
      </p>
    </div>
  );
}
