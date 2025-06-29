Refactor and fix all issues in the following files:

1. **/src/app/(auth)/login/page.tsx**
   - Fix the module not found error: `@/lib/supabase/client`
     → Ensure the path resolves correctly and the file exists.
   - If the file does not exist, create `/src/lib/supabase/client.ts` with:
     ```
     import { createClient } from '@supabase/supabase-js';

     export const supabase = createClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
     );
     ```
   - Fix all `'React' refers to a UMD global` errors by adding:
     ```tsx
     import React from "react";
     ```
     at the top of the file.
   - Ensure all JSX works without errors and imports are correct.

2. **/src/components/ui/logout-button.tsx**
   - Resolve TailwindCSS class conflict:
     → Replace conflicting classes `'hover:bg-[#e0e0e0]'` and `'hover:bg-[#d32d2f]'`
     → Choose only **one hover background color**, preferably `hover:bg-[#c62828]`
     Example:
     ```tsx
     className="bg-[#d32d2f] hover:bg-[#c62828] text-white"
     ```

Also:
- Format the code cleanly after changes.
- Ensure imports use correct module paths.
- Use only one hover state class for Tailwind styles.
- Fix all remaining TypeScript (TS2307, TS2686) errors and make the code production-ready.
