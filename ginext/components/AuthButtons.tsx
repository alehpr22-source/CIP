import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { UserMenu } from './ui/UserMenu';
import { useAuth } from '@/hooks/useAuth';
import type { UsuarioRow } from '@/lib/supabase';

type AuthButtonsProps = {
  variant: 'inline' | 'block';
  onMobileClose?: () => void;
};

export const AuthButtons = ({ variant, onMobileClose }: AuthButtonsProps) => {
  const { usuario, loading, signOut } = useAuth();
  const router = useRouter();

  if (loading) return null;

  async function handleLogout() {
    await signOut();
    router.push('/');
  }

  function handleLogoutMobile() {
    handleLogout();
    onMobileClose?.();
  }

  const loginButtonClass = variant === 'inline'
    ? 'hidden lg:flex bg-red-600 hover:bg-red-700 text-white'
    : 'mt-2 w-full bg-red-600 hover:bg-red-700 text-white';

  if (!usuario) {
    return (
      <Link href='/login' onClick={onMobileClose}>
        <Button className={loginButtonClass}>
          Iniciar sesión
        </Button>
      </Link>
    );
  }

  return (
    <>
      <UserMenu
        usuario={usuario as UsuarioRow}
        onSignOut={variant === 'block' ? handleLogoutMobile : handleLogout}
        variant={variant}
      />
    </>
  );
};
