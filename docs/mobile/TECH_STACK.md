# Technology Stack & Tooling Strategy

## 1. Core Framework Selection

| Feature | Flutter (Dart) | React Native + Expo (TypeScript) | **Recommendation** |
| :--- | :--- | :--- | :--- |
| **Language** | Dart (New to web team) | **TypeScript** (Matches Next.js Stack) | **React Native** |
| **Performance** | Native compiled (Skia). Consistently smooth. | Native Bridge/JSI. Near-native with Reanimated. | **React Native** (Sufficient for MVP) |
| **AI Generation** | Good. Strong typing helps agents. | **Excellent**. Agents excel at React patterns. | **React Native** |
| **Deployment** | fastlane needed. | **Expo EAS**. Zero-config cloud builds. | **React Native** |
| **Continuity** | Low. Separate ecosystem. | **High**. Code sharing potential (Types, Logic). | **React Native** |

### **Decision: React Native with Expo (Managed Workflow)**
**Why?** The alignment with your existing Next.js + TypeScript knowledge base significantly reduces friction. Expo EAS solves the painful mobile build process. Modern React Native (with Reanimated and FlashList) meets the 60fps interaction standard.

## 2. The "MobileArch" Stack

To satisfy the "Senior Architect" standards for modularity and performance:

### **A. Core Architecture**
*   **Framework:** **Expo SDK 52** (Latest stable).
*   **Routing:** **Expo Router v3**. Uses file-based routing matching Next.js App Router paradigm.
*   **Language:** **TypeScript Strict Mode**. Essential for AI safety and code quality.

### **B. State Management**
*   **Global State:** **Zustand**. selected for simplicity and exact match to your Web stack.
    *   *Usage:* AuthUser, Theme preferences, Temporary creation flow state.
*   **Server State:** **TanStack Query (React Query)**.
    *   *Usage:* Caching API responses, infinite scroll pagination, background refetching. Avoids putting API data in Redux/Zustand.

### **C. UI & Styling**
*   **Styling Engine:** **NativeWind v4** (TailwindCSS for Native).
    *   *Benefit:* Copypaste styles from your Next.js project.
*   **Component Primitives:** **Radix UI Primitive equivalents** (via `rn-primitives` or `Tamagui` headless) + **Lucide React Native** for icons.
*   **Animations:** **React Native Reanimated 3**. Required for "Native Feel" (shared element transitions, gesture handling).

### **D. Data & Networking**
*   **HTTP Client:** **Axios** (configured with Interceptors for Auth).
*   **Local Storage:** **Expo SecureStore** (for JWT Tokens) + **MMKV** (for super fast non-sensitive preferences).

### **E. Quality Assurance**
*   **Linting:** ESLint + Prettier (Shared config).
*   **Testing:** `jest-expo` + `@testing-library/react-native`.

## 3. Deployment Strategy (CI/CD)
*   **Platform:** **Expo Application Services (EAS)**.
*   **Channels:**
    *   `development`: Simulator builds.
    *   `preview`: PR builds (QR code for stakeholders).
    *   `production`: Store submission automation.
