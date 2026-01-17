'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, Suspense } from 'react';

// 1. Move the logic into a child component
function WalletSuccessContent() {
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
        .then(() => {
          // Redirect back to the main wallet page after updating
          router.push('/wallet');
        })
        .catch((err) => console.error('Error updating wallet:', err));
    }
  }, [userId, amount, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
      <p className="p-6 text-center text-lg font-medium text-gray-700">
        Processing your payment... Please do not refresh the page.
      </p>
    </div>
  );
}

// 2. Wrap the child component in Suspense
export default function WalletSuccess() {
  return (
    <Suspense 
      fallback={
        <p className="p-6 text-center text-lg text-gray-500">
          Loading payment details...
        </p>
      }
    >
      <WalletSuccessContent />
    </Suspense>
  );
}