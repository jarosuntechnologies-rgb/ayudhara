import type { Metadata } from 'next';
import './globals.css';
import Providers from '../components/Providers';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AiAssistant from '../components/AiAssistant';
import WhatsAppWidget from '../components/WhatsAppWidget';
import ScrollIndicators from '../components/ScrollIndicators';

export const metadata: Metadata = {
  title: 'Ayudhara Dairy | Organic A2 Cow & Buffalo Milk Delivery',
  description: 'Pure, organic, raw, and pasteurized A2 cow & buffalo milk delivered fresh within 4 hours of milking. Clean glass bottles, digital subscriptions.',
  keywords: ['milk delivery', 'A2 cow milk', 'organic buffalo milk', 'daily dairy subscription', 'fresh paneer', 'pure cow ghee', 'Bangalore dairy'],
  openGraph: {
    title: 'Ayudhara Dairy | Premium Fresh Milk Delivery',
    description: 'Experience pure goodness with Ayudhara Dairy. Farm-fresh milk in glass bottles delivered daily.',
    type: 'website',
    url: 'https://ayudharadairy.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <Providers>
          {/* Header/Navbar */}
          <Navbar />

          {/* Main content body */}
          <main className="flex-grow pt-16 sm:pt-20">
            {children}
          </main>

          {/* Footer */}
          <Footer />

          {/* Persistent widgets */}
          <AiAssistant />
          <WhatsAppWidget />
          <ScrollIndicators />
        </Providers>
      </body>
    </html>
  );
}
