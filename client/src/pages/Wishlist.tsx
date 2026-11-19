import React from 'react';
import { useWishlist } from '../hooks/useDestinations';
import { MediaCard } from '../components/cards/MediaCard';
import { Container } from '../components/layout/Container';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { toast } from '../components/ui/Toast';

export default function Wishlist() {
  const { data, isLoading, remove } = useWishlist();

  const handleRemove = (slug: string, name: string) => {
    remove.mutate(slug, {
      onSuccess: () => toast(`Removed ${name} from your wishlist`, 'info'),
      onError: () => toast('Could not remove from wishlist', 'error'),
    });
  };

  return (
    <main id="main">
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] py-8">
        <Container>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-[var(--color-ink)]">Wishlist</h1>
              <p className="text-sm text-[var(--color-muted)] mt-1">
                {data ? `${data.length} saved ${data.length === 1 ? 'place' : 'places'} to visit` : 'Places you want to visit'}
              </p>
            </div>
            <Link to="/destinations">
              <Button variant="outline">Explore more destinations</Button>
            </Link>
          </div>
        </Container>
      </div>

      <Container className="py-10">
        {isLoading && (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        )}
        {!isLoading && (!data || data.length === 0) && (
          <EmptyState
            title="Your wishlist is empty"
            description="Explore our destination catalog and click 'Add to wishlist' to save your dream spots."
            action={
              <Link to="/destinations">
                <Button>Browse destinations</Button>
              </Link>
            }
          />
        )}
        {data && data.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.map((dest) => (
              <div key={dest.slug} className="group relative flex flex-col">
                <MediaCard {...dest} />
                <div className="mt-2 flex items-center justify-between px-1">
                  <Link
                    to={`/planner?destination=${dest.slug}&city=${encodeURIComponent(dest.name)}&country=${encodeURIComponent(dest.country)}`}
                    className="text-xs font-medium text-[var(--color-ink)] underline underline-offset-2 hover:opacity-80"
                  >
                    Plan trip here →
                  </Link>
                  <button
                    onClick={() => handleRemove(dest.slug, dest.name)}
                    className="text-xs text-[var(--color-muted)] hover:text-red-500 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
