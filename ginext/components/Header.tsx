'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { UserMenu } from './ui/UserMenu';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { href: '#', label: 'Inicio' },
  { href: '#proceso', label: 'Proceso' },
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { usuario, loading, signOut } = useAuth();
  const router = useRouter();

  if (usuario) return null;

  async function handleLogout() {
    await signOut();
    router.push('/');
  }

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className='fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border'
      >
        <div className='container'>
          <div className='flex items-center justify-between h-16 md:h-20'>
            <Link
              href='/'
              className='text-2xl font-bold text-foreground font-sora'
            >
              <span className='bg-gradient-to-r from-foreground to-red-600 bg-clip-text text-transparent'>
                Gremio de Ingenieros
              </span>
            </Link>

            <nav className='hidden lg:flex items-center gap-8'>
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className='text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className='flex items-center gap-4'>
              {!loading && (
                usuario ? (
                  <div className='hidden lg:flex items-center gap-4'>
                    <UserMenu usuario={usuario} onSignOut={handleLogout} variant='inline' />
                  </div>
                ) : (
                  <Link href='/login'>
                    <Button className='hidden lg:flex bg-red-600 hover:bg-red-700 text-white'>
                      Iniciar sesión
                    </Button>
                  </Link>
                )
              )}

              <Button
                variant='ghost'
                size='icon'
                className='lg:hidden'
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className='size-5' /> : <Menu className='size-5' />}
              </Button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className='lg:hidden bg-card border-t border-border overflow-hidden'
            >
              <nav className='container px-4 py-4 flex flex-col gap-2'>
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className='py-3 px-4 text-foreground hover:bg-muted rounded-lg transition-colors'
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}

                {usuario ? (
                  <UserMenu usuario={usuario} onSignOut={handleLogout} variant='block' />
                ) : (
                  <Link href='/login'>
                    <Button className='mt-2 w-full bg-red-600 hover:bg-red-700 text-white'>
                      Iniciar sesión
                    </Button>
                  </Link>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(false)}
            className='fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden'
            style={{ top: '64px' }}
          />
        )}
      </AnimatePresence>
    </>
  );
};
