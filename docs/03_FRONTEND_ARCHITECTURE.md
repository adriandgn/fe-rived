# 03. Frontend Architecture

## 1. Folder Structure
We follow a feature-grouped structure within `src/`, differentiating between route groups for layout management.

```
src/
├── app/
│   ├── (auth)/          # Auth Layout (Center Card)
│   │   ├── login/
│   │   └── register/
│   ├── (main)/          # Main Layout (Navbar + Content)
│   │   ├── design/[id]/
│   │   └── page.tsx     # Feed
│   ├── (protected)/     # Protected Layout (Auth Guard)
│   │   └── create/      # Design Creation
│   ├── _not-found.tsx   # Custom 404
│   ├── error.tsx        # Route Error Boundary
│   ├── layout.tsx       # Root Layout (Fonts, Providers)
│   └── globals.css
├── components/
│   ├── auth/            # AuthGuard, LoginForm, etc.
│   ├── create/          # FileUpload, CreateDesignForm
│   ├── design/          # DesignCard, CommentsSection
│   ├── main/            # FilterBar, MasonryGrid
│   └── ui/              # Shadcn components (Button, Input...)
├── lib/                 # Shared utilities
│   ├── api-client.ts    # Axios instance
│   ├── types.ts         # Shared TS interfaces
│   └── utils.ts         # cn helper
└── store/
    └── use-auth-store.ts # Zustand Persistence
```

## 2. Key Patterns

### Authentication (Zustand + Axios)
*   **Store**: `useAuthStore` persists the JWT token and User object in `localStorage`.
*   **Guard**: `<AuthGuard>` wraps protected routes locally or via Layout.
*   **Interceptors**: `api-client.ts` automatically attaches `Authorization: Bearer [token]` header to requests.

### Data Fetching (React Query)
*   **Feed**: Uses `useInfiniteQuery` for the Masonry Feed.
*   **Details**: Uses `useQuery` for fetching single design data.
*   **Mutations**: `useMutation` for Actions (Login, Create, Like, Comment) with optimistic updates where appropriate.

### Component Architecture
*   **Server vs Client**:
    *   Pages are generally Client Components if they need `useAuthStore` or `useQuery` immediately.
    *   Use `Suspense` for async boundaries.
*   **UI Components**: Pure presentation components in `components/ui`.
*   **Feature Components**: Business logic components in `components/[feature]`.

## 3. Error Handling
*   **Global**: `<ErrorBoundary>` (Class-based) wraps the entire app in `src/app/layout.tsx`.
*   **API**: Axios interceptors catch 401/403 errors.
*   **Forms**: Zod schemas provide field-level validation errors.
*   **Feedback**: `sonner` is used for ephemeral status messages (Success/Error toasts).