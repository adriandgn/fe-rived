# Mobile App Implementation Master Plan

> **Status:** APPROVED
> **Architect:** MobileArch
> **Tech Stack:** React Native (Expo) + TypeScript + NativeWind

This document is the **Execution Guide** for the AI Agent responsible for building the app.

## 0. Documentation Index
All detailed specs are located in this directory:
1.  **[Product Definition](./PRODUCT_DEFINITION.md)** (The "What" and "Why")
2.  **[Tech Stack](./TECH_STACK.md)** (The Tools: Expo, Zustand, React Query)
3.  **[Architecture](./ARCHITECTURE.md)** (The Structure: Folder map, Diagrams)
4.  **[Wireframes](./WIREFRAMES.md)** (The UI: Screen layouts & components)
5.  **[API Specification](./API_CLIENT_SPEC.md)** (The Data: Axios, Types)

---

## 1. Phase 1: Foundation (Setup)
*   [ ] **Init**: Initialize Expo project with TypeScript and NativeWind.
    *   `npx create-expo-app@latest -t expo-template-blank-typescript`
    *   Setup `nativewind` v4.
*   [ ] **Structure**: Create the folder structure defined in `ARCHITECTURE.md`.
*   [ ] **Navigation**: Install `expo-router` and configure the Root Layout (`_layout.tsx`) and Tab Layout (`(tabs)/_layout.tsx`).
*   [ ] **Theme**: Configure Tailwind `tailwind.config.js` to match web colors (copy from `fe-rived`).

## 2. Phase 2: Core Features (Iterative)
### 2.1 Authentication
*   [ ] Implement `AuthStore` (Zustand) and `SecureStore` logic.
*   [ ] Build `LoginScreen`.
*   [ ] Connect to `/api/v1/auth/login`.

### 2.2 Feed & Discovery
*   [ ] Build `FeedCard` component.
*   [ ] Implement `useFeed` hook (React Query).
*   [ ] Build `FeedScreen` with `FlashList` (Masonry).

### 2.3 Creation Flow
*   [ ] Build `CameraPermission` handler.
*   [ ] Implement `ImagePicker` (Expo ImagePicker).
*   [ ] Build `CreateForm` (Title, Materials).
*   [ ] Connect to `/api/v1/designs` (Multipart upload).

## 3. Phase 3: Polish
*   [ ] **Gestures**: Add "Double Tap to Like" on Feed Cards.
*   [ ] **Animations**: Add Shared Element Transition from Feed -> Detail.
*   [ ] **Icons**: Ensure all Lucide icons match the wireframes.

## 4. Testing & Verification
*   **Run on Simulator**: `npx expo start --ios` (or android).
*   **Lint**: Ensure no Type Errors.
