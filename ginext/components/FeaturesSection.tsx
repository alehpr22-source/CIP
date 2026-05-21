'use client';

import { motion } from 'framer-motion';
import {
  UserCheck,
  Upload,
  SearchCheck,
  IdCard,
} from 'lucide-react';

import { TitleSection } from '@/components/ui/TitleSection';

const features = [
  {
    icon: UserCheck,
    title: 'Crea tu Cuenta',
    description:
      'Regístrate utilizando tu DNI. El sistema validará automáticamente tus datos personales mediante RENIEC.',
  },
  {
    icon: Upload,
    title: 'Envía tus Documentos',
    description:
      'Adjunta tu fotografía, título profesional, comprobante de pago y demás documentos requeridos para la colegiatura.',
  },
  {
    icon: SearchCheck,
    title: 'Revisión de Solicitud',
    description:
      'El personal administrativo revisará tu información y documentos. Si existe alguna observación, podrás corregirla y reenviar tu solicitud.',
  },
  {
    icon: IdCard,
    title: 'Obtén tu Carnet Digital',
    description:
      'Una vez aprobada tu solicitud, se generará automáticamente tu número de colegiado y tu carnet digital.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export const FeaturesSection = () => {
  return (
    <section
      id='proceso'
      className='section-padding scroll-mt-24 bg-gray-50'
    >
      <div className='container'>
        <motion.div
          className='section-header-wrapper'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <TitleSection title='Proceso de Colegiatura' />
          <p className='section-description'>
            Realiza todo tu proceso de colegiatura de manera
            virtual, segura y desde cualquier lugar.
          </p>
        </motion.div>

        <motion.div
          className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, margin: '-50px' }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className='bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-xl transition-shadow group cursor-default'
            >
              <div className='size-14 rounded-2xl bg-red-100 text-red-800 flex items-center justify-center mb-6 group-hover:bg-red-800 transition-all'>
                <feature.icon className='size-7 group-hover:text-white transition-colors' />
              </div>

              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                {feature.title}
              </h3>

              <p className='text-gray-600 leading-relaxed'>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
