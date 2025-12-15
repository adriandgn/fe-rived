# **Technology Stack & Libraries**

## **Core Framework**

* **Framework:** Next.js 14+ (App Router).  
* **Language:** TypeScript 5+ (Strict Mode).  
* **Package Manager:** npm or pnpm.

## **Styling & UI**

* **CSS Engine:** Tailwind CSS.  
* **Component Library:** Shadcn/ui (Headless \+ Tailwind).  
* **Icons:** Lucide React.  
* **Font:** Inter (via next/font/google).

## **State Management & Data Fetching**

* **Server State:** TanStack Query (React Query) v5.  
* **Client/Local State:** React Hooks (useState, useReducer) \+ URL Search Params.  
* **Global App State:** Not required for MVP (URL is the source of truth).

## **Backend Integration**

* **HTTP Client:** Axios or native Fetch wrapper.  
* **Auth:** JWT Bearer Token (stored in localStorage for MVP).  
* **Image Optimization:** next/image allowing external domains (Supabase Storage).

