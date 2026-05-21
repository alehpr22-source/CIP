'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { phoneMockup1 } from '@/assets';

export const HeroSection = () => {
  return (
    <section className='relative min-h-[80vh] pt-16 md:pt-20 pb-16 overflow-hidden bg-red-600 text-white w-full'>
      <div className='absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none'>
        <motion.div
          className='absolute top-20 right-20 size-72 rounded-full bg-white/10 blur-3xl'
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className='absolute bottom-40 right-40 size-96 rounded-full bg-black/10 blur-3xl'
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      </div>

      <div className='container relative z-10'>
        <div className='grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(80vh-100px)]'>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className='text-center lg:text-left'
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white font-sora'
            >
              Realiza el Proceso de Tu Colegiatura Profesional
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className='section-description md:text-xl max-w-xl mx-auto lg:mx-0 text-white/80 mt-4'
            >
              Valida tus requisitos, gestiona paso a paso
              la obtención de tu carnet de ingeniero en nuestra plataforma interactiva.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className='mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'
            >
              <motion.a href='#proceso' className='w-full sm:w-auto' whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }}>
                <Button size='lg' className='w-full gap-2 bg-white text-red-600 hover:bg-white/90 font-semibold px-8'>
                  Proceso
                </Button>
              </motion.a>
              <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }} className='w-full sm:w-auto'>
                <Link href='/login'>
                  <Button size='lg' className='w-full gap-2 bg-white text-red-600 hover:bg-white/90 font-semibold px-8'>
                    Iniciar Sesión
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className='mt-4 text-center lg:text-left'
            >
              <span className='text-white/60 text-sm'>
                ¿No tienes cuenta?{' '}
                <Link href='/register' className='text-white font-medium underline underline-offset-4 hover:text-white/80 transition'>
                  Regístrate aquí
                </Link>
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            className='relative flex items-center justify-center h-auto w-full'
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: [0, 1], y: [50, 0], scale: [0.95, 1] }}
              transition={{ delay: 0.4, duration: 0.8 }}
              whileHover={{ scale: 1.02, rotate: 1 }}
              className='w-full max-w-md lg:max-w-md aspect-[3/4] relative rounded-2xl overflow-hidden drop-shadow-2xl border-4 border-white/20 cursor-pointer'
            >
              <Image
                src={phoneMockup1.src || phoneMockup1}
                alt='Vista Principal del Simulador del Gremio de Ingenieros'
                width={500}
                height={666}
                className='w-full h-full object-cover'
                priority
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
