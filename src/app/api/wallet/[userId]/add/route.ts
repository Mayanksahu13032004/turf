import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Wallet from '../../../../model/wallet';
import Transaction from '../../../../model/Transaction';

// Ensure MongoDB connection
const connectToDatabase = async () => {
  if (mongoose.connections[0].readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }
};

export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = await params;
  const { type, amount, description } = await req.json(); // Get POST data from body

  try {
    await connectToDatabase();

    // Validate the type and amount
    if (amount <= 0) {
      return NextResponse.json({ message: 'Amount must be greater than zero' }, { status: 400 });
    }

    // Check if the wallet exists for this user
    let wallet = await Wallet.findOne({ userId });

    // If no wallet found, create a new wallet for the user
    if (!wallet) {
      wallet = new Wallet({
        userId,
        balance: 0, // Initialize with 0 balance
      });
      await wallet.save();
    }

    // Handle the transaction
    const transaction = new Transaction({
      userId,
      type,
      amount,
      date: new Date().toISOString(),
      description,
    });

    await transaction.save();

    // Update wallet balance based on the transaction type
    if (type === 'credit') {
      wallet.balance += amount; // Add to balance
    } else if (type === 'debit') {
      // Check if the balance is sufficient for the debit
      if (wallet.balance < amount) {
        return NextResponse.json({ message: 'Insufficient balance' }, { status: 400 });
      }
      wallet.balance -= amount; // Subtract from balance
    } else {
      return NextResponse.json({ message: 'Invalid transaction type' }, { status: 400 });
    }

    await wallet.save();

    return NextResponse.json({ message: 'Transaction added successfully', walletBalance: wallet.balance }, { status: 200 });
  }catch (error) {
  if (error instanceof Error) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  } else {
    return NextResponse.json({ message: 'Server error', error: 'Unknown error occurred' }, { status: 500 });
  }
}

}
