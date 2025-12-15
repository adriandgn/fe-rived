# 10. Onboarding Guide

Welcome to the **Rived** development team! This guide will help you get up to speed quickly.

## 🚀 Quick Start

1.  **Read the README**: Ensure you've followed the setup steps in the root `README.md`.
2.  **Explore the UI**: Run the app and click through the main flows (Login, Feed, Create).
3.  **Check the Docs**:
    *   `02_TECH_STACK.md`: Understand the tools we use.
    *   `03_FRONTEND_ARCHITECTURE.md`: Learn where code lives.

## 👩‍💻 Common Workflows

### Adding a New Feature
1.  **Define the Route**: Should it be public `(main)`, protected `(protected)`, or standalone?
2.  **Create Components**:
    *   UI primitives go in `components/ui` (Shadcn).
    *   Feature logic goes in `components/[feature]`.
3.  **Data Fetching**:
    *   Use `useQuery` for GET.
    *   Use `useMutation` for POST/PUT/DELETE.
    *   **Tip**: Always handle loading and error states.

### Styling
*   We use **Tailwind CSS**.
*   Use `cn()` from `@/lib/utils` to merge classes conditionally.
*   Stick to the design tokens (colors, spacing) defined in `globals.css`.

## ⚠️ Common Pitfalls

### Authentication
*   **Do not manually attach tokens**: The `apiClient` in `lib/api-client.ts` automatically attaches the Bearer token from `localStorage`. Just use `apiClient.get(...)`.
*   **Accessing User**: Use `useAuthStore()` to get the current user object.

### Hydration Errors
*   If you see "Hydration failed", you might be rendering something different on the server vs client (e.g. `window` usage or local dates).
*   **Fix**: Move that logic into a `useEffect` or use a dynamic import with `{ ssr: false }`.

## 🧪 Testing
*   Write unit tests for utility functions and complex components.
*   Run `npm test` before pushing.

Happy Coding!
