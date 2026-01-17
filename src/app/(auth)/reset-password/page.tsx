'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// 1. Move the form logic into a sub-component
function ResetPasswordForm() {
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
          name="new-password"
          placeholder="New Password"
          className="border p-2 w-full mb-4 text-black"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          name="confirm-password"
          placeholder="Confirm Password"
          className="border p-2 w-full mb-4 text-black"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded w-full hover:bg-blue-700 transition">
          Reset Password
        </button>
      </form>
    </div>
  );
}

// 2. Export the main page wrapped in Suspense
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-200">
        <div className="bg-white p-8 rounded shadow text-center">
          <p className="text-gray-600">Loading reset form...</p>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}