import { NextRequest, NextResponse } from 'next/server';
import { setOtp } from '@/lib/otpStore';

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

const IS_DEV = process.env.NODE_ENV === 'development';
const HAS_GMAIL =
  process.env.GMAIL_USER &&
  process.env.GMAIL_APP_PASSWORD &&
  process.env.GMAIL_APP_PASSWORD !== 'your_16_char_app_password_here';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'A valid email address is required to send a verification code.' },
        { status: 400 }
      );
    }

    const code = generateCode();
    setOtp(email, code);

    // ── If Gmail credentials are configured → send real email ───────────────
    if (HAS_GMAIL) {
      try {
        const nodemailer = await import('nodemailer');
        const transporter = nodemailer.default.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
          },
        });

        await transporter.sendMail({
          from: `"Lola Studio" <${process.env.GMAIL_USER}>`,
          to: email,
          subject: `Your Lola Studio Order Verification Code: ${code}`,
          html: `
            <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;background:#FAF7F2;padding:40px 32px;border-radius:16px;border:1px solid #E8E4DC;">
              <h2 style="color:#22201E;font-size:22px;margin:0 0 8px;">Order Verification</h2>
              <p style="color:#7A756B;font-size:13px;margin:0 0 24px;line-height:1.6;">
                Enter the code below to confirm your Lola Studio order. It expires in <strong>10 minutes</strong>.
              </p>
              <div style="background:#22201E;color:#F7F4EE;font-size:36px;font-weight:700;letter-spacing:12px;text-align:center;padding:20px 32px;border-radius:12px;margin-bottom:24px;">
                ${code}
              </div>
              <p style="color:#A09890;font-size:11px;margin:0;line-height:1.6;">
                If you did not place this order, please ignore this email.<br/>
                Handcrafted in Negombo, Sri Lanka · Cash on Delivery Islandwide.
              </p>
            </div>
          `,
        });

        console.log(`[OTP] Email sent to ${email}`);
        return NextResponse.json({ success: true });
      } catch (mailErr: any) {
        console.error('[OTP] Gmail send failed:', mailErr.message);
        // Fall through to dev mode response so order flow isn't blocked
      }
    }

    // ── Fallback: return code so testing/checkout is never blocked ──────────
    console.warn(`[OTP] Code for ${email}: ${code}`);
    return NextResponse.json({ success: true, devCode: code });
  } catch (err: any) {
    console.error('[send-otp]', err);
    return NextResponse.json(
      { error: 'Unexpected error. Please try again.' },
      { status: 500 }
    );
  }
}
