# Scaffold

A drag-and-drop website builder. Compose a landing page from blocks, edit them
on a live canvas, and watch changes save themselves to the cloud. Export the
result as a standalone HTML file that runs anywhere with no server.

Built as a portfolio project to demonstrate a complete full-stack application:
authentication, per-user cloud persistence with debounced auto-save,
drag-and-drop, an undo/redo history, and safe HTML generation.

## Live demo

Coming soon, deploying to Vercel.

## Screenshots

> Add screenshots here: the dashboard, the builder with a block selected, the
> preview modal, and an exported page.

## What it demonstrates

| Capability | How it shows up |
| --- | --- |
| Authentication | Google sign-in, auth-gated routes, redirect on session state |
| Cloud persistence | Firestore documents scoped to the signed-in user |
| Auto-save | 1500ms debounce with a four-state status indicator |
| Drag and drop | Reorderable canvas built on dnd-kit |
| Undo/redo | Hand-rolled history with coalescing of rapid edits |
| Code generation | Standalone HTML export with XSS-safe escaping |
| Security | Firestore rules that make ownership the database's problem, not the client's |

## Tech stack

| Choice | Why |
| --- | --- |
| **Next.js 14 (App Router)** | File-based routing, and a deployment target (Vercel) with a free tier. The App Router's server/client split keeps the auth provider at the root without prop drilling. |
| **TypeScript** | The block model is a discriminated union. The compiler catches a missing renderer for a new block type at build time rather than at runtime. |
| **Tailwind CSS** | The design system is a fixed palette of nine tokens. Utility classes keep that consistent without a parallel stylesheet to maintain. |
| **Zustand** | The builder needs frequent, granular updates from many components. Zustand's selector subscriptions re-render only the components that read a changed slice, and its store is readable outside React (`getState()`), which the save controller relies on. |
| **Firebase Auth + Firestore** | Managed auth and a document store with declarative security rules. No backend to write or host for a project of this size. |
| **dnd-kit** | Accessible, pointer and keyboard aware, and unopinionated about rendering, unlike the older react-dnd. |
| **Radix UI** | Unstyled, accessible dialog primitives with focus trapping and escape handling already correct. |
| **Framer Motion** | Enter and exit animation for the toast. `AnimatePresence` handles the exit, which CSS alone cannot do for an unmounting element. |

## Architecture

### The block data model

A page is an ordered array of blocks. Each block is self-contained:

```ts
type Block = {
  id: string                        // crypto.randomUUID()
  type: BlockType                   // 'hero' | 'features' | ...
  props: Record<string, unknown>    // per-type content and colors
}
```

Three parallel maps in `lib/blockSchemas.ts` are keyed by `BlockType`:
`BLOCK_DEFAULTS` (initial props), `BLOCK_SCHEMAS` (the field definitions the
property editor renders), and `BLOCK_LABELS` (display names). Because they are
typed as `Record<BlockType, ...>`, adding a block type to the union produces
compile errors at every place that must be updated. `BlockRenderer` has a
`never` exhaustiveness guard for the same reason.

Blocks are stored as plain JSON on the project document, so the whole page is a
single read and a single write. There is no per-block document and no join.

### Why Zustand with a manual history instead of a library

Undo/redo libraries (`zundo`, `redux-undo`) snapshot the entire store on every
action. The builder's store also holds `selectedId`, `saveStatus`, and project
metadata, and none of those belong in the history. Selecting a block or a save
completing would create undo entries that do nothing visible when reverted,
which reads as broken.

The store keeps `past: Block[][]` and `future: Block[][]` holding only the
blocks array. Every mutating action pushes the current blocks to `past` and
clears `future`, capped at 50 entries.

One subtlety this makes possible: property fields fire on every keystroke, so a
naive implementation pushes one history entry per character and evicts every
real undo step within a single sentence. `updateBlockProps` coalesces
consecutive edits to the same block and field within 700ms into one entry, so
undo steps back a whole edit rather than a letter. Any other action resets the
window.

### The auto-save debounce strategy

Edits mark the project dirty immediately, then a 1500ms timer runs. Each new
edit cancels and restarts it, so a burst of typing produces one write instead of
one per keystroke.

The timer and the last-saved snapshot live at module scope in `lib/save.ts`
rather than inside a component. This matters: the auto-save effect lives on the
builder page and the Ctrl+S handler lives in the toolbar, and both must control
the same pending write. With a component-local timer, a manual save could not
cancel the queued automatic one and both would hit Firestore.

Two further details:

- **Change detection, not effect firing.** The effect compares a JSON snapshot
  of `{ name, blocks }` against the last persisted one. Without this, loading a
  project would immediately trigger a write of the data just read.
- **Edits during a write.** `saveNow` captures the snapshot before awaiting. If
  the document changed while the request was in flight, the status returns to
  `unsaved` rather than falsely reporting `saved`.

Status is surfaced as `saved`, `saving`, `unsaved`, or `error`, with a retry
button on failure. Navigating back to the dashboard flushes a pending save
first, so leaving mid-debounce does not drop the last edit.

### How HTML export works, and why escaping matters

`generateHTML(blocks)` walks the array and concatenates one snippet per block
into a complete document with a CSS reset, the Inter webfont, and per-block-type
classes. Colors and sizes are inlined as `style` attributes because they are
per-instance user values.

Every text value passes through `escapeHtml`, which converts `& < > " '` to
entities. The reason is concrete: block props are arbitrary user text
interpolated into markup. A headline of `<script>...</script>` would otherwise
execute in the exported file, and in the preview iframe.

Escaping text alone is not sufficient. The hero and CTA blocks have URL fields,
and `<a href="javascript:...">` is a valid attribute that no amount of entity
encoding neutralises. `safeUrl()` allows only `http`, `https`, `mailto`, `tel`,
fragment, and root-relative URLs, and collapses anything else to `#`. The
preview iframe additionally runs with `sandbox=""`, which blocks script
execution outright.

## Local setup

```bash
git clone https://github.com/Banukajanith2/Scaffold-Website-Builder-App.git
cd Scaffold-Website-Builder-App
npm install
cp .env.example .env.local
```

Fill `.env.local` with your Firebase web config, then:

```bash
npm run dev
```

Open http://localhost:3000.

## Firebase setup

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. Add a **Web app** to it and copy the config values into `.env.local`:

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   NEXT_PUBLIC_FIREBASE_APP_ID=
   ```

3. **Authentication** to **Get started**, enable the **Google** provider, and set
   a support email. Creating the project does not provision auth; this step is
   required or sign-in fails with `CONFIGURATION_NOT_FOUND`.
4. **Firestore Database** to **Create database**, pick a region (this cannot be
   changed later), and start in **production mode**.
5. Open the **Rules** tab, paste the contents of [`firestore.rules`](firestore.rules),
   and **Publish**. Production mode defaults to denying everything, so without
   this the dashboard shows "Missing or insufficient permissions" after sign-in.

`localhost` is an authorized domain by default. When you deploy, add your
production domain under Authentication to Settings to Authorized domains.

### A note on the API key

The Firebase config ships in the client bundle and is readable by anyone. This
is expected: the key identifies the project, it does not grant access. Data is
protected by the security rules in step 5, which check `request.auth.uid`
against the document's `userId` on the server. The key alone cannot read or
write anything.

## Deploying to Vercel

1. Push the repository to GitHub.
2. At [vercel.com](https://vercel.com), import the repo. The framework preset is
   detected automatically.
3. Under **Settings to Environment Variables**, add all six
   `NEXT_PUBLIC_FIREBASE_*` values.
4. Deploy, then add the resulting domain to Firebase's authorized domains.

This is a standard Next.js app, not a static export, and it runs on Vercel's
Hobby plan, which does not require a credit card.

## Known limitations

- **No collaborative editing.** Two tabs editing the same project will overwrite
  each other; the last write wins. Real-time sync would need Firestore listeners
  and conflict resolution.
- **Whole-document writes.** Each save writes the full blocks array. Fine at
  this scale, wasteful for very long pages.
- **No image blocks.** Every block is text and color only. Images would need
  Firebase Storage and an upload flow.
- **Projects are sorted client-side.** `getUserProjects` filters by `userId` and
  sorts in memory, because combining an equality filter with `orderBy` on a
  different field requires a composite index. Fine for one user's projects, not
  for thousands.
- **History is in memory.** Undo state is lost on refresh.
- **No block nesting.** The page is a flat list; there are no columns or
  containers.
- **Desktop only.** The three-column builder has no responsive layout below
  roughly 1024px. Exported pages are responsive.

## Possible improvements

- Live collaboration with Firestore snapshot listeners and presence
- Image and video blocks backed by Firebase Storage
- Custom block templates a user can save and reuse
- Publish to a public URL instead of downloading a file
- Responsive breakpoint controls per block
- A block nesting model for multi-column layouts

## Scripts

```bash
npm run dev     # development server
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```
