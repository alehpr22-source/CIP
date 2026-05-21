type AuthCardProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <main className='min-h-screen bg-gray-50 flex items-center justify-center px-6 py-10'>
      <div className='w-full max-w-md'>
        <div className='bg-white rounded-[32px] shadow-2xl overflow-hidden'>
          <div className='bg-red-700 px-8 py-10 text-white text-center'>
            <h1 className='text-4xl font-bold'>{title}</h1>
            {subtitle && <p className='mt-3 text-red-100'>{subtitle}</p>}
          </div>
          <div className='p-8 space-y-6'>{children}</div>
        </div>
      </div>
    </main>
  );
}
