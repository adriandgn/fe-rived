# Backend Optimization Request: Designer Profile

## Current Issue
The designer profile page (`/designer/:username`) triggers a "waterfall" of dependencies:
1. `GET /profiles/by-username/:username` (Resolve username to ID)
2. `GET /profiles/:id/stats` (Fetch stats like total likes/views)
3. `GET /designs?user_id=:id` (Fetch portfolio)

This causes a slow initial render and layout shifts.

## Requested Solution
Please update the `GET /api/v1/profiles/by-username/{username}` endpoint to include embedded `stats` and an initial selection of `designs`.

### Required Data Structure
The response should allow rendering the entire profile header and first page of grid items in one go.

```typescript
interface DesignerProfileResponse {
  // --- Existing Profile Fields ---
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  
  // --- [NEW] Embed Stats ---
  stats: {
    total_designs: number;
    total_likes: number;
    total_views: number;
    followers_count: number;
    following_count: number;
  };

  // --- [NEW] Embed Initial Designs (Portfolio) ---
  // Return the first 20 items (same as default pagination)
  // This allows us to render the grid immediately.
  designs: {
    items: Design[]; // Standard Design object
    total: number;
    skip: number;
    limit: number;
  };
}
```

## Impact
- **Performance**: Reduces 3 critical layout-blocking requests to **1**.
- **UX**: Immediate render of profile header + grid.
- **Frontend**: Removes need for client-side daisy-chaining (fetch profile -> get ID -> fetch stats/designs).
