import React from 'react';
import { clsx } from 'clsx';

type PanelCardProps = {
  children: React.ReactNode;
  className?: string;
  title?: string;
};

export function PanelCard({ children, className, title }: PanelCardProps) {
  return (
    <div className={clsx('rounded-xl border border-[var(--color-border)] bg-[var(--color-paper)] p-6', className)}>
      {title && <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-4">{title}</h3>}
      {children}
    </div>
  );
}

type QuoteCardProps = {
  quote: string;
  attribution?: string;
  topic?: string;
  className?: string;
};

export function QuoteCard({ quote, attribution, topic, className }: QuoteCardProps) {
  return (
    <figure className={clsx('rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6', className)}>
      {topic && (
        <span className="text-xs uppercase tracking-wider text-[var(--color-muted)] font-medium">{topic}</span>
      )}
      <blockquote className="mt-2 text-base text-[var(--color-ink)] leading-relaxed">
        "{quote}"
      </blockquote>
      {attribution && (
        <figcaption className="mt-3 text-sm text-[var(--color-muted)]">— {attribution}</figcaption>
      )}
    </figure>
  );
}

type OrbCardProps = {
  title: string;
  description: string;
  orb: 'mint' | 'peach';
  className?: string;
};

export function OrbCard({ title, description, orb, className }: OrbCardProps) {
  return (
    <div className={clsx('relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-paper)] p-8', className)}>
      <div
        className={clsx(
          'absolute -top-8 -right-8 h-40 w-40 rounded-full blur-3xl opacity-30',
          orb === 'mint' ? 'bg-[var(--color-mint)]' : 'bg-[var(--color-peach)]'
        )}
        aria-hidden
      />
      <h3 className="relative text-xl font-semibold text-[var(--color-ink)] mb-2">{title}</h3>
      <p className="relative text-[var(--color-muted)] leading-relaxed">{description}</p>
    </div>
  );
}

type TierCardProps = {
  children: React.ReactNode;
  featured?: boolean;
  className?: string;
};

export function TierCard({ children, featured = false, className }: TierCardProps) {
  return (
    <div
      className={clsx(
        'rounded-2xl border p-8',
        featured
          ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)]'
          : 'border-[var(--color-border)] bg-[var(--color-paper)] text-[var(--color-ink)]',
        className
      )}
    >
      {children}
    </div>
  );
}

type FeatureCardProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
};

export function FeatureCard({ title, description, icon, className }: FeatureCardProps) {
  return (
    <div className={clsx('rounded-xl border border-[var(--color-border)] bg-[var(--color-paper)] p-6', className)}>
      {icon && <div className="mb-4 h-10 w-10 rounded-lg bg-[var(--color-surface-strong)] flex items-center justify-center">{icon}</div>}
      <h3 className="font-semibold text-[var(--color-ink)] mb-1">{title}</h3>
      <p className="text-sm text-[var(--color-muted)] leading-relaxed">{description}</p>
    </div>
  );
}
