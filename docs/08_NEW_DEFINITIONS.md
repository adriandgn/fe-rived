# **08. New Definitions & Standards**

This document establishes technical definitions, standards, and conventions not explicitly covered in the previous documentation to ensure consistency and quality across the specific "Rived" project.

## **1. Development Workflow Definitions**

### **Branching Strategy**
We follow a simplified **Git Flow**:
*   **main**: Production-ready code. Protected branch.
*   **develop**: Integration branch.
*   **feat/feature-name**: New features (branched from develop).
*   **fix/bug-name**: Bug fixes (branched from develop).
*   **hotfix/issue-name**: Critical production fixes (branched from main).

### **Commit Message Convention (Conventional Commits)**
Format: `<type>(<scope>): <subject>`
*   **Types**:
    *   `feat`: A new feature
    *   `fix`: A bug fix
    *   `docs`: Documentation only changes
    *   `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
    *   `refactor`: A code change that neither fixes a bug nor adds a feature
    *   `perf`: A code change that improves performance
    *   `test`: Adding missing tests or correcting existing tests
    *   `chore`: Changes to the build process or auxiliary tools and libraries
*   **Example**: `feat(auth): implement login form validation`

## **2. Naming Conventions**

### **File & Directory Naming**
*   **Files**: `kebab-case` (e.g., `login-form.tsx`, `use-auth-store.ts`).
*   **Directories**: `kebab-case` (e.g., `components/ui`, `app/design-details`).
*   **Exceptions**: `README.md`, `LICENSE`.

### **Code Identifiers**
*   **React Components**: `PascalCase` (e.g., `DesignCard`).
*   **Functions/Variables**: `camelCase` (e.g., `handleSubmit`, `isLoading`).
*   **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_UPLOAD_SIZE_MB`).
*   **Interfaces/Types**: `PascalCase` (e.g., `Design`, `UserProfile`).

## **3. Responsive Breakpoints (Tailwind Default)**
*   **xs**: < 640px (Mobile strict)
*   **sm**: 640px (Tablets)
*   **md**: 768px (Tablets landscape / small laptops)
*   **lg**: 1024px (Laptops/Desktops)
*   **xl**: 1280px (Large Desktops)
*   **2xl**: 1536px (Ultra Wide)

## **4. Environment Variables Definition**
Required `.env.local` keys:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Base URL for the Backend API | `http://localhost:8000/api/v1` |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for the frontend | `http://localhost:3000` |
| `NEXT_PUBLIC_IMAGE_DOMAIN` | Allowed domain for Next.js Image Optimization | `supabase.co` |

## **5. Accessibility (A11y) Standards**
*   **Target**: WCAG 2.1 Level AA compliance.
*   **Semantic HTML**: Proper use of `<main>`, `<section>`, `<nav>`, `<button>`, etc.
*   **Interactive Elements**: All clickable elements must have `:focus-visible` states.
*   **Images**: All `<img>` tags must have descriptive `alt` text (except decorative).
*   **Forms**: All inputs must have associated labels (visible or `aria-label`).

## **6. Performance Budget**
*   **Lighthouse Score Target**: >90 in Accessibility, Best Practices, and SEO. >80 in Performance (Mobile).
*   **Core Web Vitals**:
    *   **LCP (Largest Contentful Paint)**: < 2.5s
    *   **FID (First Input Delay)**: < 100ms
    *   **CLS (Cumulative Layout Shift)**: < 0.1
*   **Image Optimization**: All images served via `next/image` logic with WebP/AVIF formats.

## **7. Browser Support**
*   **Priority 1**: Chrome (Latest 2 versions), Safari (Latest 2 versions), Firefox (Latest 2 versions).
*   **Priority 2**: Edge, Chrome for Android, Safari on iOS.
*   **Not Supported**: IE11.
