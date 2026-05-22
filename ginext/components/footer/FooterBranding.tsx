import { motion } from 'framer-motion';

const footerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export const FooterBranding = () => {
  return (
    <>
      <motion.div variants={footerItemVariants} className='text-center md:text-left'>
        <h3 className='text-xl font-bold mb-3'>
          <span className='text-red-500'>Gremio de Ingenieros</span>
        </h3>
        <p className='text-background/60 text-sm leading-relaxed'>
          Plataforma oficial para la gestión del proceso de obtención del carnet de ingeniero.
        </p>
      </motion.div>

      <motion.div
        variants={footerItemVariants}
        className='w-full pt-6 border-t border-background/10 text-background/40 text-sm text-center'
      >
        &copy; {new Date().getFullYear()} Gremio de Ingenieros. Todos los derechos reservados.
      </motion.div>
    </>
  );
};
