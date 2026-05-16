 TaskFlow — Task Management Dashboard

A responsive React task dashboard for creating, editing, filtering, and tracking tasks with persistent storage, list/card views, dark/light mode, and drag-and-drop reordering.

Live demo: `https://task-dashboard-liart-nine.vercel.app/` 

Repository: `https://github.com/Dinesh-chaudhary1406/Task-Dashboard.git` 
---

## Features

| Requirement | Implementation |
|-------------|----------------|
| Task creation | Modal with title, description, priority (Low/Medium/High), due date |
| Task display | List view + card view toggle |
| Edit tasks | Modal-based editing |
| Delete tasks | Confirmation dialog before delete |
| Status management | Checkbox toggle; strikethrough, opacity, and color for completed tasks |
| Search & filter | Search by title/description; filter by status and priority |
| Task counts | Total, pending, and completed stats |
| Data persistence | `localStorage` (survives page refresh) |
| Responsive design | Mobile, tablet, and desktop layouts |

### Bonus

- Card / list view toggle (persisted)
- Dark / light theme (persisted)
- Drag-and-drop reorder (`@dnd-kit`)
- Animations (`framer-motion`)
- TypeScript throughout
- Unit tests (Jest + React Testing Library)

---

## Screenshots

### Dashboard (dark mode, card view)

![Dashboard — dark mode, card view](./docs/screenshots/dashboard-dark-cards.png)

### Dashboard (list view)

![Dashboard — list view](./docs/screenshots/dashboard-list.png)

### Create / edit task modal

![Task modal](./docs/screenshots/task-modal.png)

### Light mode

![Dashboard — light mode](./docs/screenshots/dashboard-light.png)




## Tech stack

- **React 19** + **TypeScript**
- **Vite** — dev server and production build
- **Tailwind CSS** — styling and responsive layout
- **@dnd-kit** — accessible drag-and-drop
- **Framer Motion** — transitions and micro-interactions
- **Jest** + **Testing Library** — unit tests

---

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ (20+ recommended)
- npm 9+

### Install and run locally

```bash
git clone https://github.com/Dinesh-chaudhary1406/Task-Dashboard.git
cd task-dashboard
npm install
npm run dev
```

Open **http://localhost:5173/** in your browser.


### Other commands

```bash
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
npm test         # Run unit tests
npm run lint     # ESLint
```

---


## Design decisions

1. **Modal over inline edit** — Keeps the list/card layout stable on mobile and groups validation (required title and due date) in one place.
2. **localStorage** — Meets persistence requirements without a backend; includes cross-tab sync via the `storage` event.
3. **Debounced search (300ms)** — Reduces re-filtering while typing.
4. **Visual status cues** — Completed tasks use checkbox state, strikethrough, reduced opacity, and a green left border instead of a separate text badge to reduce clutter.
5. **CSS variables + Tailwind** — Theme tokens in `index.css` enable dark/light mode with one `.light` class on `<html>`.
6. **Custom hooks** — `useTasks`, `useLocalStorage`, and `useTheme` separate data/UI concerns from presentational components.
7. **Drag-and-drop on filtered lists** — Reorder applies to visible tasks; hidden tasks keep relative order (acceptable trade-off for a client-only app).

---

## Project structure

```
src/
├── components/     # UI (TaskCard, TaskList, FilterBar, modals, …)
├── hooks/          # useTasks, useLocalStorage, useTheme, useDebounce
├── utils/          # filter/sort helpers
├── types.ts        # Shared TypeScript types
├── App.tsx         # Layout and wiring
└── main.tsx        # Entry point
```

---

## Testing

```bash
npm test
```



## Author

[Dinesh Chaudhary] — [devchaudhary5082@gmail.com]
