# **API Contract & Interfaces**

**Base URL:** http://localhost:8000/api/v1 (Environment Variable: NEXT\_PUBLIC\_API\_URL)

## **Authentication**

* **Mechanism:** Bearer Token (JWT).  
* **Storage:** localStorage key: access\_token.

## **TypeScript Interfaces (Source of Truth)**

1. // User & Profile  
2. export interface User {  
3.   id: string;  
4.   email: string;  
5.   username: string;  
6. }  
7.   
8. export interface Profile {  
9.   id: string;  
10.   username: string;  
11.   full\_name?: string;  
12.   bio?: string;  
13.   avatar\_url?: string; // Public URL  
14. }  
15.   
16. // Design Content  
17. export interface DesignImage {  
18.   id: string;  
19.   url: string; // Public URL  
20.   is\_primary: boolean;  
21. }  
22.   
23. export interface Design {  
24.   id: string;  
25.   title: string;  
26.   description: string;  
27.   materials: string;  
28.   created\_at: string;  
29.   user\_id: string;  
30.   images: DesignImage\[\];  
31.   // Assuming mapped from backend or separate call  
32.   author?: Profile;   
33.   stats?: {  
34.     likes: number;  
35.     comments: number;  
36.     is\_liked\_by\_me: boolean; // Derived from interaction endpoint  
37.   };  
38. }  
39.   
40. // Pagination  
41. export interface PaginatedResponse\<T\> {  
42.   items: T\[\];  
43.   total: number;  
44.   page: number;  
45.   size: number;  
46. }

## **Key Endpoints Map**

1. **Feed:** GET /designs/?skip=0\&limit=20  
2. **Design Detail:** GET /designs/{id}  
3. **Like:** POST /designs/{id}/like  
4. **Comments:** GET /designs/{id}/comments

