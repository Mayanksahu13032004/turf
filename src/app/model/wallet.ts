import mongoose, { Document, Schema } from 'mongoose';

export interface IWallet extends Document {
  userId: string;
  balance: number;
}

const walletSchema = new Schema<IWallet>({
  userId: { type: String, required: true },
  balance: { type: Number, default: 0 },
});

const Wallet = mongoose.models.Wallet || mongoose.model<IWallet>('Wallet', walletSchema);

export default Wallet;
