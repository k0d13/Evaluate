import type { SVGProps } from 'react';

/**
 * The Evaluate logo. Keep in sync with `apps/website/public/icon.svg`, the source for the generated
 * icons.
 */
export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" aria-hidden="true" {...props}>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="72"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M84 158 L226 236 L84 314" />
        <path d="M232 368 H420" />
      </g>
    </svg>
  );
}
