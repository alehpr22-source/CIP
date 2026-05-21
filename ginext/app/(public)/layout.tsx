import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <Header />
      <main className='flex-1 pt-24'>
        {children}
      </main>
      <Footer />
    </div>
  );
}
