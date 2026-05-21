import { Check } from 'lucide-react';

type RequirementListProps = {
  items: string[];
};

export function RequirementList({
  items,
}: RequirementListProps) {
  return (
    <ul className='mt-2 space-y-1 text-xs text-gray-500'>
      {items.map((item) => (
        <li key={item} className='flex items-start gap-1.5'>
          <Check className='size-3 mt-0.5 shrink-0 text-red-500' />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
