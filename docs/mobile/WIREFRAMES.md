# Mobile Screen Wireframes & UI Defines

This document translates the "Sitemap" into concrete component directives for the AI Builder.

## 1. Global Navigation Components
*   **TabBar:** Fixed bottom. Height 60px. Blur/Glass effect. Icons: Home, Search, Plus (Circle Highlight), Heart, User.
*   **Header:** Standard stack header. Back button (Chevron) on nested screens. Title centered. Action button (e.g., "Save") on right.

---

## 2. Screen: Home Feed (`/(tabs)/index.tsx`)
**Goal:** Maximum visual browsing speed.

*   **Layout:** `MasonryFlashList` (2 columns).
*   **Item Component (`FeedCard`):**
    *   **Image:** Aspect Ratio maintained. Rounded corners (md).
    *   **Footer Overlay:** Gradient fade on bottom of image.
    *   **Data:** Title (White text, truncated 1 line), Author Avatar (Small circle), Like Button (Heart icon).
*   **Interactions:**
    *   *Tap:* Navigate to `design/[id]`.
    *   *Long Press:* Show context menu (Share, Report).

---

## 3. Screen: Design Detail (`/design/[id].tsx`)
**Goal:** Immersive viewing and interaction.

*   **Header:** Transparent status bar. Back button floating on top-left (with blur background).
*   **Content (ScrollView):**
    *   **Hero Image:** Full width. Height ~50% of screen.
    *   **Info Block:**
        *   Row: Title (H1) | Like Button (Animated).
        *   Row: Author Avatar | "By @Username" | Follow Button.
    *   **Description:** Text with "Read more" expander.
    *   **Materials Tags:** Horizontal ScrollView of Chips (e.g., #Denim, #Cotton).
    *   **Before/After:** If available, a toggle or swipeable carousel to show original item vs result.
    *   **Comments Section:** Preview of last 3 comments + "View all".

---

## 4. Screen: Create Design (`/(tabs)/create.tsx` -> Modal)
**Goal:** Frictionless capture.

*   **Step 1: Media Picker**
    *   **View:** Split screen. Top half = Camera view. Bottom half = Recent gallery images grid.
    *   **Action:** Shutter button (Center).
*   **Step 2: Editor (Overlay)**
    *   **Image:** Selected image centered.
    *   **Tools:** Crop, Rotate (Bottom bar icons).
    *   **Next:** "Next" button top-right.
*   **Step 3: Metadata**
    *   **Form:**
        *   Input: "Give it a title..." (No label, large placeholder).
        *   Input: "Description" (Multiline).
        *   Selector: "Materials used" (Tag auto-complete).
    *   **Submit:** "Post Design" (Full width button, bottom pinned).

---

## 5. Screen: Profile (`/(tabs)/profile.tsx`)
**Goal:** Identity and Portfolio.

*   **Header:** Settings Icon (Top Right).
*   **Identity:**
    *   Large Avatar (Centered).
    *   Stats Row: Post Count | Followers | Following.
    *   Bio text.
*   **Tabs (Sticky Header):** "My Designs" | "Saved".
*   **Grid:** 3-column square grid of images.

---

## 6. Components Library (Primitives)
*   `Button.tsx`: Variants (Primary, Ghost, Outline). Haptic feedback on press.
*   `Avatar.tsx`: Fallback to initials if image fails.
*   `Input.tsx`: Custom styled TextInput with label animation.
*   `ScreenLayout.tsx`: Wrapper for SafeAreaView and StatusBar management.
