import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/layout/Container';
import { Button } from '../components/ui/Button';

export default function NotFound() {
  return (
    <main id="main" className="flex items-center justify-center min-h-[70vh]">
      <Container>
        <div className="max-w-sm mx-auto text-center">
          <p className="text-7xl font-display font-light text-[var(--color-border)] mb-6">404</p>
          <h1 className="text-2xl font-semibold text-[var(--color-ink)] mb-3">Page not found</h1>
          <p className="text-[var(--color-muted)] mb-8">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link to="/">
            <Button>Back to home</Button>
          </Link>
        </div>
      </Container>
    </main>
  );
}
