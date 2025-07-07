[21:35:16.052] Running build in Washington, D.C., USA (East) – iad1
[21:35:16.052] Build machine configuration: 2 cores, 8 GB
[21:35:16.099] Cloning github.com/sriharsha032001/airena (Branch: main, Commit: 7256643)
[21:35:16.849] Warning: Failed to fetch one or more git submodules
[21:35:16.850] Cloning completed: 751.000ms
[21:35:19.307] Restored build cache from previous deployment (EJTjEKfkYuE4Y1hnQfjmt2DCvnpD)
[21:35:19.726] Running "vercel build"
[21:35:20.268] Vercel CLI 44.2.12
[21:35:20.734] Installing dependencies...
[21:35:23.511] 
[21:35:23.512] added 2 packages, and changed 2 packages in 2s
[21:35:23.513] 
[21:35:23.513] 144 packages are looking for funding
[21:35:23.514]   run `npm fund` for details
[21:35:23.543] Detected Next.js version: 15.3.4
[21:35:23.547] Running "npm run build"
[21:35:23.657] 
[21:35:23.658] > airena@0.1.0 build
[21:35:23.658] > next build
[21:35:23.658] 
[21:35:24.582]    ▲ Next.js 15.3.4
[21:35:24.583] 
[21:35:24.624]    Creating an optimized production build ...
[21:35:32.579]  ⚠ Compiled with warnings in 6.0s
[21:35:32.579] 
[21:35:32.580] ./node_modules/@supabase/realtime-js/dist/main/RealtimeClient.js
[21:35:32.580] Critical dependency: the request of a dependency is an expression
[21:35:32.580] 
[21:35:32.580] Import trace for requested module:
[21:35:32.580] ./node_modules/@supabase/realtime-js/dist/main/RealtimeClient.js
[21:35:32.580] ./node_modules/@supabase/realtime-js/dist/main/index.js
[21:35:32.580] ./node_modules/@supabase/supabase-js/dist/module/index.js
[21:35:32.580] ./src/app/api/queries/route.ts
[21:35:32.580] 
[21:35:40.059]  ✓ Compiled successfully in 11.0s
[21:35:40.064]    Linting and checking validity of types ...
[21:35:45.704] 
[21:35:45.704] Failed to compile.
[21:35:45.705] 
[21:35:45.706] ./src/app/api/razorpay/route.ts
[21:35:45.706] 3:16  Error: 'uuidv4' is defined but never used.  @typescript-eslint/no-unused-vars
[21:35:45.706] 
[21:35:45.706] ./src/components/ui/navbar.tsx
[21:35:45.706] 84:19  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[21:35:45.707] 
[21:35:45.707] info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/app/api-reference/config/eslint#disabling-rules
[21:35:45.743] Error: Command "npm run build" exited with 1
[21:35:45.987] 