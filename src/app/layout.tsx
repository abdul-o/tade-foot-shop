import type { Metadata } from 'next';
import './globals.css';
import { StoreShell } from '@/components/store-shell';
export const metadata: Metadata = { title: 'Tade Footwear — Made by hand. Made to go places.', description: 'Thoughtful handmade shoes, made in Nigeria for wherever life takes you.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><StoreShell>{children}</StoreShell></body></html>;
}
