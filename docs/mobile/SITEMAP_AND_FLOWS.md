# Sitemap & User Flows

## 1. Navigation Structure
We will use a standard **Bottom Tab Bar** for primary navigation to ensure thumb-reachability and familiarity.

### **Tab Bar Items:**
1.  **Home (Feed):** The personalized masonry feed of Redesigns.
2.  **Explore:** Search, Categories, and Trending tags.
3.  **Create (+):** Central, prominent button to start a new design.
4.  **Activity:** Notifications (Likes, Comments).
5.  **Profile:** User's portfolio, specific "Saved" collections, and Settings.

## 2. Sitemap Hierarchy

*   **Auth (Stack)**
    *   Splash Screen
    *   Login / Register
    *   Onboarding (Quick walkthrough)

*   **Main (Tabs)**
    *   **Tab 1: Home**
        *   Feed (Filterable via top chips)
        *   *Design Detail View (Pushed onto stack)*
    *   **Tab 2: Explore**
        *   Search Input (Sticky top)
        *   Category Grid
        *   Search Results List
    *   **Tab 3: Create (Modal)**
        *   Camera / Gallery Picker
        *   Image Editor (Crop/Rotate)
        *   Metadata Form (Title, Description, Materials)
        *   Success/Share Screen
    *   **Tab 4: Activity**
        *   Notification List
    *   **Tab 5: Profile**
        *   User Info (Avatar, Bio)
        *   My Designs Grid
        *   Saved Items Grid
        *   *Settings (Pushed onto stack)*

## 3. Key User Flows (Mobile Optimized)

### **Flow A: The "Instant Capture" (Create)**
1.  User taps central **(+)** button.
2.  **Camera opens** immediately (permission requested if needed).
3.  User takes photo(s) OR selects from gallery.
4.  **Quick Edit:** Simple crop to ensured aspect ratio.
5.  **Details:** User adds Title and selects Materials (Tags).
6.  **Post:** Uploads in background; user returned to Feed.

### **Flow B: The "Immersive Discovery" (Browse)**
1.  User scrolls the vertical masonry feed.
2.  **Double-tap** a card to Like (Heart animation).
3.  **Tap** a card to view Design Details (Full screen transaction).
4.  User can swipe right to go back to feed.
