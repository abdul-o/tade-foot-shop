'use client';
import { money, type Product } from '@/lib/products';
export function ProductCard({ product }: { product: Product }) {
  function add() { const cart = JSON.parse(localStorage.getItem('tade-cart') || '[]'); const found = cart.find((x: {id:string}) => x.id === product.id); if (found) found.quantity++; else cart.push({ id: product.id, quantity: 1, size: '39' }); localStorage.setItem('tade-cart', JSON.stringify(cart)); window.dispatchEvent(new Event('tade-cart-change')); }
  return <article className="product-card"><div className="product-photo" style={{ backgroundImage: `url(https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=900&q=85)` }}><span className="product-tag">{product.tag}</span><button className="quick-add" onClick={add} aria-label={`Add ${product.name} to bag`}>＋</button></div><div className="product-copy"><div><span className="product-type">{product.category}</span><h3>{product.name}</h3><span className="product-color">{product.color}</span></div><strong>{money(product.price)}</strong></div></article>;
}
