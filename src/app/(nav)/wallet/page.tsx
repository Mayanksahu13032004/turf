'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AddMoneyButton from '../../_components/AddMoneyButton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useRouter } from 'next/navigation';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  date: string;
  description?: string;
}

const WalletPage: React.FC = () => {
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userStorage, setUserStorage] = useState<{ user: { _id: string } } | null>(null);
  const [addAmount, setAddAmount] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const storedUserId = parsedUser.user._id;
      setUserStorage(parsedUser);
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetch(`/api/wallet/${userId}`)
        .then((response) => response.json())
        .then((data: any) => {
          setWalletBalance(data.walletBalance);
          const formattedTransactions: Transaction[] = data.transactions.map((tx: any) => ({
            id: tx._id,
            type: tx.type,
            amount: tx.amount,
            date: new Date(tx.date).toLocaleString(),
            description: tx.description,
          }));
          setTransactions(formattedTransactions);
        })
        .catch((error) => console.error('Error fetching wallet data:', error));
    }
  }, [userId]);

  if (!userId || !userStorage?.user?._id) {
    return (
      <div className="p-6 text-center">
        <p className="text-xl font-semibold text-gray-700">Please log in to access your wallet.</p>
        <Button onClick={() => router.push('/login')} className="mt-4 text-xl font-semibold">
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <Card className="shadow-lg border border-gray-200 rounded-2xl">
        <CardContent className="flex justify-between items-center p-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Wallet Balance</h2>
            <p className="text-4xl font-semibold text-green-600 mt-1">₹{walletBalance.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={addAmount}
              onChange={(e) => setAddAmount(Number(e.target.value))}
              placeholder="Enter amount"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-xl font-semibold"
            />
            <AddMoneyButton userId={userId} amount={addAmount} />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border border-gray-200 rounded-2xl">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Transaction History</h3>
          {transactions.length === 0 ? (
            <p className="text-xl font-semibold text-gray-500">No transactions yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-md">
              <Table className="min-w-full divide-y divide-gray-200 text-xl font-semibold">
                <TableHeader>
                  <TableRow className="bg-gray-100 text-gray-700">
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx, index) => (
                    <TableRow
                      key={tx.id}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <TableCell>{tx.date}</TableCell>
                      <TableCell className="capitalize">{tx.type}</TableCell>
                      <TableCell>{tx.description || '-'}</TableCell>
                      <TableCell
                        className={`text-right font-semibold ${
                          tx.type === 'debit' ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        ₹{tx.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletPage;
