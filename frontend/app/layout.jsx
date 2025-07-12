import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { SwapProvider } from '@/contexts/SwapContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SkillSwap - Exchange Skills, Learn Together',
  description: 'Connect with others to exchange skills and learn together. Build your expertise while helping others grow theirs.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <SwapProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </SwapProvider>
        </AuthProvider>
      </body>
    </html>
  );
}