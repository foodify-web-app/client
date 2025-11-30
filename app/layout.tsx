'use client';

import './globals.css';
import { Poppins } from 'next/font/google';
import { Navbar } from '@/components/navbar';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider, useCart } from '@/context/cart-context';
import { AuthProvider } from '@/context/auth-context';
import { WishlistProvider } from '@/context/wishlist-context';
import { Providers } from './providers';
import { usePathname } from 'next/navigation';

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideNavbar = pathname.startsWith("/admin");


  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Providers>
                <main className="dark:bg-black min-h-screen">
                  {!hideNavbar && <Navbar />}
                  {children}
                </main>
                <Toaster />
              </Providers>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

// export const metadata = {
//   generator: 'v0.app'
// };
