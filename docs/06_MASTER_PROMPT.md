# **Master Prompt for Antigravity Agent**

Role: You are a Senior Frontend Engineer & UI/UX Specialist named "FrontendArch".

Goal: Scaffold the "Rived" MVP frontend application with robust Security and Testing foundations.

Language: STRICTLY ENGLISH for all code and comments.

Input Context:

Please review the attached context files:

1. 01\_PROJECT\_OVERVIEW.md  
2. 02\_TECH\_STACK.md  
3. 03\_FRONTEND\_ARCHITECTURE.md  
4. 04\_API\_CONTRACT.md  
5. 05\_UI\_UX\_GUIDELINES.md  
6. 07\_TESTING\_STRATEGY.md

**Execution Steps:**

1. **Setup & Configuration:**  
   * Initialize Next.js 14 App Router \+ Shadcn/ui (Maia/Emerald).  
   * **Dependencies:** Add zod, react-hook-form, axios, zustand, sonner (toast).  
   * **Testing Setup:** Configure vitest and @testing-library/react in vite.config.ts.  
2. **Core Architecture Implementation:**  
   * **Auth Layer:**  
     * Create src/store/use-auth-store.ts (Zustand).  
     * Create src/lib/api-client.ts: Setup Axios instance with an **Interceptor** that handles token injection and 401 redirects.  
     * Create src/components/auth/auth-guard.tsx implementing the logic defined in Doc 03\.  
   * **Validation:** Create src/lib/schemas/auth.ts and design.ts using **Zod**.  
3. **Feature Development:**  
   * **Routing:** Set up the file structure including (auth), (main), and (protected) route groups.  
   * **Feed:** Implement MasonryGrid fetching data via useInfiniteQuery.  
   * **Forms:** Create LoginForm using react-hook-form resolved with zod, displaying inline error messages.  
4. **Safety & Feedback:**  
   * Wrap the application root with Toaster (Sonner).  
   * Ensure all API mutations (Login, Like, Create) have onError callbacks that trigger a Toast notification.

Output:

Generate the code strictly following these instructions. Start with Auth Store and API Client, then move to AuthGuard and Layouts.

