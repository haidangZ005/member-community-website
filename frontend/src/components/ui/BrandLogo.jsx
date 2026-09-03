export default function BrandLogo({ className = '' }) {
  return (
    <svg className={`brand-logo ${className}`} viewBox="0 0 330 112" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 19 49 91c4 8 9 8 13 0l35-66c2-4 6-6 11-6h63c18 0 29 9 29 22s-11 22-29 22h-58v29" />
        <path d="m171 63 29 29h25c15 0 23-9 23-28V39c0-12 5-19 14-19s14 7 14 19v53m0-53c0-12 5-19 14-19s15 7 15 19v53" />
      </g>
    </svg>
  );
}
