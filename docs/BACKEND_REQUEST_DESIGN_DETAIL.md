# Backend Optimization Request: Design Detail View

## Current Issue
Loading the design detail page triggers multiple sequential and parallel API calls, causing a "waterfall" effect and slower Time to Interactive (TTI).
Currently observed calls:
1. `GET /designs/{id}`
2. `GET /profiles/{user_id}` (Author info)
3. `GET /designs/{id}/comments` (Initial comments)
4. `GET /designs/{id}/likes` (Triggered by UI components)

## Requested Solution
Please update the **single item** endpoint `GET /api/v1/designs/{id}` to include embedded data for author, stats, and a preview of comments.

### Required Data Structure
The response should allow us to render the page with a **single request**.

```typescript
interface DesignDetailResponse {
  // --- Existing Fields ---
  id: string;
  title: string;
  description: string;
  materials: string; // or string[]
  created_at: string;
  user_id: string;
  images: { id: string; url: string; is_primary: boolean }[];
  
  // --- [NEW] Embed Author (Full Details) ---
  author: {
    id: string;
    username: string;
    full_name?: string;
    bio?: string;
    avatar_url: string;
  };

  // --- [NEW] Embed Stats ---
  stats: {
    likes: number;
    views: number;
    comments: number; // Count
    is_liked_by_me: boolean;
  };

  // --- [NEW] Embed Initial Comments ---
  // Please return the first ~10 comments so we can display the section without a second fetch.
  comments?: {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    author: {
        username: string;
        avatar_url: string;
    };
  }[];
}
```

## Impact
- **Performance**: Reduces initial network requests from **4** to **1**.
- **UX**: Eliminates loading spinners for author info and comment counts.
- **Frontend Logic**: Allows us to remove immediate side-effect fetches in `DesignDetailsPage` and `CommentsSection`.
