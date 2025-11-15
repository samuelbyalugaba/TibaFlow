import Image from 'next/image';
import type { SVGProps } from 'react';

export function Logo(props: Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> & { width?: number, height?: number, className?: string }) {
  const { width = 28, height = 28, className, ...rest } = props;
  return (
    <Image
      src="/TibaFLow.png"
      alt="TibaFlow Logo"
      width={width}
      height={height}
      className={className}
      {...rest}
    />
  );
}
