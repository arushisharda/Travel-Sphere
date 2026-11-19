import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { api, extractError } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { TextInput } from '../components/ui/TextInput';
import { Button } from '../components/ui/Button';
import { TierCard } from '../components/cards/index';
import { Orb } from '../components/shared/Orb';

const schema = z.object({
  name: z.string().min(2, 'Enter your name'),
  email: z.string().email(),
  password: z.string().min(8, 'At least 8 characters'),
});

type FormValues = z.infer<typeof schema>;

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      const res = await api.post('/auth/register', values);
      // Auth returns { user, token } at root (no data wrapper)
      const { token, user } = res.data;
      login(token, user);
      navigate('/', { replace: true });
    } catch (err) {
      setError(extractError(err));
    }
  };

  return (
    <main id="main" className="relative min-h-[80vh] flex items-center justify-center overflow-hidden py-16">
      <Orb variant="peach" size="lg" className="-top-20 -right-20" />
      <div className="relative w-full max-w-sm px-4">
        <TierCard>
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-[var(--color-ink)]">Create account</h1>
            <p className="text-sm text-[var(--color-muted)] mt-1">Free to get started</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <TextInput label="Name" type="text" autoComplete="name" error={errors.name?.message} {...register('name')} />
            <TextInput label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
            <TextInput label="Password" type="password" autoComplete="new-password" error={errors.password?.message} {...register('password')} />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" loading={isSubmitting} className="w-full">Create account</Button>
          </form>
          <p className="text-sm text-[var(--color-muted)] mt-6 text-center">
            Already have one?{' '}
            <Link to="/login" className="text-[var(--color-ink)] underline underline-offset-4">Sign in</Link>
          </p>
        </TierCard>
      </div>
    </main>
  );
}
