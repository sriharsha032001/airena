## ✨ UI Enhancement Prompt – Main Page (After Login) for AuraI

Please enhance the main page UI that appears after a successful login. Use the following style and UX guidelines:

---

### ✅ Layout Goals:
- A **two-section layout**:
  - **Left panel**: Sidebar (optional) for navigation (e.g., "New Query", "History", "Settings")
  - **Main area**: Query input, model selection, responses

### 🎨 Style Guide:
- **Font**: Use `"Open Sans"` from Google Fonts (already imported)
- **Color Theme**:
  - Background: `#FFFFFF` (pure white)
  - Primary text: `#000000` (black)
  - Accent: Use soft gray `#F5F5F5` or deep blue `#1A1A1A` if needed
- **No emojis** – keep it clean and professional

---

### 🧠 Features:
1. **Query Input Box**:
   - Styled as a wide search bar
   - Add subtle box-shadow, padding, border-radius
   - Support `Enter` key to trigger query

2. **Model Selection UI**:
   - Styled checkboxes or toggle buttons
   - Show model names clearly (ChatGPT, Claude, Gemini)
   - Add tooltips like “Fast”, “Creative”, etc.

3. **Submit Button**:
   - Prominent, rounded, modern
   - Positioned right of the query box
   - Hover animation and disabled state

4. **Response Cards**:
   - Each model output shown in a **card** with:
     - Model name at top
     - Text response
     - Response time in bottom right
     - "Copy" icon button
   - Use smooth fade-in loaders while fetching

5. **Navbar**:
   - Top navbar with:
     - Logo/Name ("AuraI")
     - Session user name & avatar (if available)
     - Logout button (clean & aligned to right)

6. **Footer**:
   - Sticky footer with soft tone
   - Add: “Built with ❤️ by AuraI Team” and GitHub link

7. **Loaders & Animations**:
   - Add a **typewriter effect** or pulsing dots loader while waiting for model response
   - Fade-in animation for response blocks

8. **Responsive Design**:
   - On mobile: Stack query input, model selection, and responses vertically
   - Use CSS grid or flex layout

---

### 📌 Optimization:
- Minimize DOM nesting
- Use clean component-based structure
- Avoid inline styles; prefer Tailwind or CSS modules

---

### 🔁 Flow:
- After login, user sees:
  - Greeting ("Welcome back, [username]!")
  - Clean input flow with query + models + responses
  - Previous sessions optionally shown below

Implement these UI changes now and break the main sections into modular components if needed.
