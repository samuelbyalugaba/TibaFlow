import Image from 'next/image';
import type { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

export function Logo(props: Omit<ImageProps, 'src' | 'alt'>) {
  const { className, ...rest } = props;
  return (
    <div className={cn("relative w-7 h-7", className)}>
      <Image
        src="/TibaFLow.png"
        alt="TibaFlow Logo"
        fill
        style={{ objectFit: 'contain' }}
        {...rest}
      />
    </div>
  );
}
