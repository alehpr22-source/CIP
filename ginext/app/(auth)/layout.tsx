export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center px-6 py-10'>
      {children}
    </div>
  );
}
