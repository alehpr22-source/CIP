import { Mail, Phone, MapPin } from 'lucide-react';

export const adminNavItems = [
  { href: '/admin/solicitudes', label: 'Solicitudes' },
  { href: '/admin/colegiados', label: 'Colegiados' },
];

export const userNavItem = { href: '/postulante', label: 'Solicitud' };

export const footerLinks = {
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

export const contactInfo = [
  { icon: Mail, value: 'contacto@gremioingenieros.pe' },
  { icon: Phone, value: '(01) 234-5678' },
  { icon: MapPin, value: 'Lima, Perú' },
];
