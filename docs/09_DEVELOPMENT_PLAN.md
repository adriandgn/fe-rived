# **09. Development Plan & User Stories**

This plan outlines the agile development roadmap for the "Rived" MVP. The project is divided into logical phases (Sprints) with specific User Stories and tasks assigned to specialized agents/roles.

## **Role Legend**
*   **[BA]**: Business Analyst (Requirements, AC refinement)
*   **[UX/UI]**: Designer (Figma, Mockups, Assets)
*   **[FE]**: Frontend Engineer (Implementation, Logic)
*   **[QA]**: Quality Assurance (Testing, Verification)

---

## **Phase 1: Foundation & Setup**

### **Story 1.1: Project Initialization**
**As a** Developer, **I want** a configured Next.js environment with all dependencies, **so that** I can start building features efficiently.

*   **[FE]**: Initialize Next.js 14 App Router project with TypeScript.
*   **[FE]**: Install Tailwind CSS, Shadcn/ui (Maia theme), Lucide React.
*   **[FE]**: Configure ESLint, Prettier, and path aliases (`@/*`).
*   **[FE]**: Set up Vitest and React Testing Library environment.
*   **[QA]**: Verify the build command runs without errors (`npm run build`).

### **Story 1.2: Core Architecture**
**As a** Developer, **I want** the base folders and utility libraries set up, **so that** code is organized and reusable.

*   **[FE]**: Create folder structure (`components/`, `lib/`, `store/`, `hooks/`).
*   **[FE]**: Implement `api-client.ts` (Axios instance) with interceptors skeleton.
*   **[FE]**: Set up `use-auth-store.ts` with Zustand (User type definitions).
*   **[FE]**: Implement global `toast` provider (Sonner) in the Root Layout.

---

## **Phase 2: Authentication**

### **Story 2.1: User Login**
**As a** User, **I want** to log in using my email and password, **so that** I can access my profile and protected features.

*   **[BA]**: Define error messages for: User not found, Wrong password, Server error.
*   **[UX/UI]**: Design Login Page (centered card, clean input fields, error states).
*   **[FE]**: Create `LoginForm` component with React Hook Form + Zod validation.
*   **[FE]**: Integate `POST /auth/login` endpoint.
*   **[FE]**: Handle successful login: Store token in LocalStorage, Update Zustand, Redirect.
*   **[QA]**: Test valid login, invalid credentials, and empty fields.

### **Story 2.2: Route Protection (Auth Guard)**
**As a** Developer, **I want** to protect sensitive routes, **so that** unauthenticated users are redirected to login.

*   **[FE]**: Create `AuthGuard` wrapper component.
*   **[FE]**: Implement logic: Check token -> If missing, redirect to `/login`.
*   **[FE]**: Add Axios Interceptor to catch 401 errors and force logout.
*   **[QA]**: Attempt to access `/create` via URL directly without logging in.

### **Story 2.3: User Registration & Profile View**
**As a** New User, **I want** to sign up and see my profile, **so that** I can join the community.

*   **[UX/UI]**: Design Registration Form and Basic Profile Layout.
*   **[FE]**: Implement `RegisterForm` (Name, Email, Password).
*   **[FE]**: Create User Profile page fetching `GET /users/me`.
*   **[QA]**: Verify new user flow: Register -> Auto Login -> Profile Page.

---

## **Phase 3: Discovery (The Feed)**

### **Story 3.1: Masonry Feed**
**As a** Visitor, **I want** to see a visual feed of redesigns, **so that** I can be inspired.

*   **[UX/UI]**: Design Masonry Card (Image priority, Title, Author Avatar).
*   **[FE]**: Implement `DesignCard` component.
*   **[FE]**: Implement `MasonryGrid` layout using CSS columns or library.
*   **[FE]**: Integrate `GET /designs` with `useInfiniteQuery` (React Query) for pagination.
*   **[QA]**: Verify responsive layout (1 column mobile -> 3 columns desktop).

### **Story 3.2: Filtering & Search**
**As a** User, **I want** to filter designs by category/material, **so that** I find relevant upcycling ideas.

*   **[UX/UI]**: Design Filter Bar (Chips/Dropdowns) and Search Input.
*   **[FE]**: Implement Search logic updating URL query params (`?q=...&material=...`).
*   **[FE]**: Connect Search Params to the API call in `MasonryGrid`.
*   **[QA]**: Verify that refreshing the page keeps the active filters (URL state).

### **Story 3.3: Design Details**
**As a** User, **I want** to click a design to see full details, **so that** I can understand how it was made.

*   **[UX/UI]**: Design Detail View (Large image, Description, Materials list, Author info).
*   **[FE]**: Create `app/(main)/design/[id]/page.tsx`.
*   **[FE]**: Fetch design details via `GET /designs/{id}`.
*   **[QA]**: Verify 404 handling if design ID does not exist.

---

## **Phase 4: Creation & Interaction**

### **Story 4.1: Create Redesign (Upload)**
**As a** Creator, **I want** to upload a photo and add details of my work, **so that** I can share it with others.

*   **[UX/UI]**: Design Create Page (Image dropzone, Title input, Description, Material tags).
*   **[FE]**: Implement File Upload UI (Preview before upload).
*   **[FE]**: Implement `CreateDesignForm`. Note: Handle `multipart/form-data` or storage logic as per API.
*   **[QA]**: Test uploading large images (check constraints) and form submission.

### **Story 4.2: Likes & Comments**
**As a** User, **I want** to like and comment on designs, **so that** I can show appreciation.

*   **[UX/UI]**: Design "Heart" button (active/inactive states) and Comment list UI.
*   **[FE]**: Implement Optimistic Updates for "Like" action (immediate UI feedback).
*   **[FE]**: Implement Comment list fetching and "Add Comment" input.
*   **[QA]**: Verify that "Like" count increases/decreases correctly.

---

## **Phase 5: Polish & QA**

### **Story 5.1: Global Error Handling & Feedback**
**As a** User, **I want** clear feedback when things go wrong, **so that** I am not confused.

*   **[UX/UI]**: Design Toast variants (Success, Error, Info).
*   **[FE]**: Ensure all API mutations trigger Toasts.
*   **[FE]**: Implement Error Boundary for React components.
*   **[QA]**: Trigger server errors (500) and verify Toast appearance.

### **Story 5.2: Final Testing & Optimization**
**As a** Team, **we want** to ensure the app is fast and bug-free.

*   **[FE]**: Run `npm run build` and fix any type errors.
*   **[FE]**: Audit Lighthouse score and optimize images/scripts.
*   **[QA]**: Perform end-to-end regression testing on Critical Flows.
