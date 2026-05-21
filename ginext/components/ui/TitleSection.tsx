import { cn } from '@/lib/utils';

interface Props {
  title: string;
  className?: string;
}

export const TitleSection = ({ title, className }: Props) => {
  return (
    <h2
      className={cn(
        'text-3xl md:text-4xl lg:text-5xl font-bold',
        className
      )}
    >
      {title}
    </h2>
  );
};
