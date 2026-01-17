import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Wallet from '../../../model/wallet';
import Transaction from '../../../model/Transaction';

const connectToDatabase = async () => {
  if (mongoose.connections[0].readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }
};

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  // Await the params to ensure proper resolution of dynamic params
  const { userId } = await params;

  try {
    await connectToDatabase();

    const wallet = await Wallet.findOne({ userId });
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });

    if (!wallet) {
      return NextResponse.json({ message: 'Wallet not found' }, { status: 404 });
    }

    return NextResponse.json({ walletBalance: wallet.balance, transactions }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error }, { status: 500 });
  }
}