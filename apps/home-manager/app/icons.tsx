// Bespoke stroke icons. Deliberately not emoji: an emoji renders differently on
// every device, carries a skin tone and a gender it was never asked to carry,
// and at 18px in a nav row it reads as a smudge.

type P = { size?: number };
const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export function IconHome({ size = 18 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V20h13V9.5" />
      <path d="M9.5 20v-5.5h5V20" />
    </svg>
  );
}

export function IconCalendar({ size = 18 }: P) {
  return (
    <svg {...base(size)}>
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

export function IconList({ size = 18 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M4 7h2M4 12h2M4 17h2" />
      <path d="M10 7h10M10 12h10M10 17h10" />
    </svg>
  );
}

export function IconKids({ size = 18 }: P) {
  return (
    <svg {...base(size)}>
      <circle cx="9" cy="7.5" r="3" />
      <path d="M3.5 20c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
      <circle cx="17.5" cy="10" r="2.2" />
      <path d="M14.5 20c0-2.2 1.4-3.6 3-3.6s3 1.4 3 3.6" />
    </svg>
  );
}

export function IconMoney({ size = 18 }: P) {
  return (
    <svg {...base(size)}>
      <rect x="2.5" y="6" width="19" height="12" rx="2.5" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  );
}

export function IconBill({ size = 18 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M6 3h12v18l-3-1.6-3 1.6-3-1.6L6 21z" />
      <path d="M9.5 8h5M9.5 12h5" />
    </svg>
  );
}

export function IconChart({ size = 18 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M4 20V4" />
      <path d="M4 20h16" />
      <path d="M8 16v-4M12.5 16V8M17 16v-6" />
    </svg>
  );
}

export function IconPeople({ size = 18 }: P) {
  return (
    <svg {...base(size)}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 19.5c0-3.1 2.7-5.3 6-5.3s6 2.2 6 5.3" />
      <path d="M16.5 5.4a3.2 3.2 0 0 1 0 5.9" />
      <path d="M18 14.6c2 .7 3.4 2.5 3.4 4.9" />
    </svg>
  );
}

export function IconClock({ size = 18 }: P) {
  return (
    <svg {...base(size)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function IconCheck({ size = 16 }: P) {
  return (
    <svg {...base(size)} strokeWidth={2.4}>
      <path d="M4.5 12.5 9.5 17.5 19.5 6.5" />
    </svg>
  );
}

export function IconMenu({ size = 20 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

/** The mark: a roof over a hearth. */
export function HomeMark({ size = 20 }: P) {
  return (
    <svg {...base(size)} strokeWidth={1.8}>
      <path d="M3.5 11 12 3.8 20.5 11" />
      <path d="M6 10v9.5h12V10" />
      <rect x="10" y="14" width="4" height="5.5" rx="0.8" />
    </svg>
  );
}
