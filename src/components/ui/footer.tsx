import Link from "next/link";

const footerLinks = [
  { href: "/pricing-policy", label: "Pricing Policy", aria: "Read our Pricing Policy" },
  { href: "/shipping-policy", label: "Shipping Policy", aria: "Read our Shipping Policy" },
  { href: "/terms", label: "Terms & Conditions", aria: "Read our Terms & Conditions" },
  { href: "/privacy-policy", label: "Privacy Policy", aria: "Read our Privacy Policy" },
  { href: "/cancellation-refund", label: "Cancellation/Refund", aria: "Read our Cancellation and Refund Policy" },
  { href: "/contact", label: "Contact Us", aria: "Contact Us" },
];

export default function Footer() {
  return (
    <footer className="w-full py-6 px-4 flex flex-wrap justify-center items-center gap-2 text-xs text-[#888] bg-white border-t border-[#eee] mt-8 sticky bottom-0 z-20" style={{ fontFamily: 'Open Sans, ui-sans-serif, sans-serif' }}>
      <span className="mr-4">&copy; {new Date().getFullYear()} AIrena</span>
      <nav className="flex flex-wrap gap-2 items-center justify-center">
        {footerLinks.map((link, idx) => (
          <span key={link.href} className="flex items-center">
            <Link
              href={link.href}
              aria-label={link.aria}
              className="footer-link px-1 hover:underline hover:text-black focus:outline-none focus:ring-2 focus:ring-blue-400 rounded transition-colors"
            >
              {link.label}
            </Link>
            {idx < footerLinks.length - 1 && <span className="text-[#ccc] mx-1">|</span>}
          </span>
        ))}
      </nav>
    </footer>
  );
} 