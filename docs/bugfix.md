1. Update routing so the main AI query/comparison form lives at `/query` instead of `/`. Make sure old `/` route redirects to `/query`. Update any navbar/menu or logic to point to `/query` as the main workspace route.

2. **Session/auth fix:** When a user logs out, fully clear all authentication tokens/session/cookies/local storage—ensure that navigating via browser history or back button **never allows access** to protected routes (query, pricing, dashboard, etc) without logging in again.  
   - If the user tries to visit a protected route after logout (even via browser history), always redirect them to the `/login` page.
   - On every route/page load, check for valid session/token; if missing/invalid, redirect to `/login`.
   - Fix all session persistence/refresh issues to avoid stale sessions.

3. **Credits logic:**  
   - When user is out of credits, disable the ability to run queries (do not call the model/API at all if credits are insufficient).
   - Show a toast/snackbar message like “You are out of credits! Please top up to continue.”
   - Grey out or disable query/submit buttons when credits are 0.
   - On credits fetch failure, block further actions and prompt user to refresh or contact support.

4. **Credits syncing:**  
   - Double-check logic for adding credits after payment or on registration.  
   - Ensure all updates are atomic and consistent in the database and UI (use Supabase upsert or transaction as needed).
   - After purchase or registration, immediately fetch fresh credits and update UI state.
   - Add robust error handling and toasts for all credit update/fetch failures.

5. **Logout behavior:**  
   - On logout from any route (including `/query` or `/pricing`), always redirect to `/login`.
   - Never show a blank page on logout or after auth/session expiry.  
   - Add fallback route logic to handle any “not authenticated” state gracefully with a login redirect.

**Overall:**
- Test all flows: login, logout, registration, no-credits, credit purchase, protected route navigation, browser history/back/forward.
- All protected content/components/pages must be invisible to non-logged-in users.
- Add clear toasts/messages for each error state.
- Refactor code as needed for best UX—do not break any core logic.

**Summary for Cursor:**  
Fix all authentication, routing, credits deduction, and session persistence bugs to ensure no unauthorized access, robust error handling, and a flawless credit-gated experience. `/query` must be the main route, login/logout flow must be airtight, and credits logic must block queries if user is out of credits.

