'use client';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

interface AddMoneyButtonProps {
  userId: string;
  amount: number; // Amount in rupees
}

export default function AddMoneyButton({ userId, amount }: AddMoneyButtonProps) {
  const handleAddMoney = async () => {
    const response = await fetch('/api/wallet/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, amount }),
    });

    const { id } = await response.json();
    const stripe = await stripePromise;
    await stripe?.redirectToCheckout({ sessionId: id });
  };

  return (
    <button
      onClick={handleAddMoney}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >
      Add ₹{amount} via Stripe
    </button>
  );
}
