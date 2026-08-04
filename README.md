# Mappa

Your world, mapped. A local, privacy-first travel tracking app.

Track which countries you've visited, plan future trips, and visualize your travel statistics — all stored locally in your browser with no account required.

## Features

- Interactive world map with 195 countries (zoom, pan, hover tooltips, click to change status)
- Mark countries as visited, planned, or not visited
- Country details: ratings, notes, cities, tags, visit dates, photos
- Statistics dashboard with charts (continent breakdown, timeline, status distribution)
- Search, filter, and sort countries by name, continent, status, or rating
- Command palette (Cmd+K) for quick navigation
- Import/export data as JSON
- Dark mode (light/dark/system)
- Multiple map projections (Equal Earth, Mercator, Natural Earth)
- PWA: installable and works offline
- Responsive: desktop, tablet, and mobile layouts

## Getting Started

```bash
npm install
npm run dev
```

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- Zustand (state management)
- Dexie.js (IndexedDB)
- react-simple-maps (world map)
- Recharts (statistics charts)
- Radix UI (accessible primitives)
- vite-plugin-pwa (offline support)

## Privacy

All data is stored locally in your browser (IndexedDB + localStorage). No accounts, no tracking, no external connections.
