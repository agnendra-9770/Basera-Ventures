/** The brand mark: the dining-room arch, with a lamp lit inside it. */
export function ArchMark({ className, lamp = true }: { className?: string; lamp?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 40 52" fill="none" aria-hidden="true">
      <path
        d="M3 51V23.2C3 21.2 3.8 20 5 19.6C6 19.3 6.4 18.4 6.4 17.4C6.4 9.6 12.4 3.6 20 1.5C27.6 3.6 33.6 9.6 33.6 17.4C33.6 18.4 34 19.3 35 19.6C36.2 20 37 21.2 37 23.2V51"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {lamp && <circle cx="20" cy="29" r="3.2" fill="currentColor" className="arch-mark__lamp" />}
    </svg>
  )
}
