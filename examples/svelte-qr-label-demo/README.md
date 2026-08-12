# svelte-qr-label-demo

**Interactive Svelte 5 & SvelteKit demo for `svelte-qr-label`.**

This application demonstrates embedding the visual drag-and-drop QR Label Designer into a SvelteKit app, managing custom sticker templates, executing live entity data bindings, and printing thermal ZPL or PDF badges.

---

## Features

- **Sticker Studio**: Create, edit, duplicate, and delete QR sticker layouts.
- **Entity Master**: Sample data manager for Employees and Machinery with real-time barcode / QR label previews.
- **Export Capabilities**: Client-side PDF export, PNG download, and Zebra thermal printer ZPL output.
- **Svelte 5 Runes**: Built using `$state`, `$derived`, `$effect`, and `untrack()` for smooth state synchronization and continuous property drawer editing.

---

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Check TypeScript & Format**:
   ```bash
   npm run check
   npm run lint
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```
