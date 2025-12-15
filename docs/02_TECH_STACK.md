# 02. Technology Stack

## 1. Core Framework
*   **Next.js 14+ (App Router)**
    *   Server Components for initial data fetching where possible.
    *   Client Components for interactive UI (Zustand, React Query).
*   **Language**: TypeScript 5+ (Strict Mode).

## 2. Dependencies

### Styling & UI
*   **Tailwind CSS**: Utility-first styling.
*   **Shadcn/ui**: Reusable components based on Radix UI.
*   **Lucide React**: Icon set.
*   **clsx / tailwind-merge**: Conditional class merging.

### State & Data
*   **Zustand**: Global client state (Authentication, User Profile).
*   **TanStack Query (React Query)**: Server state management (Feed, Infinite Scroll, Caching).
*   **Axios**: HTTP Client with interceptors for JWT handling.
*   **react-intersection-observer**: For infinite scroll triggers.

### Forms & Validation
*   **React Hook Form**: Performant form state.
*   **Zod**: Schema validation (Login, Register, Create Design).
*   **react-dropzone**: File upload handling.

### Feedback & Utilities
*   **Sonner**: Toast notifications.
*   **date-fns**: Date formatting.
*   **react-error-boundary**: Global error handling.

## 3. Dev Tools
*   **Vitest**: Unit testing framework.
*   **React Testing Library**: Component testing.
*   **ESLint / Prettier**: Code quality and formatting.
