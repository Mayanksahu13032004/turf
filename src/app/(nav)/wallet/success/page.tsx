'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function WalletSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get('userId');
  const amount = searchParams.get('amount');

  useEffect(() => {
    if (userId && amount) {
      fetch(`/api/wallet/${userId}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'credit',
          amount: parseInt(amount),
          description: 'Added via Stripe',
        }),
      })
        .then(() => router.push('/wallet'))
        .catch((err) => console.error('Error updating wallet:', err));
    }
  }, [userId, amount, router]);

  return <p className="p-6 text-center text-lg">Processing payment... Please wait.</p>;
}
