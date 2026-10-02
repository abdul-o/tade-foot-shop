import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from '@/lib/supabase-admin';
const stripe = () => new Stripe(process.env.STRIPE_SECRET_KEY!);
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (typeof body.email !== 'string' || !/^\S+@\S+\.\S+$/.test(body.email) || !Array.isArray(body.items) || !body.items.length || body.items.length > 20) return NextResponse.json({ error: 'Please enter a valid email and at least one item.' }, { status: 400 });
    const db = adminDb();
    const ids = body.items.map((x: {id:string}) => x.id);
    if (body.items.some((x: {id:string;quantity:number;size?:string}) => !/^[a-z0-9-]+$/.test(x.id) || !Number.isInteger(x.quantity) || x.quantity < 1 || x.quantity > 10 || (x.size !== undefined && !['36','37','38','39','40','41','42','43'].includes(String(x.size))))) return NextResponse.json({ error: 'One or more cart items are invalid.' }, { status: 400 });
    const { data: catalog, error: catalogError } = await db.from('products').select('id,name,price_kobo,active').in('id', ids).eq('active', true);
    if (catalogError) throw catalogError;
    if (!catalog || catalog.length !== new Set(ids).size) return NextResponse.json({ error: 'A product in your bag is no longer available.' }, { status: 400 });
    const lines = body.items.map((item: {id:string;quantity:number}) => { const product = catalog.find(p => p.id === item.id)!; return { price_data: { currency: 'ngn', product_data: { name: product.name }, unit_amount: product.price_kobo }, quantity: item.quantity }; });
    const orderId = crypto.randomUUID();
    const { error: orderError } = await db.from('orders').insert({ id: orderId, email: body.email, status: 'pending', items: body.items });
    if (orderError) throw orderError;
    const base = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const subtotal = body.items.reduce((sum: number, item: {id:string;quantity:number}) => sum + catalog.find(p => p.id === item.id)!.price_kobo * item.quantity, 0);
    const delivery = subtotal >= 7500000 ? 0 : 350000;
    const session = await stripe().checkout.sessions.create({ mode: 'payment', customer_email: body.email, line_items: lines, shipping_address_collection: { allowed_countries: ['NG'] }, shipping_options: [{ shipping_rate_data: { type: 'fixed_amount', fixed_amount: { amount: delivery, currency: 'ngn' }, display_name: delivery === 0 ? 'Complimentary Nigeria delivery' : 'Nigeria delivery' } }], success_url: `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`, cancel_url: `${base}/checkout`, metadata: { order_id: orderId } });
    await db.from('orders').update({ stripe_session_id: session.id }).eq('id', orderId);
    return NextResponse.json({ url: session.url });
  } catch (error) { console.error('Checkout setup failed:', error); return NextResponse.json({ error: error instanceof Error && error.message.includes('credentials') ? error.message : 'Checkout is temporarily unavailable. Please try again.' }, { status: 500 }); }
}
