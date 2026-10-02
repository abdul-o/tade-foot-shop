import Link from 'next/link';
export default function Success() { return <section className="success-page"><span>✳</span><span className="eyebrow">THAT’S A GOOD STEP</span><h1>Thank you.</h1><p>Your payment is being confirmed. We’ll send your order details by email shortly.</p><Link className="button button-dark" href="/">Back to the shop ↗</Link></section>; }
