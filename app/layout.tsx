import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { CartCoinsProvider } from '@/contexts/CartCoinsContext'
import { WishlistProvider } from '@/contexts/WishlistContext'
import WhatsAppButton from '@/components/WhatsAppButton'
import SignupPromotionPopup from '@/components/SignupPromotionPopup'
import SupportChatbot from '@/components/SupportChatbot'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Agnishila - The Fire Within',
  description: 'Premium Himalayan wellness products to awaken your inner fire. Shilajit, Ashwagandha gummies and more.',
  icons: {
    icon: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090440/agnishila/logo/WhatsApp_Image_2025-11-01_at_11.59.11_e8d2c796-removebg-preview.png',
    shortcut: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090440/agnishila/logo/WhatsApp_Image_2025-11-01_at_11.59.11_e8d2c796-removebg-preview.png',
    apple: 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090440/agnishila/logo/WhatsApp_Image_2025-11-01_at_11.59.11_e8d2c796-removebg-preview.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AuthProvider>
            <CartProvider>
              <CartCoinsProvider>
                <WishlistProvider>
                  {children}
                  <WhatsAppButton />
                  <SupportChatbot />
                  <SignupPromotionPopup />
                </WishlistProvider>
              </CartCoinsProvider>
            </CartProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}