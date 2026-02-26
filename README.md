## KnowledgeHub Frontend

This is the **frontend** for the KnowledgeHub project – a small knowledge‑sharing web app where authenticated users can write, edit, and read technical articles, with optional AI assistance for improving content, suggesting tags, and showing summaries.

> Note: The backend is a separate service (Spring Boot / Java in this project). This README only covers the **frontend**.

---

## Tech Stack

- **Build tool**: Vite (`vite` + `@vitejs/plugin-react-swc`)
- **Language**: TypeScript
- **UI library**: React 18
- **Routing**: `react-router-dom` v6
- **Data fetching / caching**: `@tanstack/react-query`
- **HTTP client**: `axios`
- **Rich text editor**: `react-quill`

All dependencies are defined in `package.json`.

---

## Project Structure (high level)

Some of the most important folders/files:

- `src/main.tsx`  
  React entry point. Sets up:
  - `BrowserRouter` for client‑side routing
  - `QueryClientProvider` for React Query
  - `AuthProvider` for authentication context
  - Global styles (`styles.css`) and `react-quill` theme

- `src/App.tsx`  
  Main application shell. Renders:
  - `Navbar`
  - Route configuration:
    - `/login`, `/signup` – public auth screens
    - `/` – home feed (article listing, search/filter)
    - `/articles/new` – create article
    - `/articles/:id` – article detail
    - `/articles/:id/edit` – edit article
    - `/dashboard` – “My articles” dashboard
  Most routes are wrapped in `ProtectedRoute` to require authentication.

- `src/api/client.ts`  
  Axios client with:
  - `baseURL` pointing to the backend (e.g. `http://localhost:8080`)
  - Auth token interceptor (reads `localStorage.token` and sets `Authorization: Bearer ...`)

- `src/api/types.ts`  
  Shared TypeScript types used across the app. For example:
  - `Article` (id, title, summary, category, content, tags, author info, timestamps)
  - `ArticleRequestPayload`

- `src/context/AuthContext.tsx`  
  Authentication context + hooks:
  - Stores the current user and token
  - Exposes `login`, `logout`, etc.
  - Used by `ProtectedRoute` and other components.

- `src/pages/*`  
  Route-level components:
  - `HomePage.tsx` – Article list with search/category filter (uses `@tanstack/react-query` + `api.get('/api/articles')`).
  - `ArticleDetailPage.tsx` – Full article view, delete button for the author, uses `api.get('/api/articles/:id')`.
  - `NewArticlePage.tsx` – Create a new article with:
    - Title, category, tags
    - Rich text content (`RichTextEditor` / `react-quill`)
    - **AI actions**:
      - “Improve with AI” → `POST /api/ai/improve`
      - “Suggest tags” → `POST /api/ai/tags`
  - `EditArticlePage.tsx` – Edit an existing article (similar to `NewArticlePage`, but loads and updates an existing record).
  - `DashboardPage.tsx` – Displays “My articles” from `GET /api/articles/me`, with:
    - **Summary** button per article (opens a modal, calls `GET /api/ai/summary/{id}` and shows a short textual summary).
  - `LoginPage.tsx`, `SignupPage.tsx` – Authentication forms.

- `src/components/*`  
  Reusable UI pieces, like:
  - `components/layout/Navbar.tsx` – Top navigation and links.
  - `components/articles/ArticleCard.tsx` – Card used in article listings (title, category, author, created date, summary, tags).
  - `components/editor/RichTextEditor.tsx` – React Quill wrapper for article content.

- `src/styles.css`  
  Global styling for:
  - Layout (`app-root`, `app-main`)
  - Cards, tags, badges, buttons, forms
  - Modal overlay and “AI Summary” popup on the dashboard
  - Auth pages and general typography

---

## Getting Started (Local Development)

### Prerequisites

- **Node.js**: 18+ recommended
- **npm**: latest stable (or `pnpm`/`yarn` if you prefer and adapt commands)
- **Backend**: The KnowledgeHub backend should be running locally (commonly on `http://localhost:8080`) so that the frontend API calls succeed.

### Install dependencies

From the `KnowledgeHub-frontend` folder:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Vite will print a local URL, typically:

```text
http://localhost:5173/
```

Open that in your browser to view the app.

### Build for production

```bash
npm run build
```

This outputs a production build to the `dist` folder.

### Preview the production build

After building:

```bash
npm run preview
```

Vite will serve the built assets so you can test the production bundle locally.

---

## Environment & API Integration

The frontend talks to the backend through the Axios instance in `src/api/client.ts`.

- **Base URL**: configured in `src/api/client.ts` as `API_BASE_URL` (e.g. `http://localhost:8080`).
- **Auth**: The Axios interceptor automatically attaches the `Authorization` header from `localStorage.getItem('token')`.

Key endpoints used by the frontend include (names may vary slightly with your backend):

- `POST /api/auth/login` / `POST /api/auth/signup` – authentication.
- `GET /api/articles` – public feed with optional search / category filters.
- `GET /api/articles/:id` – load a single article for detail view.
- `POST /api/articles` – create a new article.
- `PUT /api/articles/:id` – update an article.
- `DELETE /api/articles/:id` – delete an article.
- `GET /api/articles/me` – list articles authored by the currently logged‑in user (dashboard).
- `POST /api/ai/improve` – AI “Improve with AI” for article content.
- `POST /api/ai/tags` – AI “Suggest tags” from content.
- `GET /api/ai/summary/{id}` – AI or backend‑generated summary for an article, used in the dashboard “Summary” modal.

Make sure these endpoints exist and match your backend implementation (adjust paths if you changed them).

---

## Authentication & Protected Routes

- Authentication state is stored in `AuthContext` and wrapped at the top level in `main.tsx`.
- `ProtectedRoute` is used in `App.tsx` to guard most routes:
  - If the user is not logged in, they are redirected to `/login`.
  - After login, the user is redirected back into the app (e.g. `/` or `/dashboard`).
- The backend is expected to return a JWT token (or similar) which is stored in `localStorage` and attached to future API calls.

---

## AI‑Powered Features

This frontend integrates with AI‑related endpoints provided by the backend:

- **Improve with AI** (on the new/edit article pages)
  - Calls `POST /api/ai/improve` with the current title + content.
  - Updates the editor with improved text while keeping the author’s voice.

- **Suggest tags**
  - Calls `POST /api/ai/tags` with article content.
  - Returns a list of tags which are combined into the tags input.

- **Dashboard Summary modal**
  - Each article in `/dashboard` has a **Summary** button.
  - Opens a modal:
    - Shows a short “local” summary immediately (based on existing summary/content).
    - Shows a “Thinking…” indicator for ~2 seconds.
    - Calls `GET /api/ai/summary/{id}`; if successful, updates the summary text.
    - If the AI call fails, the local short summary remains visible, so the UX still feels smooth.

---

## Using ChatGPT in This Project

While working on this frontend, **ChatGPT was used as an assistant** to:

- Understand and document the overall flow of the app (routing, API calls, and context usage).
- Explain where specific features (like the “Improve with AI” button and the dashboard “Summary” modal) live in the codebase.
- Propose small UI/UX improvements (e.g. modal behavior, loading states).
- Help draft this README, including describing the tech stack, features, and how the AI endpoints are wired into the UI.

All actual code changes and decisions were reviewed and applied manually in the repository.

---

## Running With the Backend

To have all features working (especially AI and authenticated routes), you should:

1. Start the backend (Spring Boot application) on the same base URL configured in `src/api/client.ts` (e.g. `http://localhost:8080`).
2. Start the frontend with `npm run dev`.
3. Open `http://localhost:5173/` in your browser.

You should then be able to:

- Sign up and log in.
- Create, edit, and delete articles.
- Use “Improve with AI” and “Suggest tags”.
- View your own articles on the dashboard and click **Summary** to see short AI‑driven summaries.

---

## Future Enhancements (Ideas)

- Add form validation and inline error messages on all forms.
- Add pagination or infinite scroll on the home feed.
- Improve mobile responsiveness and accessibility (ARIA roles, focus handling in modals, etc.).
- Add a simple settings/profile page to manage user info.
- Introduce a design system or component library for more consistent styling.

