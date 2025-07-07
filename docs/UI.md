I want to build a modern, conversion-focused landing page for my AI app, AIrena.

**Requirements:**
- The hero section headline should read: “Compare top AI models. Pick the best answer. Supercharge your work.”
- Include a short supporting subheading underneath: “Get instant, side-by-side answers from GPT-4 and Gemini in one click. Smarter research. Zero confusion.”
- Prominent, large CTA button:  
  - Text: “Sign Up Free”  
  - If the user is not logged in, clicking the button should redirect to the `/login` page.
- Navigation bar at the top should be visible for all users:
  - Brand name/logo on the left: “AIrena”
  - If the user is not logged in, show a “Login” button on the right that goes to `/login`
  - If the user is logged in, show their username/avatar with a dropdown, including “Dashboard”, “Pricing”, “Credits”, and “Logout”
  -- Add credits feature to show in mobile as well
- Below the hero, add **trust signals**:
  - “Backed by real users” with limited users for now
  - “Your data stays private & secure”
  - “No hidden charges — pay only for what you use”
  - (Optional) A “Featured in” section for press logos
- Add a section for **testimonials** (dummy text OK), shown in cards or a carousel style.
- The design should use a clean, modern layout, good spacing, and brand colors (#1A1A1A, #F5F5F5, accent blue or green for buttons).
- Use a clear, readable font (like Open Sans, Inter, or similar).
- On mobile, all elements should stack nicely and the CTA/button remains visible.
- Don’t break any existing auth/session logic.
- Structure the code using Next.js app directory conventions.
- Do not break any other pages; implement as `src/app/page.tsx` (main landing page).
- Keep code modular, and add comments for key logic.
- Feel free to include a sample GIF or screenshot placeholder for a product demo in the hero.

**Summary:**  
Create a visually appealing, trust-building landing page for AIrena, with a clear CTA, login-aware navigation bar, and trust elements to boost signups.



Update the AIrena landing page with a new section answering **“Why use AIrena?”** — focus on how AIrena helps users in their daily work/life tasks at affordable prices.

**Instructions:**

- Add a “Why use AIrena?” section **below the hero and trust signals**, before testimonials.
- The section should highlight:
    - “Save hours daily by comparing answers from the world’s best AIs, side by side.”
    - “One app for all — write emails, brainstorm, code, translate, and research faster.”
    - “Transparent, affordable pricing. No hidden fees, just pay for what you use.”
    - “Perfect for students, job-seekers, creators, and busy professionals.”
- Use clear, friendly icons or visuals next to each benefit (e.g., clock for ‘save hours’, wallet/money icon for pricing, people for all users).
- Add a section headline: “Why use AIrena?”
- Write 3–5 bullet points or feature cards for each reason (feel free to improve copy for clarity).
- Make this section visually distinct with a background color or card styling.
- Ensure it looks great on mobile and desktop.
- Do NOT remove any existing hero, trust signals, CTA, testimonials, or navbar logic.
- Place the new section after the trust signals, before testimonials.
- Code in Next.js (app directory) using Tailwind and React conventions.

**Summary for Cursor:**  
Add a visually clear “Why use AIrena?” section focused on saving time, all-in-one workflow, affordability, and everyday utility for users, to increase conversions on the landing page.
