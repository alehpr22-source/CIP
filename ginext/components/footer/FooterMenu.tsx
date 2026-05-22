import { motion } from 'framer-motion';
import { footerLinks } from '@/constants/data';
import Link from 'next/link';

const footerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export const FooterMenu = () => {
  return (
    <>
      <motion.div variants={footerItemVariants} className='text-center'>
        <h4 className='font-semibold mb-3 text-background/90'>Proceso</h4>
        <ul className='space-y-2'>
          {footerLinks.proceso.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className='text-background/60 hover:text-red-400 text-sm transition'>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div variants={footerItemVariants} className='text-center'>
        <h4 className='font-semibold mb-3 text-background/90'>Legal</h4>
        <ul className='space-y-2'>
          {footerLinks.legal.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className='text-background/60 hover:text-red-400 text-sm transition'>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>
    </>
  );
};
