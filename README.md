# Rived - Upcycling Fashion Social Network

**Rived** is a visual-first platform dedicated to the upcycling fashion community. It empowers creators to share their redesigns, discover inspiration, and connect with like-minded individuals.

## 🚀 Key Features

*   **Discovery Feed**: An infinite masonry grid of upcycled fashion designs.
*   **Authentication**: Secure Login and Registration flow (JWT-based).
*   **Create & Share**: Upload your own redesigns (`Drag & Drop`) with detailed descriptions and material lists.
*   **Social Interaction**: Like and comment on designs to engage with the community.
*   **Profile**: Manage your own portfolio of designs.

## 🛠 Tech Stack

*   **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
*   **Language**: TypeScript
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn/ui](https://ui.shadcn.com/)
*   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
*   **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)
*   **Forms**: React Hook Form + Zod
*   **Testing**: Vitest + React Testing Library

## 🏁 Getting Started

### Prerequisites

*   Node.js 18+
*   npm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-repo/fe-rived.git
    cd fe-rived
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    npm i --legacy-peer-deps (if conflicts arise)
    ```

3.  **Environment Setup:**
    Create a `.env.local` file in the root directory:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
    NEXT_PUBLIC_SITE_URL=http://localhost:3000
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📂 Project Structure

```
src/
├── app/
│   ├── (auth)/        # Login/Register routes (Centered layout)
│   ├── (main)/        # Public Feed & Details (Navbar layout)
│   ├── (protected)/   # Auth-guarded routes (Create, Profile)
│   └── layout.tsx     # Root layout with Providers
├── components/
│   ├── auth/          # Auth forms and guards
│   ├── create/        # Upload & Creation widgets
│   ├── design/        # Design details & Comments
│   ├── main/          # Feed & Discovery components
│   └── ui/            # Shadcn UI primitives
├── lib/               # Utilities, API client, Zod schemas
└── store/             # Global state (Auth)
```

## 🧪 Testing

Run the test suite with:

```bash
npm test
```

## 🤝 Contributing

Please read `docs/10_ONBOARDING_GUIDE.md` for details on how to add new features and follow the architectural standards.
