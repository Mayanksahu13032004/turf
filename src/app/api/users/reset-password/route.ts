import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/app/lib/mongodb'; // adjust path as needed
import User from '../../../model/user'; // adjust path as needed

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { email, token, newPassword } = await req.json();

    if (!email || !token || !newPassword) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.resetToken !== token) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.verified = true;

    await user.save();

    return NextResponse.json({ message: 'Password reset successful' }, { status: 200 });
  } catch (err) {
    console.error('Reset password error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
