import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21.3,12.2a6.3,6.3,0,0,0-5.2-5.4" />
      <path d="M3.9,8.5a6.3,6.3,0,0,0,0,7" />
      <path d="M11.6,2.7a6.3,6.3,0,0,0-7,0" />
      <path d="M12.4,21.3a6.3,6.3,0,0,0,7,0" />
      <path d="M17.5,3.9a6.3,6.3,0,0,0-7,0" />
      <path d="M8.5,20.1a6.3,6.3,0,0,0,7,0" />
      <path d="M2.7,12.4a6.3,6.3,0,0,0,5.4,5.2" />
      <path d="M20.1,8.5a6.3,6.3,0,0,0,0-7" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}
