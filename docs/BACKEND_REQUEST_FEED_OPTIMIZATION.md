# Backend Optimization Request: Feed Performance

## Current Issue
The frontend currently experiences an N+1 fetching issue on the feed. 
1. `GET /designs` is called to fetch the list of designs.
2. For *each* design returned, the frontend must make a separate `GET /profiles/{user_id}` call to display the author's name and avatar.
This results in 20+ simultaneous API calls on initial load, significantly degrading performance.

## Requested Solution
Please update the `GET /api/v1/designs` endpoint to include the `author` and `stats` objects nested within each design item in the response.

### Required Data Structure
The response item for a design should look like this (TypeScript interface reference):

```typescript
interface DesignResponse {
  id: string;
  title: string;
  description: string;
  created_at: string;
  user_id: string;
  
  // Images (Essential for feed)
  images: {
    id: string;
    url: string;
    is_primary: boolean;
  }[];

  // [NEW] Embed Author Profile
  author: {
    id: string;
    username: string;
    avatar_url: string;
    // full_name, bio, etc. are optional for the card, but good to have
  };

  // [NEW] Embed Stats
  stats: {
    likes: number;
    views: number;
    comments: number;
    is_liked_by_me: boolean; // Requires authenticated user context
  };
}
```

## Impact
- **Reduces Network Requests**: Reduces initial load from ~21 requests (1 list + 20 profiles) to **1 request**.
- **Improves UX**: Eliminates "pop-in" of user avatars and names after the card rendering.
- **Simplifies Frontend**: allows us to remove complex detailed fetching logic from individual list items.
