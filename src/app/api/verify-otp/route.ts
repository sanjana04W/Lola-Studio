import { NextRequest, NextResponse } from 'next/server';
import { verifyOtp } from '@/lib/otpStore';

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code are required.' }, { status: 400 });
    }

    const result = verifyOtp(email, code);

    if (result === 'ok') {
      return NextResponse.json({ success: true });
    }

    const messages: Record<'expired' | 'invalid' | 'too_many', string> = {
      expired: 'Your verification code has expired. Please request a new one.',
      invalid: 'Incorrect code. Please check the email and try again.',
      too_many: 'Too many incorrect attempts. Please request a new code.',
    };

    return NextResponse.json({ error: messages[result as 'expired' | 'invalid' | 'too_many'] }, { status: 400 });
  } catch (err: any) {
    console.error('[verify-otp]', err);
    return NextResponse.json({ error: 'Verification failed. Please try again.' }, { status: 500 });
  }
}
