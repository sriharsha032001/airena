import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="w-full py-6 px-5 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm"
      style={{
        borderTop: '1px solid var(--color-border)',
        background: 'var(--color-bg-subtle)',
        color: 'var(--color-text-secondary)',
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-5 h-5 rounded flex items-center justify-center font-bold text-[9px] text-white"
          style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)' }}
        >
          Ai
        </div>
        <span>&copy; {new Date().getFullYear()} AIrena. All rights reserved.</span>
      </div>
      <div className="flex items-center gap-6">
        <Link
          href="/about"
          className="transition-colors duration-150 no-underline text-sm hover:text-black"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          About
        </Link>
        <Link
          href="/privacy"
          className="transition-colors duration-150 no-underline text-sm hover:text-black"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Privacy
        </Link>
        <Link
          href="/contact"
          className="transition-colors duration-150 no-underline text-sm hover:text-black"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Contact
        </Link>
      </div>
    </footer>
  );
}
