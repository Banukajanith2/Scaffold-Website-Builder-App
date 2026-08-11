# Scaffold

A drag-and-drop website builder. Compose a landing page from pre-built blocks,
edit them on a live canvas, save to the cloud, and export standalone HTML.

Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Firebase Auth,
Firestore, and dnd-kit.

## Features

**Authentication**
- Google sign-in via Firebase Auth
- Route guards that redirect based on auth state
- Per-user data isolation enforced by Firestore security rules

**Dashboard**
- Grid of saved projects with relative "last edited" timestamps
- Create a project from a dialog, delete with confirmation
- Optimistic delete that rolls back if the write fails

**Builder**
- Three-column layout: block picker, canvas, property editor
- Six block types: Hero, Features Grid, Testimonial, Text, Call to Action, Footer
- Drag-and-drop reordering with dnd-kit
- Undo and redo, capped at 50 history entries, with Ctrl+Z / Ctrl+Y
- Inline project rename
- Live preview in a new tab, and HTML export as a standalone file

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 14, App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | Zustand |
| Auth and data | Firebase Auth, Cloud Firestore |
| Drag and drop | dnd-kit |
| UI primitives | Radix UI, lucide-react |

## Getting started

Install dependencies:

```bash
npm install
```

Create `.env.local` from the template and fill in your Firebase web config:

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

In the Firebase console:

1. Enable **Authentication** and turn on the **Google** sign-in provider.
2. Create a **Cloud Firestore** database in production mode.
3. Paste the contents of [`firestore.rules`](firestore.rules) into the Rules tab
   and publish. These restrict every document to the user who owns it.

Run the dev server:

```bash
npm run dev
```

## Project structure

```
app/
  layout.tsx           root layout, wraps the app in AuthProvider
  page.tsx             redirects to /dashboard or /login
  login/               Google sign-in
  dashboard/           project list, create and delete
  builder/[id]/        the editor
components/
  AuthProvider.tsx     subscribes to Firebase auth state
  AuthGuard.tsx        wraps protected pages
  builder/
    Toolbar.tsx        rename, undo/redo, save status, preview, export
    BlockPicker.tsx    left sidebar of block types
    Canvas.tsx         dnd-kit sortable canvas
    SortableBlock.tsx  drag handle, duplicate, delete
    PropertyEditor.tsx right sidebar
    blocks/            one renderer per block type
lib/
  firebase.ts          app, auth, db singletons
  auth.ts              sign-in, sign-out, auth subscription
  firestore.ts         project CRUD
  blockSchemas.ts      defaults, field schemas, labels
  exportHtml.ts        standalone HTML generation
store/
  authStore.ts         current user and loading flag
  builderStore.ts      blocks, selection, undo/redo history
types/
  index.ts             shared types
```

## Notes

`getUserProjects` filters by `userId` and sorts in memory rather than using
`orderBy`. Pairing an equality filter with an `orderBy` on a different field
requires a composite Firestore index, and this avoids that for what is only ever
one user's own projects.

The HTML exporter escapes all user text and restricts link hrefs to `http`,
`https`, `mailto`, `tel`, fragment, and root-relative URLs, so an exported page
cannot carry an executable `javascript:` link.

## Status

Phase 1 (auth and dashboard) and Phase 2 (builder canvas, drag and drop, block
renderers) are complete. Property editing and auto-save are next.
