import React from 'react';
import { clsx } from 'clsx';

export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx('mx-auto w-full max-w-7xl px-6', className)}>
      {children}
    </div>
  );
}

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  as?: 'section' | 'div' | 'article';
};

export function Section({ children, className, as: Tag = 'section' }: SectionProps) {
  return (
    <Tag className={clsx('py-16 md:py-24', className)}>
      <Container>{children}</Container>
    </Tag>
  );
}
