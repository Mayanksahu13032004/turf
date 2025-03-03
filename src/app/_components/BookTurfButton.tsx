import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

interface BookTurfButtonProps {
  turfId: string;
  price: number;
  date: string;
  time: string;
}

export default function BookTurfButton({ turfId, price, date, time }: BookTurfButtonProps) {
  const handleCheckout = async () => {
    const response = await fetch('/api/payment/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ turfId, price, date, time }),
    });

    const { id } = await response.json();
    const stripe = await stripePromise;
    await stripe?.redirectToCheckout({ sessionId: id });
  };

  return (
    <button onClick={handleCheckout} className="bg-green-500 text-white p-3 rounded">
      Book Now - ${price}
    </button>
  );
}
