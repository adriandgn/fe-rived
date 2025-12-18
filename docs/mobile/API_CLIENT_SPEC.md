# API Client Specification (Dart/TS)

Since we chose **TypeScript (React Native)**:

## 1. Type Generation
We will use `openapi-typescript` to auto-generate TS interfaces from your backend's Swagger/OpenAPI JSON.

**Command Workflow:**
```bash
# 1. Pull schema from running backend
curl http://localhost:8000/openapi.json > schema.json
# 2. Generate types
npx openapi-typescript schema.json -o src/types/api.d.ts
```

## 2. Axios Client Setup (`src/core/api/client.ts`)

```typescript
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// CHANGE THIS for Android Emulator (10.0.2.2) vs iOS Simulator (localhost)
// Use ENV variables for real app
const BASE_URL = 'http://localhost:8000/api/v1'; 

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Inject Token
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Handle 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // TODO: Trigger Token Refresh Flow here
      // If fail, redirect to Login
    }
    return Promise.reject(error);
  }
);
```

## 3. Data Fetching Hooks (TanStack Query)

Pattern: Create a hook for every API endpoint group.

**Example: `useFeed.ts`**
```typescript
import { useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';
import { DesignFeedResponse } from '@/types/api';

export const useFeed = () => {
  return useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await apiClient.get<DesignFeedResponse>(
        `/designs?page=${pageParam}`
      );
      return data;
    },
    getNextPageParam: (lastPage) => lastPage.next_page,
    initialPageParam: 1,
  });
};
```

## 4. API Endpoints Map (MVP)
Based on current Backend capabilities:

| Method | Endpoint | Purpose | Mobile Optimizations |
| :--- | :--- | :--- | :--- |
| POST | `/auth/login` | Get JWT | Store securely immediately. |
| GET | `/designs` | Feed | Needs `limit` and `offset/page` params. |
| GET | `/designs/{id}` | Detail | Fetch comments in parallel if possible. |
| POST | `/designs` | Create | **Multipart/form-data** for Image Upload. |
| POST | `/designs/{id}/like` | Like | Optimistic update on client. |
