# **API Contract & Interfaces**

**Base URL:** http://localhost:8000/api/v1 (Environment Variable: `NEXT_PUBLIC_API_URL`)

## **Authentication**

*   **Mechanism:** Bearer Token (JWT).
*   **Storage:** `localStorage` key: `access_token` (Managed by `useAuthStore`).

## **TypeScript Interfaces**

The frontend types are defined in `src/lib/types.ts`. Below is a reference summary:

```typescript
export interface User {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
}

export interface Design {
  id: string;
  title: string;
  description: string;
  materials: string; // Comma-separated string
  created_at: string;
  user_id: string;
  images: DesignImage[];
  author?: Profile;
  stats?: {
    likes: number;
    comments: number;
    is_liked_by_me: boolean;
  };
}

export interface Comment {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    design_id: string;
    author: Profile;
}
```

## **Key Endpoints**

| Feature | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | POST | `/auth/login` | Login user |
| | POST | `/auth/register` | Register new user |
| **Feed** | GET | `/designs` | Filterable list (`?q=&skip=&limit=`) |
| **Design** | GET | `/designs/{id}` | Get details |
| | POST | `/designs` | Create (`multipart/form-data`) |
| **Interact** | POST | `/designs/{id}/like` | Toggle like |
| | GET | `/designs/{id}/comments` | Get comments |
| | POST | `/designs/{id}/comments` | Add comment |
