import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from '@/lib/supabase-admin';
async function sendConfirmation(to: string, orderId: string) {
  const { MAILGUN_API_KEY: key, MAILGUN_DOMAIN: domain, MAILGUN_FROM: from } = process.env;
  if (!key || !domain || !from) { console.warn('Mailgun is not configured; order confirmation email skipped.'); return false; }
  const data = new FormData(); data.set('from', from); data.set('to', to); data.set('subject', 'Your Tade Footwear order is confirmed'); data.set('text', `Thank you for your order from Tade Footwear. Your payment is confirmed. Order reference: ${orderId}. We can’t wait for you to meet your new pair.\n\nQuestions? Reply to this email.`);
  const response = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, { method: 'POST', headers: { authorization: `Basic ${Buffer.from(`api:${key}`).toString('base64')}` }, body: data });
  if (!response.ok) throw new Error(`Mailgun returned ${response.status}`);
  return true;
}
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: 'Webhook is not configured.' }, { status: 500 });
  const signature = request.headers.get('stripe-signature');
  if (!signature) return NextResponse.json({ error: 'Missing signature.' }, { status: 400 });
  let event: Stripe.Event;
  try { event = new Stripe(process.env.STRIPE_SECRET_KEY!).webhooks.constructEvent(await request.text(), signature, secret); } catch { return NextResponse.json({ error: 'Invalid webhook signature.' }, { status: 400 }); }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status === 'paid' && session.metadata?.order_id) {
      const db = adminDb();
      const { data: existing, error: lookupError } = await db.from('orders').select('id,email,status,email_sent_at').eq('id', session.metadata.order_id).maybeSingle();
      if (lookupError || !existing) return NextResponse.json({ error: 'Could not find order.' }, { status: 500 });
      const { error: updateError } = await db.from('orders').update({ status: 'paid', stripe_session_id: session.id, amount_total: session.amount_total }).eq('id', existing.id);
      if (updateError) return NextResponse.json({ error: 'Could not record order.' }, { status: 500 });
      if (!existing.email_sent_at) {
        try {
          const delivered = await sendConfirmation(existing.email, existing.id);
          if (delivered) await db.from('orders').update({ email_sent_at: new Date().toISOString() }).eq('id', existing.id).is('email_sent_at', null);
        } catch (err) { console.error('Confirmation email failed:', err); return NextResponse.json({ error: 'Email delivery failed; retrying webhook.' }, { status: 500 }); }
      }
    }
  }
  return NextResponse.json({ received: true });
}
