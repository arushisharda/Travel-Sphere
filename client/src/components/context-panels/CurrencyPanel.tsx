import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { formatCurrency } from '../../lib/format';
import { Spinner } from '../ui/Spinner';
import { ErrorState } from '../ui/EmptyState';

const COMMON_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'SGD', 'INR', 'THB', 'TRY'];

type ConvertResult = {
  amount: number;
  from: string;
  to: string;
  rate: number;
  converted: number;    // API uses 'converted', not 'result'
  rateDate: string;
  source: string;
  isEstimate: boolean;
};

export function CurrencyPanel({ defaultTo = 'USD' }: { defaultTo?: string }) {
  const [amount, setAmount] = useState('100');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState(defaultTo !== 'USD' ? defaultTo : 'JPY');

  const { data, isLoading, isError } = useQuery<ConvertResult>({
    queryKey: ['currency', from, to, amount],
    queryFn: async () => {
      const res = await api.get('/currency/convert', {
        params: { from, to, amount: parseFloat(amount) || 100 },
      });
      return res.data;
    },
    staleTime: 1000 * 60 * 60,
    enabled: !isNaN(parseFloat(amount)) && parseFloat(amount) > 0,
  });

  const swap = () => { setFrom(to); setTo(from); };

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-paper)] p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-4">
        Currency
      </h3>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="h-10 w-24 rounded-lg border border-[var(--color-border)] bg-[var(--color-paper)] px-3 text-sm focus:outline-none focus:border-[var(--color-ink)]"
          min="0"
        />
        <select
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="h-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-paper)] px-2 text-sm focus:outline-none focus:border-[var(--color-ink)]"
        >
          {COMMON_CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button
          onClick={swap}
          className="h-10 w-10 flex items-center justify-center rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-colors text-[var(--color-muted)]"
          aria-label="Swap currencies"
        >
          ⇄
        </button>
        <select
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="h-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-paper)] px-2 text-sm focus:outline-none focus:border-[var(--color-ink)]"
        >
          {COMMON_CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="min-h-[3rem] flex items-center">
        {isLoading && <Spinner />}
        {isError && <p className="text-sm text-[var(--color-muted)]">Rate unavailable</p>}
        {data && (
          <div>
            <p className="text-2xl font-semibold text-[var(--color-ink)]">
              {formatCurrency(data.converted, data.to)}
            </p>
            <p className="text-xs text-[var(--color-muted)] mt-0.5">
              1 {data.from} = {data.rate.toFixed(4)} {data.to} · {data.rateDate}
            </p>
          </div>
        )}
      </div>
      <p className="mt-3 text-xs text-[var(--color-muted)]">
        Estimates only, not financial advice. Source: Frankfurter.
      </p>
    </div>
  );
}
