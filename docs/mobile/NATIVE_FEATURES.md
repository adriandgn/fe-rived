# Native Features & UX/UI Guidelines

## 1. Leveraging Native Capabilities

To make the app feel "at home" on the device, we will abuse specific mobile hardware features:

### **Camera & Media**
*   **Direct Interaction:** Allow taking photos directly within the "Create" flow.
*   **image Processing:** Local compression and cropping before upload to save data/battery.

### **Touch & Gestures**
*   **Pull-to-Refresh:** Standard gesture on all feeds and lists.
*   **Swipe-to-Back:** iOS standard navigation behavior.
*   **Double-Tap:** Quick "Like" action on images.
*   **Pinch-to-Zoom:** Inspect details of high-res redesign photos.

### **Haptics**
*   **Success Feedback:** Light vibration when a post is published or an action completes.
*   **Interaction:** Subtle tick when liking or tapping tab bar items.

### **Notifications**
*   **Push:** "Someone liked your redesign", "New comment on your post".
*   **Deep Linking:** Tapping a notification opens the specific Design Detail screen directly.

## 2. Integration with OS
*   **Share Sheet:** Use the native OS share sheet (iOS/Android) for sharing designs to Instagram/WhatsApp.
*   **Files/Gallery:** Native picker for selecting multiple images for a carousel post.

## 3. UI Guidelines (Mobile Specific)
*   **Touch Targets:** Minimum 44x44pt for all interactive elements.
*   **Typography:** Use System fonts (San Francisco on iOS, Roboto/Product Sans on Android) or the brand font *Inter* adjusted for readability on small screens.
*   **Navigation:** Avoid "Hamburger Menus" for primary actions. Use the Bottom Tab Bar.
*   **States:** Clear loading skeletons (shimmer) instead of spinners for data fetching.
