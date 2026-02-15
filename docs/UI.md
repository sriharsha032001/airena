**Task:**  
Update the AIrena website's Footer component so that it includes links to all legal and informational pages:

- Pricing Policy (`/pricing-policy`)
- Shipping Policy (`/shipping-policy`)
- Terms & Conditions (`/terms`)
- Privacy Policy (`/privacy-policy`)
- Cancellation/Refund (`/cancellation-refund`)
- Contact Us (`/contact`)

**Requirements:**

- The links must be clearly visible in the site footer on every page.
- Each link should use Next.js `<Link>` for client-side routing.
- Arrange links horizontally with good spacing; on mobile, wrap/stack neatly.
- Use consistent typography (same font, color, size as rest of footer), with hover/focus styles for accessibility.
- Add a divider (“|”) between links for clarity, but do **not** add a divider after the last link.
- Footer must remain sticky at the bottom if possible, with adequate top margin above.

**Bonus:**
- Add `aria-label` for accessibility on each link (e.g., `aria-label="Read our Pricing Policy"`).
- Footer background and link color should match current design.
- No logic or navigation bugs—routes must work everywhere in the app.

**Do not change any site logic.**  
Only update the Footer UI to include these links—using clean, professional, MAANG-level UI best practices.

---

**Example (pseudo-code):**

```tsx
<footer className="w-full py-6 px-4 flex flex-wrap justify-center items-center gap-2 text-xs text-[#888] bg-white border-t border-[#eee] mt-8">
  <Link href="/pricing-policy" aria-label="Read our Pricing Policy" className="footer-link">Pricing Policy</Link>
  <span>|</span>
  <Link href="/shipping-policy" aria-label="Read our Shipping Policy" className="footer-link">Shipping Policy</Link>
  <span>|</span>
  <Link href="/terms" aria-label="Read our Terms & Conditions" className="footer-link">Terms & Conditions</Link>
  <span>|</span>
  <Link href="/privacy-policy" aria-label="Read our Privacy Policy" className="footer-link">Privacy Policy</Link>
  <span>|</span>
  <Link href="/cancellation-refund" aria-label="Read our Cancellation and Refund Policy" className="footer-link">Cancellation/Refund</Link>
  <span>|</span>
  <Link href="/contact" aria-label="Contact Us" className="footer-link">Contact Us</Link>
</footer>
