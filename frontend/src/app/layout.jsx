import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import { UserProvider } from '@/context/UserContext'; 
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AudioPlayer from '@/components/audio/AudioPlayer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Islamic Stories - Stories for Kids in Hindi',
  description: 'Listen to authentic Islamic stories for children in Hindi. Based on Ahle Sunnat Wal Jamaat teachings.',
  keywords: 'islamic stories, kids stories hindi, muslim stories, prophets stories',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <UserProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <AudioPlayer />
          </div>
          </UserProvider>
        </Providers>
      </body>
    </html>
  );
}