import Image from 'next/image';
import type { SVGProps } from 'react';

export function Logo(props: Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> & { width?: number, height?: number }) {
  const { width = 28, height = 28, ...rest } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <rect width="28" height="28" rx="8" fill="currentColor" />
      <path
        d="M8 12C8 10.9 8.9 10 10 10H18C19.1 10 20 10.9 20 12V18C20 19.1 19.1 20 18 20H10C8.9 20 8 19.1 8 18V12Z"
        stroke="white"
        strokeWidth="2"
      />
      <path
        d="M12 10V8H16V10"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
