export type Product = { id: string; name: string; category: string; price: number; tag: string; image: string; color: string };
export const products: Product[] = [
  { id: 'adire-slide', name: 'Adire Ease Slide', category: 'Everyday slides', price: 28500, tag: 'BESTSELLER', image: 'photo-1543163521-1bf539c55dd2', color: 'Indigo / Natural' },
  { id: 'aso-oke-mule', name: 'Aso-Oke Sunday Mule', category: 'Heritage edit', price: 42000, tag: 'HANDWOVEN', image: 'photo-1543163521-1bf539c55dd2', color: 'Sand / Cocoa' },
  { id: 'lagos-stride', name: 'Lagos Stride Sandal', category: 'Leather sandals', price: 36000, tag: 'NEW ARRIVAL', image: 'photo-1562273138-f46be4ebdf33', color: 'Cognac' },
  { id: 'oluwa-loafer', name: 'Oluwa Soft Loafer', category: 'Made for more', price: 58000, tag: 'SMALL BATCH', image: 'photo-1531310197839-ccf54634509e', color: 'Espresso' },
];
export const money = (value: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(value);
