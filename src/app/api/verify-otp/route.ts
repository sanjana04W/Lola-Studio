import { NextRequest, NextResponse } from 'next/server';
import { verifyOtp } from '@/lib/otpStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const identifier = body.phone || body.email;
    const { code } = body;

    if (!identifier || !code) {
      return NextResponse.json(
        { error: 'Phone number and verification code are required.' },
        { status: 400 }
      );
    }

    const result = verifyOtp(identifier, code);

    if (result === 'ok') {
      return NextResponse.json({ success: true });
    }

    const messages: Record<'expired' | 'invalid' | 'too_many', string> = {
      expired: 'Your verification code has expired. Please request a new one.',
      invalid: 'Incorrect verification code. Please check your SMS and try again.',
      too_many: 'Too many incorrect attempts. Please request a new code.',
    };

    return NextResponse.json(
      { error: messages[result as 'expired' | 'invalid' | 'too_many'] },
      { status: 400 }
    );
  } catch (err: any) {
    console.error('[verify-otp]', err);
    return NextResponse.json(
      { error: 'Verification failed. Please try again.' },
      { status: 500 }
    );
  }
}
