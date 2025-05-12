import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  userId: string;
  type: 'credit' | 'debit';
  amount: number;
  date: string;
  description?: string;
}

const transactionSchema = new Schema<ITransaction>({
  userId: { type: String, required: true },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  amount: { type: Number, required: true },
  date: { type: String, required: true },
  description: { type: String },
});

const Transaction = mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', transactionSchema);

export default Transaction;
