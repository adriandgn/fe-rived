# **Testing Strategy & Quality Assurance**

## **Testing Stack**

* **Unit & Integration:** Vitest \+ React Testing Library.  
* **End-to-End (E2E):** Playwright.  
* **Mocking:** MSW (Mock Service Worker) for network layer (optional for MVP, preferred direct mocking).

## **Testing Pyramid Layers**

### **1\. Unit Tests (Scope: Utilities & Hooks)**

* **Goal:** Validate logic in isolation.  
* **Targets:**  
  * lib/utils.ts: Helper functions.  
  * store/use-auth-store.ts: State changes (login/logout actions).  
  * lib/schemas/\*: Zod validation schemas (ensure invalid data throws).

### **2\. Component Integration Tests (Scope: UI Components)**

* **Goal:** Ensure components render and interact correctly.  
* **Targets:**  
  * DesignCard: Verify it renders image, title, and handles "Like" click event.  
  * LoginForm: Verify validation errors appear on empty submit.  
* **Tooling:** render, screen, fireEvent from @testing-library/react.

### **3\. End-to-End (E2E) Tests (Scope: Critical User Flows)**

* **Goal:** Simulate real user scenarios in a browser environment.  
* **Critical Flows to Cover (MVP):**  
  1. **Authentication:** Signup \-\> Login \-\> Redirect to Home.  
  2. **Discovery:** Load Feed \-\> Scroll \-\> Navigate to Details.  
  3. **Protection:** Try to access /create without login \-\> Verify Redirect.  
  4. **Creation:** Login \-\> Go to Create \-\> Upload Stub Image \-\> Submit \-\> Verify Success Message.

## **Automation & CI**

* **Pre-commit:** Run tsc (Type check) and Linting.  
* **CI Pipeline:** Run Unit Tests on every PR. Run E2E on merge to main.