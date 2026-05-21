'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  proceso: [
    { label: 'Crear cuenta', href: '/register' },
    { label: 'Iniciar sesión', href: '/login' },
    { label: 'Requisitos', href: '#proceso' },
  ],
  legal: [
    { label: 'Términos y condiciones', href: '#' },
    { label: 'Política de privacidad', href: '#' },
  ],
};

const contactInfo = [
  { icon: Mail, value: 'contacto@gremioingenieros.pe' },
  { icon: Phone, value: '(01) 234-5678' },
  { icon: MapPin, value: 'Lima, Perú' },
];

const footerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const footerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export const Footer = () => {
  return (
    <footer className='bg-foreground text-background py-12 md:py-16'>
      <motion.div
        className='container'
        variants={footerContainerVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-50px' }}
      >
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-10'>
          <motion.div variants={footerItemVariants} className='text-center md:text-left'>
            <h3 className='text-xl font-bold mb-3'>
              <span className='text-red-500'>Gremio de Ingenieros</span>
            </h3>
            <p className='text-background/60 text-sm leading-relaxed'>
              Plataforma oficial para la gestión del proceso de obtención del carnet de ingeniero.
            </p>
          </motion.div>

          <motion.div variants={footerItemVariants} className='text-center'>
            <h4 className='font-semibold mb-3 text-background/90'>Proceso</h4>
            <ul className='space-y-2'>
              {footerLinks.proceso.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className='text-background/60 hover:text-red-400 text-sm transition'>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={footerItemVariants} className='text-center md:text-left'>
            <h4 className='font-semibold mb-3 text-background/90'>Contacto</h4>
            <ul className='space-y-2'>
              {contactInfo.map((item) => (
                <li key={item.value} className='flex items-center justify-center md:justify-start gap-2 text-background/60 text-sm'>
                  <item.icon className='size-4 shrink-0' />
                  <span>{item.value}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          variants={footerItemVariants}
          className='w-full pt-6 border-t border-background/10 text-background/40 text-sm text-center'
        >
          &copy; {new Date().getFullYear()} Gremio de Ingenieros. Todos los derechos reservados.
        </motion.div>
      </motion.div>
    </footer>
  );
};
