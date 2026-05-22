import { motion } from 'framer-motion';
import { contactInfo } from '@/constants/data';

const footerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export const FooterContact = () => {
  return (
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
  );
};
