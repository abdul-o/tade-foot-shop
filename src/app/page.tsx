import { ProductCard } from '@/components/product-card';
import { products } from '@/lib/products';
import { createClient } from '@supabase/supabase-js';
async function getCatalog() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return products;
  try {
    const db = createClient(url, key);
    const { data, error } = await db.from('products').select('id,name,category,price_kobo,image,color,tag').eq('active', true).order('created_at');
    if (error || !data?.length) return products;
    return data.map(p => ({ ...p, price: Math.round(p.price_kobo / 100) }));
  } catch { return products; }
}
export default async function Home() {
  const catalog = await getCatalog();
  return <>
    <section className="hero"><div className="hero-copy"><span className="eyebrow"><i/> THE TADE WAY · LAGOS, NIGERIA</span><h1>Good things<br/>take <em>steps.</em></h1><p>Thoughtful shoes, made by hand and made to feel like you. Find your new favourite pair.</p><a className="button button-dark" href="#shop">Find your pair <span>↗</span></a><div className="hero-note"><span>✳</span> Small batches. Big heart. Always.</div></div><div className="hero-image"><div className="hero-image-caption">THE EVERYDAY EDIT <span>01 / 04</span></div><span className="sun-stamp">MADE<br/>WITH<br/>INTENTION</span></div><div className="hero-side-label">MADE IN LAGOS · WORN EVERYWHERE</div></section>
    <section className="trust-row"><span>✳ &nbsp;Designed to live in</span><span>◇ &nbsp;Crafted by local hands</span><span>✿ &nbsp;Made in small batches</span><span>↗ &nbsp;Free delivery over ₦75k</span></section>
    <section className="shop-section" id="shop"><div className="section-heading"><div><span className="eyebrow">A GOOD PLACE TO START</span><h2>Meet your <em>next pair.</em></h2></div><a href="#all" className="text-link">Shop all styles <span>↗</span></a></div><div className="product-grid">{catalog.map(p => <ProductCard key={p.id} product={p}/>)}</div><div className="shop-bottom"><span>Made in small batches, just for you.</span><a className="button button-outline" href="/checkout">Go to your bag <span>→</span></a></div></section>
    <section className="craft-band" id="craft"><div className="craft-art"><span className="art-ring">TADE&nbsp; ✳ &nbsp;TADE&nbsp; ✳ &nbsp;TADE&nbsp; ✳</span><span className="art-mark">t.</span></div><div className="craft-copy"><span className="eyebrow">A LITTLE MORE THAN SHOES</span><h2>Made by hand.<br/>Made to <em>go places.</em></h2><p>Every pair begins with a sketch, a good piece of leather, and skilled hands in Lagos. We keep our runs small so the care never gets lost in the making.</p><a className="text-link" href="#story">A note from our makers <span>↗</span></a></div></section>
    <section className="quote" id="story"><span>✳</span><blockquote>“The best shoes don't ask you to choose between feeling good and looking like yourself.”</blockquote><small>THE TADE PROMISE</small></section>
    <section className="newsletter"><span className="eyebrow">A NOTE NOW AND THEN</span><h2>Good things are <em>on the way.</em></h2><p>New drops, care tips, and little things worth opening.</p><form action="mailto:hello@tadefootwear.com" method="get"><input aria-label="Your email address" type="email" placeholder="Your email address" required/><button>Count me in ↗</button></form><small>No noise, just the good stuff.</small></section>
  </>;
}
