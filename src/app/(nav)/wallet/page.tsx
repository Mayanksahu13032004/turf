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

interface WalletData {
  walletBalance: number;
  transactions: Transaction[];
}

const WalletPage: React.FC = () => {
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userStorage, setUserStorage] = useState<{ user: { _id: string } } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId') || '68204f921061df0b2126b042';
    setUserId(storedUserId);

    const storedUser = localStorage.getItem('user');
    if (storedUser) setUserStorage(JSON.parse(storedUser));
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
        <p>Please log in to access your wallet.</p>
        <Button onClick={() => router.push('/login')} className="mt-4">
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Card className="shadow-md">
        <CardContent className="flex justify-between items-center p-6">
          <div>
            <h2 className="text-xl font-semibold">Wallet Balance</h2>
            <p className="text-3xl font-bold text-green-600">₹{walletBalance}</p>
          </div>
          <AddMoneyButton userId={userId} amount={500} />
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Payment History</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{tx.date}</TableCell>
                  <TableCell>{tx.type === 'credit' ? 'Credit' : 'Debit'}</TableCell>
                  <TableCell>{tx.description || '-'}</TableCell>
                  <TableCell
                    className={`text-right ${
                      tx.type === 'debit' ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    ₹{tx.amount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletPage;
