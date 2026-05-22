'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { UserMenu } from './ui/UserMenu';
import { Logo } from './Logo';
import { adminNavItems, userNavItem } from '@/constants/data';
import { useAuth } from '@/hooks/useAuth';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { usuario, loading, signOut, hasRole } = useAuth();

  async function handleLogout() {
    await signOut();
    window.location.href = '/';
  }

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className='fixed top-0 left-0 right-0 z-50 bg-white border-b border-red-200'
      >
        <div className='container'>
          <div className='flex items-center justify-between h-16 md:h-20'>
            <Logo />

            <nav className='hidden lg:flex items-center gap-8'>
              {hasRole('USER') && (
                <Link
                  href={userNavItem.href}
                  className='text-sm font-medium text-gray-600 hover:text-red-600 transition-colors'
                >
                  {userNavItem.label}
                </Link>
              )}
              {hasRole('ADMIN') && adminNavItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className='text-sm font-medium text-red-600 hover:text-red-700 transition-colors'
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className='flex items-center gap-4'>
              <div className='hidden lg:flex items-center gap-4'>
                {!loading && usuario && (
                  <UserMenu usuario={usuario} onSignOut={handleLogout} variant='inline' />
                )}
                {!loading && !usuario && (
                  <Link href='/login'>
                    <Button className='bg-red-600 hover:bg-red-700 text-white'>
                      Iniciar sesión
                    </Button>
                  </Link>
                )}
              </div>
              <Button
                variant='ghost'
                size='icon'
                className='lg:hidden text-red-600'
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className='size-5' /> : <Menu className='size-5' />}
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
              className='fixed inset-0 bg-black/50 z-40'
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className='fixed top-0 right-0 h-full w-[75vw] max-w-sm bg-white z-50 shadow-2xl overflow-y-auto'
            >
              <div className='flex items-center justify-between p-4 border-b border-red-200'>
                <Link href='/' onClick={() => setIsOpen(false)} className='text-lg font-bold text-red-700 font-sora'>
                  Gremio de Ingenieros
                </Link>
                <Button variant='ghost' size='icon' className='text-red-600' onClick={() => setIsOpen(false)}>
                  <X className='size-5' />
                </Button>
              </div>

              <nav className='p-4 flex flex-col gap-1'>
                {hasRole('USER') && (
                  <Link
                    href={userNavItem.href}
                    className='py-3 px-4 text-gray-700 hover:bg-red-50 rounded-lg transition-colors font-medium'
                    onClick={() => setIsOpen(false)}
                  >
                    {userNavItem.label}
                  </Link>
                )}
                {hasRole('ADMIN') && adminNavItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className='py-3 px-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium'
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className='p-4 border-t border-red-200 mt-auto'>
                {!loading && usuario ? (
                  <div className='space-y-3'>
                    <UserMenu usuario={usuario} onSignOut={handleLogout} variant='block' />
                  </div>
                ) : (
                  <Link href='/login' onClick={() => setIsOpen(false)}>
                    <Button className='w-full bg-red-600 hover:bg-red-700 text-white'>
                      Iniciar sesión
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
