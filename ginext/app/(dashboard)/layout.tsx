'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserMenu } from '@/components/ui/UserMenu';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { usuario, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    ...(usuario?.role === 'ADMIN'
      ? [{ href: '/admin/solicitudes', label: 'Admin' }]
      : []),
  ];

  async function handleSignOut() {
    await signOut();
    router.push('/login');
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      <header className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between'>
          <div className='flex items-center gap-6'>
            <Link
              href='/dashboard'
              className='text-2xl font-bold text-red-600'
            >
              GI
            </Link>

            <nav className='hidden md:flex items-center gap-4'>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'font-medium transition px-3 py-1.5 rounded-lg',
                    pathname === link.href
                      ? 'text-red-700 bg-red-50'
                      : 'text-gray-700 hover:text-red-600 hover:bg-red-50/50'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className='hidden md:flex items-center gap-4'>
            <UserMenu usuario={usuario} onSignOut={handleSignOut} variant='inline' />
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className='md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition'
            aria-label='Abrir menú'
          >
            {mobileOpen ? <X className='size-6' /> : <Menu className='size-6' />}
          </button>
        </div>

        {mobileOpen && (
          <div className='md:hidden border-t border-gray-100 bg-white px-4 py-4'>
            <nav className='space-y-1 mb-3'>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'block font-medium transition px-3 py-2 rounded-lg',
                    pathname === link.href
                      ? 'text-red-700 bg-red-50'
                      : 'text-gray-700 hover:text-red-600 hover:bg-red-50/50'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <UserMenu usuario={usuario} onSignOut={handleSignOut} variant='block' />
          </div>
        )}
      </header>

      <main>{children}</main>
    </div>
  );
}
