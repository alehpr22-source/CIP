'use client';

import { motion } from 'framer-motion';
import { FooterMenu } from './FooterMenu';
import { FooterContact } from './FooterContact';
import { FooterBranding } from './FooterBranding';

const footerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

export const Footer = () => {
  return (
    <footer className='bg-foreground text-background py-12 md:py-16'>
      <motion.div
        className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8'
        variants={footerContainerVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-50px' }}
      >
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-10'>
          <FooterBranding />
          <FooterMenu />
          <FooterContact />
        </div>
      </motion.div>
    </footer>
  );
};
