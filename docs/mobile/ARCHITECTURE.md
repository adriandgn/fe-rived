# Mobile Application Architecture

## 1. Modular "Feature-First" Folder Structure

We will avoid "group by file type" (controllers, screens) and instead **group by feature domain**. This keeps related logic together, making it easier for AI agents to context-switch between features.

```
/src
  /app                 # Expo Router (Layer 1: Presentation - Routing)
    /_layout.tsx       # Root Provider Setup
    /(auth)            # Auth Group (Login, Register)
    /(tabs)            # Main App Group (Feed, Explore, Profile)
    /design/[id].tsx   # Dynamic Route
    
  /core                # System-wide utilities (Layer 0: Foundation)
    /auth              # Auth Provider, Token Storage
    /api               # Axios Instance, Interceptors
    /theme             # Tailwind Config, Global Colors
    /i18n              # Localization strings
    
  /components          # Generic "Dumb" UI Components (Button, Input)
    /ui                # Primitives (The "Design System")
    
  /features            # Domain Modules (Layer 2 & 3: Domain & Data)
    /feed              # Feature: Feed
      /api             # FeedService (Fetch posts)
      /components      # FeedCard, MasonryGrid
      /hooks           # useFeedQuery (TanStack Query)
      /types.ts        # Feed specific models
      
    /create-design     # Feature: Upload Flow
      /store           # CreationStore (Zustand - temp state)
      /components      # ImageEditor, MaterialSelector
      
    /profile
      ...
```

## 2. Layered Architecture Diagram

We enforce a strict unidirectional data flow using **Clean Architecture** principles adapted for React.

```mermaid
graph TD
    subgraph "UI Layer (Presentation)"
        Page[Expo Router Page]
        Comp[UI Components]
        Hook[Custom Hooks]
    end

    subgraph "State Layer (Application)"
        Query[TanStack Query (Server State)]
        Store[Zustand (Client State)]
    end

    subgraph "Data Layer (Infrastructure)"
        API[Axios Client]
        Secure[SecureStore]
    end

    subgraph "Backend"
        PyAPI[Python REST API]
    end

    Page -->|Calls| Hook
    Comp -->|Renders Data| Page
    Hook -->|Uses| Query
    Hook -->|Uses| Store
    Query -->|Fetch/Mutate| API
    Store -->|Persist| Secure
    API -->|HTTP JSON| PyAPI
```

## 3. Key Technical Patterns

### **A. Authentication (JWT)**
1.  **Login:** API returns `access_token` and `refresh_token`.
2.  **Storage:** Store securely in device Keychain via `Expo SecureStore` (NOT AsyncStorage).
3.  **Interceptor:** Axios Request Interceptor adds `Authorization: Bearer <token>`.
4.  **Auto-Refresh:** Axios Response Interceptor catches `401`, calls `/refresh`, updates token, and retries original request. If fail -> Logout.

### **B. Infinite List Management (Feed)**
*   Use `FlashList` (Shopify) instead of `FlatList` for recycling performance.
*   Combine with `useInfiniteQuery` from React Query to handle implementation of "Load More" logic seamlessly.

### **C. The "Creation" Flow (Offline-ish)**
1.  **Draft State:** When user takes a photo, save path to Zustand store.
2.  **Optimistic UI:** (Optional for MVP) Show "Uploading..." card in feed immediately.
3.  **Background Upload:** Use `expo-file-system` uploadAsync for robust large file uploads that survive app backgrounding.

### **D. Error Handling**
*   **Global Error Boundary:** Wrap root layout to catch React crashes.
*   **Toast System:** Use `Burnt` or `Sonner` (Native) for non-blocking API errors ("Check your connection").
*   **Form Errors:** Standard `react-hook-form` field validation errors.
