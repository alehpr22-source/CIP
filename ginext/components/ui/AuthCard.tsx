type AuthCardProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <>
      <div className='hidden lg:block w-full max-w-md'>
        <div className='bg-white rounded-[32px] shadow-2xl overflow-hidden'>
          <div className='bg-red-700 px-8 py-10 text-white text-center'>
            <h1 className='text-4xl font-bold'>{title}</h1>
            {subtitle && <p className='mt-3 text-red-100'>{subtitle}</p>}
          </div>
          <div className='p-8 space-y-6'>{children}</div>
        </div>
      </div>

      <div className='lg:hidden w-full max-w-md mx-auto'>
        <div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
          <div className='bg-red-700 px-6 py-8 text-white text-center'>
            <h1 className='text-2xl font-bold'>{title}</h1>
            {subtitle && <p className='mt-2 text-red-100 text-sm'>{subtitle}</p>}
          </div>
          <div className='p-6 space-y-6'>{children}</div>
        </div>
      </div>
    </>
  );
}
