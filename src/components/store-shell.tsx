'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Logo } from './tade-logo';
export function StoreShell({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0);
  useEffect(() => { const read = () => { const c = JSON.parse(localStorage.getItem('tade-cart') || '[]'); setCount(c.reduce((a: number, i: { quantity: number }) => a + i.quantity, 0)); }; read(); window.addEventListener('storage', read); window.addEventListener('tade-cart-change', read); return () => { window.removeEventListener('storage', read); window.removeEventListener('tade-cart-change', read); }; }, []);
  return <><div className="announcement">A little joy, made by hand. Complimentary delivery on orders over ₦75,000 <span>✳</span></div><header className="site-header"><Link href="/" aria-label="Tade Footwear home"><Logo /></Link><nav><a href="/#shop">Shop all</a><a href="/#story">Our story</a><a href="/#craft">The craft</a></nav><div className="header-actions"><a className="account" href="/login">Sign in</a><Link className="bag" href="/checkout" aria-label={`Shopping bag, ${count} items`}>Bag <span>{count}</span></Link></div></header><main>{children}</main><footer className="footer"><Logo /><p>Made slowly. Worn everywhere.</p><div><a href="/#shop">Shop</a><a href="mailto:hello@tadefootwear.com">Get in touch</a><a href="/privacy">Privacy</a></div><small>© 2026 Tade Footwear · Made with care in Nigeria</small></footer></>;
}
