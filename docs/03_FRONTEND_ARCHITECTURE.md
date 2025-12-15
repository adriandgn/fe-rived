# **Frontend Architecture**

## **File Structure Strategy**

We follow a feature-grouped structure within the App Router, with a clear separation for protected routes.

* src/  
* ├── app/  
* │   ├── (auth)/                 \# Public: Login/Register (Clean layout)  
* │   ├── (main)/                 \# Public: Home, Search, Design Details  
* │   │   ├── layout.tsx          \# Providers \+ Navbar  
* │   │   └── page.tsx  
* │   ├── (protected)/            \# SECURE: Requires Authentication  
* │   │   ├── layout.tsx          \# Wrapper with \<AuthGuard\>  
* │   │   ├── create/             \# Create Design Page  
* │   │   └── profile/me/         \# Edit Profile  
* │   └── layout.tsx              \# Root Layout  
* ├── components/  
* │   ├── auth/  
* │   │   ├── auth-guard.tsx      \# Client Component for route protection  
* │   │   └── login-form.tsx      \# Zod-validated form  
* │   ├── ui/                     \# Shadcn primitives (Toast, Dialog, etc.)  
* │   └── features/               \# Feature-specific components  
* ├── lib/  
* │   ├── api-client.ts           \# Axios instance with Interceptors  
* │   ├── schemas/                \# Zod Validation Schemas  
* │   └── utils.ts  
* ├── store/  
* │   └── use-auth-store.ts       \# Zustand store for Auth State

## **Authentication Flow**

The app uses a client-side authentication strategy suitable for the MVP (JWT in LocalStorage).

1. **State Management:**  
   * Use **Zustand** (useAuthStore) to manage user, accessToken, and isAuthenticated status.  
   * **Hydration:** On app mount (RootLayout), check localStorage for a token. If valid, set user state.  
2. **Route Protection (\<AuthGuard\>):**  
   * A client-side wrapper component used in (protected)/layout.tsx.  
   * **Logic:**  
     * If isLoading, show a skeleton/spinner.  
     * If \!isAuthenticated, redirect to /login?redirect=....  
     * If isAuthenticated, render children.  
3. **Token Expiration / 401 Errors:**  
   * **Axios Interceptor:** Listen for 401 Unauthorized responses globally.  
   * **Action:** If 401 occurs, clear the Zustand store/localStorage and redirect to login immediately with a "Session Expired" toast.

## **Error Handling & Validation**

User feedback must be immediate and clear.

1. **Form Validation:**  
   * **Tool:** **React Hook Form** \+ **Zod**.  
   * **UX:** Display inline validation errors (e.g., "Email is required", "Password too short") in red text below inputs using FormMessage component.  
2. **API Errors:**  
   * **Tool:** **Sonner** (Shadcn Toast).  
   * **Strategy:**  
     * **Server Errors (500):** Show generic error toast: "Something went wrong. Please try again."  
     * **Logic Errors (400/422):** Show specific message from backend detail field.  
   * **React Query:** Use the onError callback in mutations to trigger these toasts globally or locally.  
* 