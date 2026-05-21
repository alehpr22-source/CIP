import {
  Shield,
  Headphones,
  Zap,
  Lock,
  Mail,
  Phone,
  MapPin,
  Download,
  Users,
  Star,
  Globe,
  CreditCard,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';

/* ********************************** */
/*               HEADER               */
/* ********************************** */

type NavItem = {
  key: string;
  href: string;
  label: string;
};

export const navItems: NavItem[] = [
  {
    key: 'nav.home',
    href: '#',
    label: 'Inicio',
  },
  {
    key: 'nav.features',
    href: '#features',
    label: 'Características',
  },
  { key: 'nav.stats', href: '#stats', label: 'Estadísticas' },
  {
    key: 'nav.testimonials',
    href: '#testimonials',
    label: 'Testimonios',
  },
  { key: 'nav.contact', href: '#contact', label: 'Contacto' },
];

/* ********************************** */
/*              PARTNERS              */
/* ********************************** */

type Partner = {
  name: string;
  logo: string;
};

export const partners: Partner[] = [
  { name: 'Visa', logo: 'VISA' },
  { name: 'Mastercard', logo: 'mastercard' },
  { name: 'PayPal', logo: 'PayPal' },
  { name: 'Stripe', logo: 'stripe' },
  { name: 'Apple Pay', logo: 'Apple Pay' },
];

/* ********************************** */
/*                STATS               */
/* ********************************** */
type Stat = {
  icon: LucideIcon;
  value: number;
  suffix: string;
  label: string;
  color: string;
  bgColor: string;
  isDecimal?: boolean;
};

export const stats: Stat[] = [
  {
    icon: Download,
    value: 1200000,
    suffix: '+',
    label: 'Descargas',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Users,
    value: 40000,
    suffix: '+',
    label: 'Usuarios Activos',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: Star,
    value: 4.8,
    suffix: '',
    label: 'Calificación',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    isDecimal: true,
  },
  {
    icon: Globe,
    value: 150,
    suffix: '+',
    label: 'Países',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: CreditCard,
    value: 50,
    suffix: 'M+',
    label: 'Transacciones',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: TrendingUp,
    value: 99.9,
    suffix: '%',
    label: 'Disponibilidad',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    isDecimal: true,
  },
];

/* ********************************** */
/*              FEATURES              */
/* ********************************** */
type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const features: Feature[] = [
  {
    icon: Shield,
    title: 'Seguridad Bancaria',
    description:
      'Tus datos están protegidos con encriptación de 256 bits y protocolos de seguridad avanzados.',
  },
  {
    icon: Headphones,
    title: 'Soporte 24/7',
    description:
      'Nuestro equipo dedicado está siempre listo para ayudarte con cualquier pregunta o problema.',
  },
  {
    icon: Zap,
    title: 'Control Total',
    description:
      'Gestiona todas tus cuentas, tarjetas y transacciones desde un panel intuitivo.',
  },
  {
    icon: Lock,
    title: 'Transferencias Instantáneas',
    description:
      'Envía y recibe dinero al instante sin comisiones a otros usuarios de Finova.',
  },
];

/* ********************************** */
/*            TESTIMONIALS            */
/* ********************************** */

type Testimonial = {
  name: string;
  date: string;
  content: string;
  avatar: string;
};

export const testimonials: Testimonial[] = [
  {
    name: 'María García',
    date: '24 Jul 2024',
    content:
      'Finova ha sido un cambio radical para mis metas de ahorro. El diseño intuitivo de la app me ayuda a controlar mi presupuesto y ver exactamente a dónde va mi dinero.',
    avatar: 'MG',
  },
  {
    name: 'Carlos Rodríguez',
    date: '18 Ago 2024',
    content:
      'Confío en Finova con mis finanzas por sus características de seguridad. Además, la app es tan fácil de usar que gestionar mi dinero nunca ha sido tan sencillo.',
    avatar: 'CR',
  },
  {
    name: 'Ana Martínez',
    date: '5 Sep 2024',
    content:
      'Los análisis en tiempo real han cambiado completamente cómo gestiono mis inversiones. Puedo seguir todo en un solo lugar y tomar decisiones informadas rápidamente.',
    avatar: 'AM',
  },
];

/* ********************************** */
/*               CONTACT              */
/* ********************************** */

type ContactInfo = {
  icon: LucideIcon;
  value: string;
};

export const contactInfo: ContactInfo[] = [
  { icon: Mail, value: 'hello@finova.com' },
  { icon: Phone, value: '+1 (555) 123-4567' },
  { icon: MapPin, value: 'San Francisco, CA' },
];

/* ********************************** */
/*               FOOTER               */
/* ********************************** */


export const footerLinks: Record<string, string[]> = {
  product: [
    'Características',
    'Precios',
    'Seguridad',
    'Actualizaciones',
  ],
  company: ['Nosotros', 'Empleos', 'Blog', 'Prensa'],
  legal: ['Privacidad', 'Términos', 'Cookies', 'Licencias'],
};
