'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const res = await fetch('/api/users/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, token, newPassword }),
    });

    const data = await res.json();

    if (res.ok) {
      alert('Password reset successful');
      router.push('/login');
    } else {
      alert(data.error || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-200">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow max-w-sm w-full">
        <h1 className="text-xl font-bold mb-4">Reset Password</h1>
        <input
          type="password"
          placeholder="New Password"
          className="border p-2 w-full mb-4"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="border p-2 w-full mb-4"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded w-full">
          Reset Password
        </button>
      </form>
    </div>
  );
}
