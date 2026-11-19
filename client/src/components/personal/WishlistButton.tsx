import React from 'react';
import { useWishlist } from '../../hooks/useDestinations';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../ui/Toast';

export function WishlistButton({ destinationSlug }: { destinationSlug: string }) {
  const { isAuthenticated } = useAuth();
  const { data: wishlist, add, remove } = useWishlist();

  const isWishlisted = wishlist?.some((d) => d.slug === destinationSlug) ?? false;

  const handleClick = () => {
    if (!isAuthenticated) {
      toast('Sign in to save to your wishlist', 'info');
      return;
    }
    if (isWishlisted) {
      remove.mutate(destinationSlug, {
        onSuccess: () => toast('Removed from wishlist'),
        onError: () => toast('Could not remove — try again', 'error'),
      });
    } else {
      add.mutate(destinationSlug, {
        onSuccess: () => toast('Added to wishlist', 'success'),
        onError: (err: any) => {
          const msg = err?.response?.data?.message ?? 'Could not add';
          toast(msg, 'error');
        },
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-pressed={isWishlisted}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`inline-flex h-11 items-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors ${
        isWishlisted
          ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)]'
          : 'border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]'
      }`}
    >
      <span aria-hidden>{isWishlisted ? '♥' : '♡'}</span>
      {isWishlisted ? 'Wishlisted' : 'Add to wishlist'}
    </button>
  );
}
