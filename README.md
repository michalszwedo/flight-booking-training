# Training Flights

A small, browser-only flight search and simulated booking demonstration. All flights are fictional and no ticket or reservation is created.

## Requirements

- Node.js and npm

## Run locally

From this directory, install dependencies and start the development server:

```powershell
npm.cmd install
npm.cmd run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Open `http://127.0.0.1:5173`. Stop the server with Ctrl+C.

To create and preview a production build:

```powershell
npm.cmd run build
npm.cmd run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

Open `http://127.0.0.1:4173` for the local preview. A fresh checkout can use `npm.cmd ci` before building.

## Sample checks

- Search BLR to DEL on 2026-11-20; TR101 and TR102 should appear.
- Select TR101, keep `Test Traveller`, set two passengers, and confirm; the total should be INR 10,000 and the reference should begin with `TRAIN-`.
- Search BOM to DEL or choose another date; a no-flights message should appear.
- Try identical airports, a blank passenger name, or passenger counts 0, 7, and 1.5; the app should show validation and no confirmation.
- Refresh after confirmation; the confirmation clears because booking state is held only in React memory.

## Limits and AI use

The app uses local dummy data only. It has no backend, external API, authentication, payment, persistent storage, seat inventory, or real booking capability. Use only the sample passenger name; do not enter real traveller details.

Implemented with GitHub Copilot assistance. Human checks should verify the sample searches, validation, simulated confirmation, responsive layout, and local production preview.
