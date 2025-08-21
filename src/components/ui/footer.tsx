import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#e0e0e0] bg-white py-4 px-4 md:px-8 flex flex-col md:flex-row items-center justify-between text-sm text-[#444]" style={{ fontFamily: 'Open Sans, ui-sans-serif, sans-serif' }}>
      <div className="mb-2 md:mb-0">&copy; {new Date().getFullYear()} AIrena</div>
      <div className="flex gap-4">
        <Link href="/about" className="hover:underline hover:text-black transition">About</Link>
        <Link href="/privacy" className="hover:underline hover:text-black transition">Privacy Policy</Link>
        <Link href="/contact" className="hover:underline hover:text-black transition">Contact</Link>
      </div>
    </footer>
  );
} 