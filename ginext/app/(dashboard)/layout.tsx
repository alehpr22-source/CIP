import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen flex flex-col bg-gray-100'>
      <Header />
      <main className='flex-1 pt-16 md:pt-20'>{children}</main>
      <Footer />
    </div>
  );
}
