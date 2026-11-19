import React from 'react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';

type MediaCardProps = {
  slug: string;
  name: string;
  country: string;
  region: string;
  imageUrl?: string;
  imageThumbUrl?: string;
  climateType?: string;
  budgetLevel?: string | number;
  summary?: string;
  className?: string;
  // legacy compat
  climate?: string;
  budget?: string;
  description?: string;
};

export function MediaCard({
  slug, name, country, region,
  imageUrl, imageThumbUrl,
  climateType, budgetLevel,
  className,
}: MediaCardProps) {
  const img = imageThumbUrl ?? imageUrl ?? `https://source.unsplash.com/800x600/?${encodeURIComponent(name)},travel`;

  return (
    <Link
      to={`/destinations/${slug}`}
      className={clsx(
        'group block rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-paper)] transition-shadow hover:shadow-elevated',
        className
      )}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={img}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://placehold.co/800x600/f5f0eb/1a1510?text=' + encodeURIComponent(name);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-xs text-white/80 uppercase tracking-wider">{region}</p>
          <h3 className="text-white font-semibold text-lg leading-tight">{name}</h3>
          <p className="text-white/70 text-sm">{country}</p>
        </div>
      </div>
      <div className="p-4 flex items-center gap-3">
        {climateType && (
          <span className="text-xs text-[var(--color-muted)] bg-[var(--color-surface)] rounded-full px-2.5 py-0.5">
            {climateType}
          </span>
        )}
        {budgetLevel && (
          <span className="text-xs text-[var(--color-muted)] bg-[var(--color-surface)] rounded-full px-2.5 py-0.5">
            {budgetLevel}
          </span>
        )}
        <span className="ml-auto text-xs text-[var(--color-muted)] group-hover:translate-x-0.5 transition-transform">
          Explore →
        </span>
      </div>
    </Link>
  );
}
