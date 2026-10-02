'use client';
import { useState } from 'react';
import Link from 'next/link';
import { supabaseBrowser } from '@/lib/supabase';
export default function Login() {
  const [error,setError] = useState('');
  async function signIn() { setError(''); if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) { setError('Google sign-in is not configured yet. Add your Supabase URL and public key to .env.local.'); return; } const db = supabaseBrowser(); const { error } = await db.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${location.origin}/auth/callback?next=/` } }); if (error) setError(error.message); }
  return <section className="login-page"><Link href="/" className="back-link">← &nbsp;Back to the shop</Link><span className="eyebrow">WELCOME TO TADE</span><h1>Your Tade, <em>your way.</em></h1><p>Sign in to keep track of your orders and your favourite pairs.</p><button className="google-button" onClick={signIn}><span>G</span> Continue with Google</button>{error&&<p className="form-error">{error}</p>}<small>We’ll only use your email for your account and order updates.</small></section>;
}
