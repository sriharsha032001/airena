Revamp the Query and Response panels to a MAANG/Uber-level UX:

- Use a spacious, grid-based layout (left: Query Form 25%, right: Response Panels 75% in 2 columns, stacking on mobile/tablet).
- Query Panel: Large, floating label textarea, sticky CTA button, pill-shaped model toggles with icons and tooltips, animated border on focus.
- Response Panels: Bold header with model icon/color, soft badge for latency, always-visible copy icon (animated), large text, fade-in loading, and gradient fade with “Read More”.
- All actions (Copy, Compare, Clear All) consolidated at the top/bottom of grid, no per-card buttons.
- Animations: Card scale/shadow on hover, button ripple, framer-motion for fade/slide-in, loading dots for responses.
- Add feedback bar (👍/👎) under each response, with tooltip and pop.
- “Expand” opens a full modal, with token count/cost if available.
- Strict use of brand color for accents, rest is minimal/white/gray.
- Ensure perfect accessibility (large tap targets, ARIA, visible focus).
- Use only Tailwind, shadcn/ui, framer-motion.
- No logic or API changes, **only design/UX**.

Example references: Uber web dashboard, Notion, Linear, Google Gemini AI Studio.
