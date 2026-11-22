import { NextRequest, NextResponse } from 'next/server';
import { setOtp, normalizeIdentifier } from '@/lib/otpStore';

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const phone = body.phone || body.email;

    if (!phone || typeof phone !== 'string') {
      return NextResponse.json(
        { error: 'A valid phone number is required to send a verification code.' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/[\s\-()]/g, '');
    if (cleanPhone.length < 9) {
      return NextResponse.json(
        { error: 'Please enter a valid phone number (at least 9 digits).' },
        { status: 400 }
      );
    }

    const code = generateCode();
    setOtp(phone, code);
    const normalizedPhone = normalizeIdentifier(phone);

    // ── 1. Notify.lk (Sri Lanka SMS Gateway) ─────────────────────────────────
    if (process.env.NOTIFYLK_USER_ID && process.env.NOTIFYLK_API_KEY) {
      try {
        const notifyRes = await fetch('https://app.notify.lk/api/v1/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: process.env.NOTIFYLK_USER_ID,
            api_key: process.env.NOTIFYLK_API_KEY,
            sender_id: process.env.NOTIFYLK_SENDER_ID || 'NotifyDEMO',
            to: normalizedPhone,
            message: `Your Lola Studio verification code is ${code}. Valid for 10 minutes.`,
          }),
        });

        const notifyData = await notifyRes.json();
        if (notifyData?.status === 'success') {
          console.log(`[SMS OTP] Sent via Notify.lk to ${normalizedPhone}`);
          return NextResponse.json({ success: true, sentTo: normalizedPhone });
        } else {
          console.warn('[SMS OTP] Notify.lk returned error:', notifyData);
        }
      } catch (smsErr: any) {
        console.error('[SMS OTP] Notify.lk request failed:', smsErr.message);
      }
    }

    // ── 2. Twilio SMS Gateway ───────────────────────────────────────────────
    if (
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_PHONE_NUMBER
    ) {
      try {
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`;
        const auth = Buffer.from(
          `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
        ).toString('base64');

        const params = new URLSearchParams();
        params.append('To', normalizedPhone.startsWith('+') ? normalizedPhone : `+${normalizedPhone}`);
        params.append('From', process.env.TWILIO_PHONE_NUMBER);
        params.append('Body', `Your Lola Studio verification code is: ${code}. Valid for 10 minutes.`);

        const twilioRes = await fetch(twilioUrl, {
          method: 'POST',
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
        });

        if (twilioRes.ok) {
          console.log(`[SMS OTP] Sent via Twilio to ${normalizedPhone}`);
          return NextResponse.json({ success: true, sentTo: normalizedPhone });
        } else {
          const twErr = await twilioRes.text();
          console.warn('[SMS OTP] Twilio error:', twErr);
        }
      } catch (twErr: any) {
        console.error('[SMS OTP] Twilio request failed:', twErr.message);
      }
    }

    // ── 3. Generic Custom SMS Gateway ───────────────────────────────────────
    if (process.env.SMS_GATEWAY_URL) {
      try {
        const gatewayRes = await fetch(process.env.SMS_GATEWAY_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(process.env.SMS_GATEWAY_API_KEY
              ? { Authorization: `Bearer ${process.env.SMS_GATEWAY_API_KEY}` }
              : {}),
          },
          body: JSON.stringify({
            to: normalizedPhone,
            message: `Your Lola Studio verification code is: ${code}`,
            code,
          }),
        });

        if (gatewayRes.ok) {
          return NextResponse.json({ success: true, sentTo: normalizedPhone });
        }
      } catch (gateErr: any) {
        console.error('[SMS OTP] Custom gateway request failed:', gateErr.message);
      }
    }

    // ── 4. Dev / Fallback Mode ──────────────────────────────────────────────
    // When SMS provider is not yet set up, return devCode so checkout is NEVER blocked
    console.warn(`[SMS OTP] Code for ${normalizedPhone}: ${code}`);
    return NextResponse.json({
      success: true,
      devCode: code,
      sentTo: phone,
      isDev: true,
    });
  } catch (err: any) {
    console.error('[send-otp]', err);
    return NextResponse.json(
      { error: 'Unexpected error sending OTP. Please try again.' },
      { status: 500 }
    );
  }
}
